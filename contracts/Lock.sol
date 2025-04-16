// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BatchRegistry {
    enum Status { InTransit, Delivered, Flagged }

    struct Signature {
        string role;
        string organizationName;
        string userName;
        uint256 timestamp;
    }

    struct Batch {
        string medicineName;
        string manufacturer;
        string expiryDate;
        Status status;
        Signature[] signatures;
        address creator;
        uint256 createdAt;
        bool exists;
    }

    mapping(string => Batch) public batches;
    string[] public batchIds;

    event BatchRegistered(string batchId, string medicineName, address creator);
    event BatchSigned(string batchId, string role, string userName);
    event BatchFlagged(string batchId, string reason);

    modifier batchExists(string memory batchId) {
        require(batches[batchId].exists, "Batch not found");
        _;
    }

    function registerBatch(
        string memory batchId,
        string memory medicineName,
        string memory manufacturer,
        string memory expiryDate,
        string memory role,
        string memory organizationName,
        string memory userName
    ) public {
        require(!batches[batchId].exists, "Batch already exists");

        Batch storage batch = batches[batchId];
        batch.medicineName = medicineName;
        batch.manufacturer = manufacturer;
        batch.expiryDate = expiryDate;
        batch.creator = msg.sender;
        batch.status = Status.InTransit;
        batch.createdAt = block.timestamp;
        batch.exists = true;

        batchIds.push(batchId);

        batch.signatures.push(Signature({
            role: role,
            organizationName: organizationName,
            userName: userName,
            timestamp: block.timestamp
        }));

        emit BatchRegistered(batchId, medicineName, msg.sender);
    }

    function signBatch(
        string memory batchId,
        string memory role,
        string memory organizationName,
        string memory userName
    ) public batchExists(batchId) {
        Batch storage batch = batches[batchId];

        // Prevent duplicate role signatures
        for (uint i = 0; i < batch.signatures.length; i++) {
            if (keccak256(bytes(batch.signatures[i].role)) == keccak256(bytes(role))) {
                revert("Role already signed");
            }
        }

        batch.signatures.push(Signature({
            role: role,
            organizationName: organizationName,
            userName: userName,
            timestamp: block.timestamp
        }));

        if (batch.signatures.length >= 4) {
            batch.status = Status.Delivered;
        }

        emit BatchSigned(batchId, role, userName);
    }

    function flagBatch(string memory batchId, string memory reason)
        public
        batchExists(batchId)
    {
        Batch storage batch = batches[batchId];
        batch.status = Status.Flagged;
        emit BatchFlagged(batchId, reason);
    }

    function getBatch(string memory batchId) public view returns (Batch memory) {
        return batches[batchId];
    }

    function getAllBatchIds() public view returns (string[] memory) {
        return batchIds;
    }

    function getSignatures(string memory batchId) public view returns (Signature[] memory) {
        return batches[batchId].signatures;
    }
}
