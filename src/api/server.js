import express from "express";
import Web3 from "web3";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON files manually instead of importing them
const BatchRegistryABI = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../contracts/BatchRegistryABI.json'), 'utf8')
);

// Get contract address from config
// Either read from file or create a config.js that uses module.exports
let contractAddress;
try {
  const configPath = path.resolve(__dirname, '../../contracts/config.js');
  // For CommonJS config file
  if (fs.existsSync(configPath)) {
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);
    const config = require(configPath);
    contractAddress = config.contractAddress;
  } else {
    // Fallback if file doesn't exist
    contractAddress = process.env.CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
    console.warn("Config file not found, using fallback contract address:", contractAddress);
  }
} catch (error) {
  console.error("Error loading contract address:", error);
  contractAddress = "0x0000000000000000000000000000000000000000";
}

// Initialize Web3 with an HTTP provider for server-side
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Replace with your Ethereum node URL
const batchContract = new web3.eth.Contract(BatchRegistryABI, contractAddress);

// Function to transform blockchain batch data to app format
const transformBatchData = (blockchainBatch, batchId) => {
  return {
    id: batchId,
    medicineName: blockchainBatch.medicineName,
    manufacturingDate: blockchainBatch.manufacturingDate,
    expiryDate: blockchainBatch.expiryDate,
    quantity: parseInt(blockchainBatch.quantity),
    manufacturerName: blockchainBatch.manufacturerName,
    status: transformStatus(parseInt(blockchainBatch.status)),
    signatures: blockchainBatch.signatures.map(sig => ({
      role: sig.role,
      timestamp: new Date(parseInt(sig.timestamp) * 1000).toISOString(),
      organizationName: sig.organizationName,
      userName: sig.userName,
      isVerified: true
    })),
    createdAt: new Date(parseInt(blockchainBatch.createdAt) * 1000).toISOString(),
    creator: blockchainBatch.creator
  };
};

// Helper function to transform status code to string
const transformStatus = (statusCode) => {
  const statuses = ['registered', 'in-transit', 'delivered', 'flagged'];
  return statuses[statusCode] || 'registered';
};

// Middleware to parse JSON
app.use(express.json());

// API endpoint to verify a batch
app.get("/verify-batch/:id", async (req, res) => {
  try {
    const batchId = req.params.id;
    console.log("Batch ID: ", batchId);
    
    // Get batch data directly from blockchain
    const batchData = await batchContract.methods.getBatch(batchId).call();
    
    // Transform data to your app format
    const formattedBatch = transformBatchData(batchData, batchId);
    
    console.log("batch: ", formattedBatch);
    
    // Return batch data
    res.json({
      success: true,
      batch: formattedBatch
    });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch batch information",
      details: error.message
    });
  }
});

// API endpoint to get all batches
app.get("/batches", async (req, res) => {
  try {
    // Get all batch IDs
    const batchIds = await batchContract.methods.getAllBatchIds().call();
    
    // Get detailed data for each batch
    const batchPromises = batchIds.map(id => 
      batchContract.methods.getBatch(id).call()
    );
    
    // Wait for all promises to resolve
    const batchesData = await Promise.all(batchPromises);
    
    // Transform blockchain data into app's format
    const formattedBatches = batchesData.map((batch, index) => 
      transformBatchData(batch, batchIds[index])
    );
    
    res.json({
      success: true,
      batches: formattedBatches
    });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch batch information",
      details: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});