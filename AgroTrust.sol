// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SupplyChain {
    // -------------------------------
    // 1. Batch Identification
    struct Batch {
        string batchId;
        string giTag;
        string registrationId;
        uint256 timestamp;
    }
    mapping(string => Batch) public batches;

    event BatchCreated(string batchId, uint256 timestamp);

    // -------------------------------
    // 2. Farmer & Origin Information
    struct FarmerInfo {
        string farmerId;
        string farmerName;
        string village;
        string district;
        string state;
        string coordinates;
        uint256 altitude;
    }
    mapping(string => FarmerInfo) public farmerData;

    // -------------------------------
    // 3. Crop Cultivation
    struct CultivationDetails {
        string cropName;
        string variety;
        uint256 area; // in sq meters
        uint256 sowingDate;
        uint256 harvestDate;
        uint256 expectedYield;
        uint256 actualYield;
    }
    mapping(string => CultivationDetails) public cultivationData;

    // -------------------------------
    // 4. Post-Harvest & Processing
    struct ProcessingInfo {
        string dryingProcess;
        string processingUnitId;
        uint256 packagingDate;
        uint256 batchWeight;
        string qualityGrade;
    }
    mapping(string => ProcessingInfo) public processingData;

    // -------------------------------
    // 5. Lab Testing
    struct LabResult {
        uint256 curcuminContent;
        uint256 moistureContent;
        string reportHash;
    }
    mapping(string => LabResult) public labResults;

    // -------------------------------
    // 6. Certification
    struct Certificate {
        string certifiedBy;
        uint256 inspectionDate;
        string certificateId;
        string complianceStatus;
    }
    mapping(string => Certificate) public certifications;

    // -------------------------------
    // 7. Ownership History
    struct TransferRecord {
        address from;
        address to;
        uint256 transferDate;
        string location;
    }
    mapping(string => TransferRecord[]) public ownershipHistory;

    // -------------------------------
    // 8. Retail / Traceability
    struct TraceData {
        string qrCodeHash;
        string traceUrl;
        string blockchainTxHash;
        string destination;
    }
    mapping(string => TraceData) public traceRecords;

    // ---------------------------------------------------------
    // FUNCTIONS
    function createBatch(
        string memory _batchId,
        string memory _giTag,
        string memory _registrationId
    ) public {
        require(bytes(batches[_batchId].batchId).length == 0, "Batch already exists");
        batches[_batchId] = Batch(_batchId, _giTag, _registrationId, block.timestamp);
        emit BatchCreated(_batchId, block.timestamp);
    }

    function addFarmerInfo(string memory _batchId, FarmerInfo memory info) public {
        farmerData[_batchId] = info;
    }

    function addCultivationDetails(string memory _batchId, CultivationDetails memory details) public {
        cultivationData[_batchId] = details;
    }

    function recordProcessing(string memory _batchId, ProcessingInfo memory info) public {
        processingData[_batchId] = info;
    }

    function addLabResult(string memory _batchId, LabResult memory result) public {
        labResults[_batchId] = result;
    }

    function addCertificate(string memory _batchId, Certificate memory cert) public {
        certifications[_batchId] = cert;
    }

    function transferOwnership(string memory _batchId, address to, string memory location) public {
        ownershipHistory[_batchId].push(TransferRecord({
            from: msg.sender,
            to: to,
            transferDate: block.timestamp,
            location: location
        }));
    }

    function addTraceData(string memory _batchId, TraceData memory trace) public {
        traceRecords[_batchId] = trace;
    }

    function getFullTrace(string memory _batchId) public view returns (
        Batch memory,
        FarmerInfo memory,
        CultivationDetails memory,
        ProcessingInfo memory,
        LabResult memory,
        Certificate memory,
        TransferRecord[] memory,
        TraceData memory
    ) {
        return (
            batches[_batchId],
            farmerData[_batchId],
            cultivationData[_batchId],
            processingData[_batchId],
            labResults[_batchId],
            certifications[_batchId],
            ownershipHistory[_batchId],
            traceRecords[_batchId]
        );
    }
}
