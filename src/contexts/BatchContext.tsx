import { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';
import { useAuth } from './AuthContext'; // Assuming you have this context

// Import the contract ABI and address (you would need to create these files)
import BatchRegistryABI from "/home/arjun-rishi/medchain-trust-tracker-v003/contracts/BatchRegistryABI.json"
import { contractAddress } from '/home/arjun-rishi/medchain-trust-tracker-v003/contracts/config.js';

const BatchContext = createContext(undefined);

export const BatchProvider = ({ children }) => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [batchNotifications, setBatchNotifications] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [batchContract, setBatchContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Web3 and contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          // Initialize contract
          const contract = new web3Instance.eth.Contract(BatchRegistryABI, contractAddress);
          setBatchContract(contract);
        } catch (error) {
          console.error("User denied account access or error occurred:", error);
        }
      } else if (window.web3) {
        const web3Instance = new Web3(window.web3.currentProvider);
        setWeb3(web3Instance);
        const contract = new web3Instance.eth.Contract(BatchRegistryABI, contractAddress);
        setBatchContract(contract);
      } else {
        console.log('Non-Ethereum browser detected. Consider using MetaMask!');
      }
    };

    initWeb3();
  }, []);

  // Load batches from blockchain
  useEffect(() => {
    const loadBatchesFromBlockchain = async () => {
      if (!batchContract) return;
      
      try {
        console.log("batchContract: ",batchContract)
        setIsLoading(true);
        const batchIds = await batchContract.methods.getAllBatchIds().call();
        
        const batchPromises = batchIds.map(id => 
          batchContract.methods.getBatch(id).call()
        );
        
        const batchesData = await Promise.all(batchPromises);
        
        // Transform blockchain data into app's format
        const formattedBatches = batchesData.map((batch, index) => {
          const signatures = batch.signatures.map(sig => ({
            role: sig.role,
            timestamp: new Date(sig.timestamp * 1000).toISOString(),
            organizationName: sig.organizationName,
            userName: sig.userName,
            isVerified: true
          }));
          
          return {
            id: batchIds[index],
            medicineName: batch.medicineName,
            manufacturer: batch.manufacturer,
            expiryDate: batch.expiryDate,
            status: transformStatus(batch.status),
            signatures: signatures,
            createdAt: new Date(batch.createdAt * 1000).toISOString(),
            creator: batch.creator
          };
        });
        
        setBatches(formattedBatches);
      } catch (error) {
        console.error("Error loading batches from blockchain:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Helper function to transform numeric status to string
    const transformStatus = (statusCode) => {
      const statuses = ['in-transit', 'delivered', 'flagged'];
      return statuses[statusCode] || 'in-transit';
    };

    loadBatchesFromBlockchain();
  }, [batchContract]);

  // Load notifications from localStorage (we'll keep this for now)
  useEffect(() => {
    const storedNotifications = localStorage.getItem('medchain_notifications');
    if (storedNotifications) {
      setBatchNotifications(JSON.parse(storedNotifications));
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    if (batchNotifications.length > 0) {
      localStorage.setItem('medchain_notifications', JSON.stringify(batchNotifications));
    }
  }, [batchNotifications]);

  const registerBatch = async (batchData) => {
    if (!user || !batchContract || !web3) return;
    
    try {
      const batchId = generateBatchId(); // You'll need to implement this function
      
      // Get current account
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      console.log("current: ",currentAccount,accounts);
      
      const manufacturer = batchData.manufacturer || "Unknown Manufacturer";
      const medicineName = batchData.medicineName || "Unknown Medicine";
      const expiryDate = batchData.expiryDate || "Unknown";
      const role = user.role || "Unknown Role";
      const organization = user.organization || "Unknown Organization";
      const userName = user.name || "Unknown User";
      // Call smart contract method
      console.log("Registering batch with params:", {
        batchId,
        medicineName,
        manufacturer,
        expiryDate,
        role,
        organization,
        userName
    });
    
      await batchContract.methods.registerBatch(
        batchId,
        medicineName,
        manufacturer,
        expiryDate,
        role,
        organization,
        userName
    ).send({ from: currentAccount });
      
      // After blockchain confirmation, refresh batches from blockchain
      const newBatch = await batchContract.methods.getBatch(batchId).call();
      
      // Format the new batch for our app's state
      const formattedBatch = {
        id: batchId,
        medicineName: newBatch.medicineName,
        manufacturer: newBatch.manufacturer,
        expiryDate: newBatch.expiryDate,
        status: 'in-transit',
        signatures: [{
          role: user.role,
          timestamp: new Date().toISOString(),
          organizationName: user.organization || 'Unknown Organization',
          userName: user.name,
          isVerified: true
        }],
        createdAt: new Date().toISOString(),
        creator: currentAccount
      };
      
      // Update local state
      setBatches(prevBatches => [...prevBatches, formattedBatch]);
      console.log("batches: ",newBatch);
      // Add notification
      addNotification(`New batch ${batchId} for ${formattedBatch.medicineName} registered`, batchId);
      
      return batchId;
    } catch (error) {
      console.error("Error registering batch on blockchain:", error);
      addNotification(`Error registering batch: ${error.message}`, null);
    }
  };
  
  const signBatch = async (batchId) => {
    if (!user || !batchContract || !web3) return;
    
    try {
      // Get current account
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      
      // Call smart contract method
      await batchContract.methods.signBatch(
        batchId,
        user.role,
        user.organization || 'Unknown Organization',
        user.name
      ).send({ from: currentAccount });
      
      // After blockchain confirmation, refresh batch from blockchain
      const updatedBatch = await batchContract.methods.getBatch(batchId).call();
      const signatures = await batchContract.methods.getSignatures(batchId).call();
      
      // Update local state
      setBatches(prevBatches => 
        prevBatches.map(batch => {
          if (batch.id === batchId) {
            // Format signatures
            const formattedSignatures = signatures.map(sig => ({
              role: sig.role,
              timestamp: new Date(sig.timestamp * 1000).toISOString(),
              organizationName: sig.organizationName,
              userName: sig.userName,
              isVerified: true
            }));
            
            // Update batch with new signatures and status
            return {
              ...batch,
              signatures: formattedSignatures,
              status: transformStatus(updatedBatch.status)
            };
          }
          return batch;
        })
      );
      
      addNotification(`Batch ${batchId} signed by ${user.role} ${user.name}`, batchId);
    } catch (error) {
      console.error("Error signing batch on blockchain:", error);
      addNotification(`Error signing batch: ${error.message}`, batchId);
    }
  };
  
  const getBatch = (batchId) => {
    return batches.find(batch => batch.id === batchId);
  };
  
  const reportFakeBatch = async (batchId, reason) => {
    if (!user || !batchContract || !web3) return;
    
    try {
      // Get current account
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      
      // Call smart contract method
      await batchContract.methods.flagBatch(
        batchId,
        reason
      ).send({ from: currentAccount });
      
      // After blockchain confirmation, refresh batch from blockchain
      const updatedBatch = await batchContract.methods.getBatch(batchId).call();
      
      // Update local state
      setBatches(prevBatches => 
        prevBatches.map(batch => {
          if (batch.id === batchId) {
            return {
              ...batch,
              status: 'flagged'
            };
          }
          return batch;
        })
      );
      
      addNotification(`⚠️ Batch ${batchId} reported as potentially fake by ${user.role} ${user.name}. Reason: ${reason}`, batchId);
    } catch (error) {
      console.error("Error reporting fake batch on blockchain:", error);
      addNotification(`Error reporting batch: ${error.message}`, batchId);
    }
  };
  
  const addNotification = (message, batchId) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      batchId,
      timestamp: new Date().toISOString(),
      read: false
    };
    setBatchNotifications(prev => [newNotification, ...prev]);
  };
  
  const clearBatchNotification = (id) => {
    setBatchNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Helper function to transform status
  // const transformStatus = (statusCode) => {
  //   const statuses = ['in-transit', 'delivered', 'flagged'];
  //   return statuses[statusCode] || 'in-transit';
  // };
  
  // Helper function to generate a unique batch ID
  const generateBatchId = () => {
    return `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // Helper function to get verified batches
  const getVerifiedBatches = (allBatches, currentUser) => {
    if (!currentUser) return [];
    
    return allBatches.filter(batch => 
      batch.status !== 'flagged' && 
      batch.signatures.some(sig => sig.role === currentUser.role)
    );
  };

  const getAllBatchData = async () => {
    if (!batchContract || !web3) {
      console.error("Web3 or contract not initialized");
      return [];
    }
    
    try {
      // Step 1: Get all batch IDs
      const batchIds = await batchContract.methods.getAllBatchIds().call();
      console.log("Retrieved batch IDs:", batchIds);
      
      // Step 2: Get detailed data for each batch
      const batchPromises = batchIds.map(id => 
        batchContract.methods.getBatch(id).call()
      );
      
      // Wait for all promises to resolve
      const batchesData = await Promise.all(batchPromises);
      
      // Step 3: Transform blockchain data into app's format
      const formattedBatches = batchesData.map((batch, index) => {
        // Get signatures for this batch
        const signatures = batch.signatures.map(sig => ({
          role: sig.role,
          timestamp: new Date(parseInt(sig.timestamp) * 1000).toISOString(),
          organizationName: sig.organizationName,
          userName: sig.userName,
          isVerified: true
        }));
        
        // Format the batch data
        return {
          id: batchIds[index],
          medicineName: batch.medicineName,
          manufacturer: batch.manufacturer,
          expiryDate: batch.expiryDate,
          status: transformStatus(parseInt(batch.status)),
          signatures: signatures,
          createdAt: new Date(parseInt(batch.createdAt) * 1000).toISOString(),
          creator: batch.creator
        };
      });
      
      console.log("Formatted batch data:", formattedBatches);
      return formattedBatches;
    } catch (error) {
      console.error("Error fetching batch data from blockchain:", error);
      return [];
    }
  };
  // In your BatchProvider component
useEffect(() => {
  const loadBatchesFromBlockchain = async () => {
    if (batchContract) {
      setIsLoading(true);
      try {
        const batches = await getAllBatchData();
        setBatches(batches);
      } catch (error) {
        console.error("Failed to load batches:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  loadBatchesFromBlockchain();
}, [batchContract]);

// Add a refresh function that can be called from the UI
const refreshBatches = async () => {
  setIsLoading(true);
  try {
    const batches = await getAllBatchData();
    setBatches(batches);
    return batches;
  } catch (error) {
    console.error("Failed to refresh batches:", error);
    return [];
  } finally {
    setIsLoading(false);
  }
};
  // Helper function to transform status code to string
  const transformStatus = (statusCode) => {
    const statuses = ['in-transit', 'delivered', 'flagged'];
    return statuses[statusCode] || 'in-transit';
  };
  
  return (
    <BatchContext.Provider
      value={{
        batches,
        registerBatch,
        signBatch,
        getBatch,
        reportFakeBatch,
        verifiedBatches: getVerifiedBatches(batches, user),
        batchNotifications,
        clearBatchNotification,
        selectedBatch,
        setSelectedBatch,
        isLoading,
        refreshBatches
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (context === undefined) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};