import { useState, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';
import { useAuth, UserRole } from './AuthContext';
import { initializeApp } from 'firebase/app';
import { 
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
  child,
  query,
  orderByChild,
  equalTo,
  onValue
} from 'firebase/database';

// Import the contract ABI and address
import BatchRegistryABI from "../../contracts/BatchRegistryABI.json"
import { contractAddress } from '../../contracts/config.js';
import { Batch } from '@/types/batch';

// Firebase configuration - should be in an env file in production
const firebaseConfig = {
  apiKey: "AIzaSyByYYFUMM-q5UhgGpurAXxN14i4VWSqeVw",
  authDomain: "medchain-3a22f.firebaseapp.com",
  projectId: "medchain-3a22f",
  storageBucket: "medchain-3a22f.firebasestorage.app",
  messagingSenderId: "454135776190",
  appId: "1:454135776190:web:2d3dd591891f56091aafef",
  measurementId: "G-BP9H6GTVJW",
  databaseURL: "https://medchain-3a22f-default-rtdb.firebaseio.com" // Add this line for Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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

  // Load batches from both blockchain and Firebase Realtime Database
  useEffect(() => {
    const loadBatches = async () => {
      setIsLoading(true);
      try {
        // Load from blockchain
        const blockchainBatches = await loadBatchesFromBlockchain();
        
        // Load from Firebase Realtime Database
        const firebaseBatches = await loadBatchesFromFirebase();
        
        // Merge batches giving preference to blockchain data
        const mergedBatches = mergeBatchData(blockchainBatches, firebaseBatches);
        
        setBatches(mergedBatches);
      } catch (error) {
        console.error("Error loading batches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (batchContract) {
      loadBatches();
    }
  }, [batchContract]);

  // Setup realtime listener for batches
  useEffect(() => {
    const batchesRef = ref(database, 'batches');
    
    const unsubscribe = onValue(batchesRef, async (snapshot) => {
      if (batchContract) {
        try {
          // When data changes in Firebase, reload both sources and merge
          const blockchainBatches = await loadBatchesFromBlockchain();
          const firebaseBatches = [];
          
          snapshot.forEach((childSnapshot) => {
            const batchData = childSnapshot.val();
            firebaseBatches.push({
              ...batchData,
              id: childSnapshot.key,
              source: 'firebase'
            });
          });
          
          const mergedBatches = mergeBatchData(blockchainBatches, firebaseBatches);
          setBatches(mergedBatches);
        } catch (error) {
          console.error("Error updating batches in real-time:", error);
        }
      }
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [batchContract]);

  // Load notifications from localStorage
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

  // Helper function to load batches from blockchain
  const loadBatchesFromBlockchain = async () => {
    if (!batchContract) return [];
    
    try {
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
          manufacturingDate: batch.manufacturingDate,
          expiryDate: batch.expiryDate,
          quantity: parseInt(batch.quantity),
          manufacturerName: batch.manufacturerName,
          status: transformStatus(batch.status),
          signatures: signatures,
          createdAt: new Date(batch.createdAt * 1000).toISOString(),
          creator: batch.creator,
          source: 'blockchain'
        };
      });
      
      return formattedBatches;
    } catch (error) {
      console.error("Error loading batches from blockchain:", error);
      return [];
    }
  };

  // Helper function to load batches from Firebase Realtime Database
  const loadBatchesFromFirebase = async () => {
    try {
      const batchesRef = ref(database, 'batches');
      const snapshot = await get(batchesRef);
      
      const firebaseBatches = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const batchData = childSnapshot.val();
          firebaseBatches.push({
            ...batchData,
            id: childSnapshot.key,
            source: 'firebase'
          });
        });
      }
      
      return firebaseBatches;
    } catch (error) {
      console.error("Error loading batches from Firebase:", error);
      return [];
    }
  };

  // Helper function to merge batch data from both sources
  const mergeBatchData = (blockchainBatches, firebaseBatches) => {
    const batchMap = new Map();
    
    // First, add all blockchain batches
    blockchainBatches.forEach(batch => {
      batchMap.set(batch.id, batch);
    });
    
    // Then, add Firebase batches only if they don't exist in blockchain
    firebaseBatches.forEach(batch => {
      if (!batchMap.has(batch.id)) {
        batchMap.set(batch.id, batch);
      }
    });
    
    return Array.from(batchMap.values());
  };

  const registerBatch = async (batchData) => {
    if (!user) return;
    
    try {
      const batchId = generateBatchId();
      
      // Create batch object
      const timestamp = new Date().toISOString();
      const newBatch = {
        id: batchId,
        medicineName: batchData.medicineName || "Unknown Medicine",
        manufacturingDate: batchData.manufacturingDate || new Date().toISOString().split('T')[0],
        expiryDate: batchData.expiryDate || "Unknown",
        quantity: batchData.quantity || 0,
        manufacturerName: batchData.manufacturerName || "Unknown Manufacturer",
        status: 'registered', // Default status
        signatures: [{
          role: user.role,
          timestamp: timestamp,
          organizationName: user.organization || 'Unknown Organization',
          userName: user.name,
          isVerified: true
        }],
        createdAt: timestamp,
        creator: user.id || 'unknown'
      };
      
      // Try to register on blockchain
      let blockchainSuccess = false;
      if (batchContract && web3) {
        try {
          // Get current account
          const accounts = await web3.eth.getAccounts();
          const currentAccount = accounts[0];
          
          // Call smart contract method
          await batchContract.methods.registerBatch(
            batchId,
            newBatch.medicineName,
            newBatch.manufacturingDate,
            newBatch.expiryDate,
            newBatch.quantity,
            newBatch.manufacturerName,
            user.role,
            user.organization || 'Unknown Organization',
            user.name
          ).send({ from: currentAccount });
          
          blockchainSuccess = true;
          console.log("Batch registered on blockchain successfully");
        } catch (error) {
          console.error("Error registering batch on blockchain:", error);
          addNotification(`Blockchain registration failed, saving to Firebase only: ${error.message}`, batchId);
        }
      }
      
      // Register on Firebase Realtime Database regardless of blockchain success
      try {
        const batchRef = ref(database, `batches/${batchId}`);
        await set(batchRef, {
          ...newBatch,
          blockchainVerified: blockchainSuccess,
          updatedAt: new Date().toISOString() // Realtime Database doesn't have serverTimestamp()
        });
        console.log("Batch registered on Firebase Realtime Database successfully");
      } catch (error) {
        console.error("Error registering batch on Firebase:", error);
        if (blockchainSuccess) {
          addNotification(`Firebase backup failed but blockchain registration successful`, batchId);
        } else {
          addNotification(`Registration failed on both platforms: ${error.message}`, null);
          throw error; // Re-throw if both failed
        }
      }
      
      // Update local state is handled by onValue listener
      
      // Add notification
      addNotification(
        `New batch ${batchId} for ${newBatch.medicineName} registered${blockchainSuccess ? ' on blockchain and' : ' only on'} Firebase`, 
        batchId
      );
      
      return batchId;
    } catch (error) {
      console.error("Error in batch registration process:", error);
      addNotification(`Error registering batch: ${error.message}`, null);
      throw error;
    }
  };
  
  const signBatch = async (batchId) => {
    if (!user) return;
    
    const batch = getBatch(batchId);
    if (!batch) {
      console.error("Batch not found");
      return;
    }
    
    const signatureData = {
      role: user.role,
      timestamp: new Date().toISOString(),
      organizationName: user.organization || 'Unknown Organization',
      userName: user.name,
      isVerified: true
    };
    
    // Try to sign on blockchain
    let blockchainSuccess = false;
    if (batchContract && web3 && batch.source !== 'firebase-only') {
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
        
        blockchainSuccess = true;
        console.log("Batch signed on blockchain successfully");
      } catch (error) {
        console.error("Error signing batch on blockchain:", error);
      }
    }
    
    // Sign on Firebase Realtime Database regardless of blockchain success
    try {
      const batchRef = ref(database, `batches/${batchId}`);
      
      // First check if the batch exists in Firebase
      const snapshot = await get(batchRef);
      
      if (snapshot.exists()) {
        // Get current data
        const batchData = snapshot.val();
        
        // Update existing batch
        const updatedSignatures = [...(batchData.signatures || []), signatureData];
        const updatedStatus = getNextStatus(batchData.status, user.role);
        
        await update(batchRef, {
          signatures: updatedSignatures,
          status: updatedStatus,
          updatedAt: new Date().toISOString(),
          blockchainSignatureSuccess: blockchainSuccess
        });
      } else {
        // Create new batch in Firebase if it only exists on blockchain
        const updatedBatch = {
          ...batch,
          signatures: [...batch.signatures, signatureData],
          status: getNextStatus(batch.status, user.role),
          updatedAt: new Date().toISOString(),
          blockchainSignatureSuccess: blockchainSuccess
        };
        
        await set(batchRef, updatedBatch);
      }
      
      console.log("Batch signed on Firebase Realtime Database successfully");
    } catch (error) {
      console.error("Error signing batch on Firebase:", error);
      if (!blockchainSuccess) {
        addNotification(`Failed to sign batch: ${error.message}`, batchId);
        return;
      }
    }
    
    // Update local state is handled by onValue listener
    
    addNotification(
      `Batch ${batchId} signed by ${user.role} ${user.name}${blockchainSuccess ? ' on blockchain and' : ' only on'} Firebase`, 
      batchId
    );
  };
  
  const reportFakeBatch = async (batchId, reason) => {
    if (!user) return;
    
    // Try to report on blockchain
    let blockchainSuccess = false;
    if (batchContract && web3) {
      try {
        // Get current account
        const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
        
        // Call smart contract method
        await batchContract.methods.flagBatch(
          batchId,
          reason
        ).send({ from: currentAccount });
        
        blockchainSuccess = true;
        console.log("Batch flagged on blockchain successfully");
      } catch (error) {
        console.error("Error flagging batch on blockchain:", error);
      }
    }
    
    // Update on Firebase Realtime Database regardless of blockchain success
    try {
      const batchRef = ref(database, `batches/${batchId}`);
      
      await update(batchRef, {
        status: 'flagged',
        flagReason: reason,
        flaggedBy: {
          role: user.role,
          userName: user.name,
          organizationName: user.organization || 'Unknown Organization',
          timestamp: new Date().toISOString()
        },
        updatedAt: new Date().toISOString(),
        blockchainFlagSuccess: blockchainSuccess
      });
      
      console.log("Batch flagged on Firebase Realtime Database successfully");
    } catch (error) {
      console.error("Error flagging batch on Firebase:", error);
      if (!blockchainSuccess) {
        addNotification(`Failed to report batch: ${error.message}`, batchId);
        return;
      }
    }
    
    // Update local state is handled by onValue listener
    
    addNotification(
      `⚠️ Batch ${batchId} reported as potentially fake by ${user.role} ${user.name}. Reason: ${reason}`, 
      batchId
    );
  };
  
  const getBatch = (batchId) => {
    return batches.find(batch => batch.id === batchId);
  };
  
  const addNotification = (message, batchId) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      batchId,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Save notification to Firebase Realtime Database
    const notificationRef = ref(database, `notifications/${newNotification.id}`);
    set(notificationRef, newNotification).catch(error => {
      console.error("Error saving notification to Firebase:", error);
    });
    
    setBatchNotifications(prev => [newNotification, ...prev]);
  };
  
  // Setup realtime listener for notifications
  useEffect(() => {
    const notificationsRef = ref(database, 'notifications');
    
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        const notificationsData = [];
        snapshot.forEach((childSnapshot) => {
          notificationsData.push(childSnapshot.val());
        });
        
        // Sort by timestamp descending
        notificationsData.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setBatchNotifications(notificationsData);
      }
    });
    
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  
  const clearBatchNotification = (id) => {
    // Update in Firebase Realtime Database
    const notificationRef = ref(database, `notifications/${id}`);
    update(notificationRef, { read: true }).catch(error => {
      console.error("Error updating notification in Firebase:", error);
    });
    
    // Local state will be updated by the onValue listener
  };
  
  // Helper function to transform status code to string
  const transformStatus = (statusCode) => {
    const statuses = ['registered', 'in-transit', 'delivered', 'flagged'];
    return statuses[statusCode] || 'registered';
  };
  
  // Helper function to determine next status based on role
  const getNextStatus = (currentStatus, role) => {
    if (currentStatus === 'flagged') return 'flagged';
    
    const statusFlow = {
      'registered': 'in-transit',
      'in-transit': 'delivered',
      'delivered': 'delivered'
    };
    
    return statusFlow[currentStatus] || currentStatus;
  };
  
  // Helper function to generate a unique batch ID
  const generateBatchId = () => {
    return `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };
  
  // Helper function to get verified batches
  const getVerifiedBatches = (
    batches,
    user
  ) => {
    if (!user) return [];
    
    if (user.role === 'manufacturer') {
      return batches.filter(batch => batch.manufacturerName === user.name);
    }
    
    const roleOrder = ['manufacturer', 'distributor', 'wholesaler', 'retailer', 'consumer'];
    const userRoleIndex = roleOrder.indexOf(user.role);
    
    if (userRoleIndex <= 0) return [];
    
    const previousRole = roleOrder[userRoleIndex - 1];
    
    return batches.filter(batch => 
      batch.signatures.some(sig => sig.role === previousRole) && 
      !batch.signatures.some(sig => sig.role === user.role)
    );
  };
  
  // Function to refresh batches from both sources
  const refreshBatches = async () => {
    setIsLoading(true);
    try {
      // Load from blockchain
      const blockchainBatches = await loadBatchesFromBlockchain();
      
      // Load from Firebase
      const firebaseBatches = await loadBatchesFromFirebase();
      
      // Merge batches giving preference to blockchain data
      const mergedBatches = mergeBatchData(blockchainBatches, firebaseBatches);
      
      setBatches(mergedBatches);
      return mergedBatches;
    } catch (error) {
      console.error("Failed to refresh batches:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to sync Firebase with blockchain data
  const syncFirebaseWithBlockchain = async () => {
    try {
      // Load latest data from blockchain
      const blockchainBatches = await loadBatchesFromBlockchain();
      
      // Update each batch in Firebase Realtime Database
      for (const batch of blockchainBatches) {
        const batchRef = ref(database, `batches/${batch.id}`);
        await set(batchRef, {
          ...batch,
          blockchainVerified: true,
          updatedAt: new Date().toISOString()
        });
      }
      
      console.log("Firebase successfully synchronized with blockchain data");
      addNotification("Firebase database synchronized with blockchain", null);
      
      // Refresh batches
      await refreshBatches();
    } catch (error) {
      console.error("Error synchronizing Firebase with blockchain:", error);
      addNotification(`Error synchronizing: ${error.message}`, null);
    }
  };
  
  // Example of querying data by specific fields
  const getBatchesByStatus = async (status) => {
    try {
      const batchesRef = ref(database, 'batches');
      const statusQuery = query(batchesRef, orderByChild('status'), equalTo(status));
      const snapshot = await get(statusQuery);
      
      const results = [];
      snapshot.forEach((childSnapshot) => {
        results.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      return results;
    } catch (error) {
      console.error(`Error getting batches with status ${status}:`, error);
      return [];
    }
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
        refreshBatches,
        syncFirebaseWithBlockchain,
        getBatchesByStatus, // Added new function for querying
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