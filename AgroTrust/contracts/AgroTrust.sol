// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgroTrust
 * @dev A blockchain-based system for verifying authenticity of GI (Geographical Indication) tagged products
 * @author AgroTrust Team
 */
contract AgroTrust {
    // Access control
    address public owner;
    mapping(address => bool) public authorizedUsers;
    
    // Events
    event BatchCreated(string indexed batchId, string giTag, uint256 timestamp);
    event FarmerInfoAdded(string indexed batchId, string farmerName);
    event CultivationDetailsAdded(string indexed batchId, string cropName);
    event ProcessingInfoAdded(string indexed batchId, string processorName);
    event LabResultAdded(string indexed batchId, string labName);
    event CertificateAdded(string indexed batchId, string certificateType);
    event TransferRecorded(string indexed batchId, string from, string to);
    event TraceDataAdded(string indexed batchId);
    event UserAuthorized(address indexed user);
    event UserRevoked(address indexed user);

    // Data structures
    struct Batch {
        string cropName;
        string variety;
        string location;
        uint256 harvestDate;
        bool exists;
    }

    struct FarmerInfo {
        string farmerName;
        string farmLocation;
        string contact;
        string farmerId;
        bool exists;
    }

    struct CultivationDetails {
        string soilType;
        string irrigationType;
        string pesticideUsed;
        uint256 sowingDate;
        uint256 area; // in square meters
        bool exists;
    }

    struct ProcessingInfo {
        string processorName;
        string method;
        uint256 processingDate;
        string processingUnitId;
        bool exists;
    }

    struct LabResult {
        string labName;
        string result;
        uint256 testDate;
        string reportHash;
        bool exists;
    }

    struct Certificate {
        string issuedBy;
        string certificateType;
        uint256 issueDate;
        string certificateId;
        bool exists;
    }

    struct TransferRecord {
        string from;
        string to;
        string purpose;
        uint256 transferDate;
    }

    struct TraceData {
        string notes;
        string qrCodeHash;
        bool exists;
    }

    // Storage mappings
    mapping(string => Batch) public batches;
    mapping(string => FarmerInfo) public farmerData;
    mapping(string => CultivationDetails) public cultivationData;
    mapping(string => ProcessingInfo) public processingData;
    mapping(string => LabResult) public labResults;
    mapping(string => Certificate) public certificates;
    mapping(string => TransferRecord[]) public transferLogs;
    mapping(string => TraceData) public traceRecords;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedUsers[msg.sender], "Not authorized");
        _;
    }

    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].exists, "Batch does not exist");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        authorizedUsers[msg.sender] = true;
    }

    // Access control functions
    function authorizeUser(address _user) public onlyOwner {
        authorizedUsers[_user] = true;
        emit UserAuthorized(_user);
    }

    function revokeUser(address _user) public onlyOwner {
        authorizedUsers[_user] = false;
        emit UserRevoked(_user);
    }

    // Setter functions
    function createBatch(
        string memory _batchId,
        string memory _cropName,
        string memory _variety,
        string memory _location,
        uint256 _harvestDate
    ) public onlyAuthorized {
        require(!batches[_batchId].exists, "Batch already exists");
        require(bytes(_batchId).length > 0, "Batch ID cannot be empty");
        
        batches[_batchId] = Batch({
            cropName: _cropName,
            variety: _variety,
            location: _location,
            harvestDate: _harvestDate,
            exists: true
        });
        
        emit BatchCreated(_batchId, _cropName, block.timestamp);
    }

    function addFarmerInfo(
        string memory _batchId,
        string memory _farmerName,
        string memory _farmLocation,
        string memory _contact,
        string memory _farmerId
    ) public onlyAuthorized batchExists(_batchId) {
        farmerData[_batchId] = FarmerInfo({
            farmerName: _farmerName,
            farmLocation: _farmLocation,
            contact: _contact,
            farmerId: _farmerId,
            exists: true
        });
        
        emit FarmerInfoAdded(_batchId, _farmerName);
    }

    function addCultivationDetails(
        string memory _batchId,
        string memory _soilType,
        string memory _irrigationType,
        string memory _pesticideUsed,
        uint256 _sowingDate,
        uint256 _area
    ) public onlyAuthorized batchExists(_batchId) {
        cultivationData[_batchId] = CultivationDetails({
            soilType: _soilType,
            irrigationType: _irrigationType,
            pesticideUsed: _pesticideUsed,
            sowingDate: _sowingDate,
            area: _area,
            exists: true
        });
        
        emit CultivationDetailsAdded(_batchId, batches[_batchId].cropName);
    }

    function addProcessingInfo(
        string memory _batchId,
        string memory _processorName,
        string memory _method,
        uint256 _processingDate,
        string memory _processingUnitId
    ) public onlyAuthorized batchExists(_batchId) {
        processingData[_batchId] = ProcessingInfo({
            processorName: _processorName,
            method: _method,
            processingDate: _processingDate,
            processingUnitId: _processingUnitId,
            exists: true
        });
        
        emit ProcessingInfoAdded(_batchId, _processorName);
    }

    function addLabResult(
        string memory _batchId,
        string memory _labName,
        string memory _result,
        uint256 _testDate,
        string memory _reportHash
    ) public onlyAuthorized batchExists(_batchId) {
        labResults[_batchId] = LabResult({
            labName: _labName,
            result: _result,
            testDate: _testDate,
            reportHash: _reportHash,
            exists: true
        });
        
        emit LabResultAdded(_batchId, _labName);
    }

    function addCertificate(
        string memory _batchId,
        string memory _issuedBy,
        string memory _certificateType,
        uint256 _issueDate,
        string memory _certificateId
    ) public onlyAuthorized batchExists(_batchId) {
        certificates[_batchId] = Certificate({
            issuedBy: _issuedBy,
            certificateType: _certificateType,
            issueDate: _issueDate,
            certificateId: _certificateId,
            exists: true
        });
        
        emit CertificateAdded(_batchId, _certificateType);
    }

    function addTransferRecord(
        string memory _batchId,
        string memory _from,
        string memory _to,
        string memory _purpose
    ) public onlyAuthorized batchExists(_batchId) {
        transferLogs[_batchId].push(TransferRecord({
            from: _from,
            to: _to,
            purpose: _purpose,
            transferDate: block.timestamp
        }));
        
        emit TransferRecorded(_batchId, _from, _to);
    }

    function addTraceData(
        string memory _batchId,
        string memory _notes,
        string memory _qrCodeHash
    ) public onlyAuthorized batchExists(_batchId) {
        traceRecords[_batchId] = TraceData({
            notes: _notes,
            qrCodeHash: _qrCodeHash,
            exists: true
        });
        
        emit TraceDataAdded(_batchId);
    }

    // Getter functions
    function getBatch(string memory _batchId) public view returns (Batch memory) {
        return batches[_batchId];
    }

    function getFarmerInfo(string memory _batchId) public view returns (FarmerInfo memory) {
        return farmerData[_batchId];
    }

    function getCultivationDetails(string memory _batchId) public view returns (CultivationDetails memory) {
        return cultivationData[_batchId];
    }

    function getProcessingInfo(string memory _batchId) public view returns (ProcessingInfo memory) {
        return processingData[_batchId];
    }

    function getLabResult(string memory _batchId) public view returns (LabResult memory) {
        return labResults[_batchId];
    }

    function getCertificate(string memory _batchId) public view returns (Certificate memory) {
        return certificates[_batchId];
    }

    function getTransferRecords(string memory _batchId) public view returns (TransferRecord[] memory) {
        return transferLogs[_batchId];
    }

    function getTraceNotes(string memory _batchId) public view returns (TraceData memory) {
        return traceRecords[_batchId];
    }

    // Utility functions
    function checkBatchExists(string memory _batchId) public view returns (bool) {
        return batches[_batchId].exists;
    }

    function getTransferRecordCount(string memory _batchId) public view returns (uint256) {
        return transferLogs[_batchId].length;
    }
}

