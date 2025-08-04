import { expect } from "chai";
import { ethers } from "hardhat";
import { AgroTrust } from "../typechain-types";

describe("AgroTrust", function () {
  let agroTrust: AgroTrust;
  let owner: any;
  let authorizedUser: any;
  let unauthorizedUser: any;

  beforeEach(async function () {
    [owner, authorizedUser, unauthorizedUser] = await ethers.getSigners();
    
    const AgroTrust = await ethers.getContractFactory("AgroTrust");
    agroTrust = await AgroTrust.deploy();
    await agroTrust.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await agroTrust.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner by default", async function () {
      expect(await agroTrust.authorizedUsers(owner.address)).to.be.true;
    });
  });

  describe("Access Control", function () {
    it("Should allow owner to authorize users", async function () {
      await agroTrust.authorizeUser(authorizedUser.address);
      expect(await agroTrust.authorizedUsers(authorizedUser.address)).to.be.true;
    });

    it("Should allow owner to revoke users", async function () {
      await agroTrust.authorizeUser(authorizedUser.address);
      await agroTrust.revokeUser(authorizedUser.address);
      expect(await agroTrust.authorizedUsers(authorizedUser.address)).to.be.false;
    });

    it("Should prevent unauthorized users from authorizing others", async function () {
      await expect(
        agroTrust.connect(unauthorizedUser).authorizeUser(authorizedUser.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Batch Management", function () {
    const batchId = "TURMERIC2025";
    const cropName = "Turmeric";
    const variety = "Erode Manjal";
    const location = "Erode, Tamil Nadu";
    const harvestDate = Math.floor(Date.now() / 1000);

    it("Should create a new batch successfully", async function () {
      await agroTrust.createBatch(batchId, cropName, variety, location, harvestDate);
      
      const batch = await agroTrust.getBatch(batchId);
      expect(batch.cropName).to.equal(cropName);
      expect(batch.variety).to.equal(variety);
      expect(batch.location).to.equal(location);
      expect(batch.harvestDate).to.equal(harvestDate);
      expect(batch.exists).to.be.true;
    });

    it("Should prevent creating duplicate batches", async function () {
      await agroTrust.createBatch(batchId, cropName, variety, location, harvestDate);
      
      await expect(
        agroTrust.createBatch(batchId, cropName, variety, location, harvestDate)
      ).to.be.revertedWith("Batch already exists");
    });

    it("Should prevent creating batch with empty ID", async function () {
      await expect(
        agroTrust.createBatch("", cropName, variety, location, harvestDate)
      ).to.be.revertedWith("Batch ID cannot be empty");
    });

    it("Should prevent unauthorized users from creating batches", async function () {
      await expect(
        agroTrust.connect(unauthorizedUser).createBatch(batchId, cropName, variety, location, harvestDate)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should allow authorized users to create batches", async function () {
      await agroTrust.authorizeUser(authorizedUser.address);
      await agroTrust.connect(authorizedUser).createBatch(batchId, cropName, variety, location, harvestDate);
      
      const batch = await agroTrust.getBatch(batchId);
      expect(batch.exists).to.be.true;
    });
  });

  describe("Farmer Information", function () {
    const batchId = "TURMERIC2025";
    const farmerName = "Ravi Kumar";
    const farmLocation = "Bhavani, Erode";
    const contact = "+91-9876543210";
    const farmerId = "FARMER001";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add farmer information successfully", async function () {
      await agroTrust.addFarmerInfo(batchId, farmerName, farmLocation, contact, farmerId);
      
      const farmer = await agroTrust.getFarmerInfo(batchId);
      expect(farmer.farmerName).to.equal(farmerName);
      expect(farmer.farmLocation).to.equal(farmLocation);
      expect(farmer.contact).to.equal(contact);
      expect(farmer.farmerId).to.equal(farmerId);
      expect(farmer.exists).to.be.true;
    });

    it("Should prevent adding farmer info for non-existent batch", async function () {
      await expect(
        agroTrust.addFarmerInfo("NONEXISTENT", farmerName, farmLocation, contact, farmerId)
      ).to.be.revertedWith("Batch does not exist");
    });
  });

  describe("Cultivation Details", function () {
    const batchId = "TURMERIC2025";
    const soilType = "Loamy";
    const irrigationType = "Drip";
    const pesticideUsed = "Organic Neem Spray";
    const sowingDate = Math.floor(Date.now() / 1000) - 86400 * 120; // 120 days ago
    const area = 10000; // 10,000 sq meters

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add cultivation details successfully", async function () {
      await agroTrust.addCultivationDetails(batchId, soilType, irrigationType, pesticideUsed, sowingDate, area);
      
      const cultivation = await agroTrust.getCultivationDetails(batchId);
      expect(cultivation.soilType).to.equal(soilType);
      expect(cultivation.irrigationType).to.equal(irrigationType);
      expect(cultivation.pesticideUsed).to.equal(pesticideUsed);
      expect(cultivation.sowingDate).to.equal(sowingDate);
      expect(cultivation.area).to.equal(area);
      expect(cultivation.exists).to.be.true;
    });
  });

  describe("Processing Information", function () {
    const batchId = "TURMERIC2025";
    const processorName = "Erode Processing Unit";
    const method = "Traditional Drying";
    const processingDate = Math.floor(Date.now() / 1000);
    const processingUnitId = "PROC001";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add processing information successfully", async function () {
      await agroTrust.addProcessingInfo(batchId, processorName, method, processingDate, processingUnitId);
      
      const processing = await agroTrust.getProcessingInfo(batchId);
      expect(processing.processorName).to.equal(processorName);
      expect(processing.method).to.equal(method);
      expect(processing.processingDate).to.equal(processingDate);
      expect(processing.processingUnitId).to.equal(processingUnitId);
      expect(processing.exists).to.be.true;
    });
  });

  describe("Lab Results", function () {
    const batchId = "TURMERIC2025";
    const labName = "Food Safety Lab";
    const result = "Passed - All parameters within limits";
    const testDate = Math.floor(Date.now() / 1000);
    const reportHash = "QmHash123456789";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add lab results successfully", async function () {
      await agroTrust.addLabResult(batchId, labName, result, testDate, reportHash);
      
      const labResult = await agroTrust.getLabResult(batchId);
      expect(labResult.labName).to.equal(labName);
      expect(labResult.result).to.equal(result);
      expect(labResult.testDate).to.equal(testDate);
      expect(labResult.reportHash).to.equal(reportHash);
      expect(labResult.exists).to.be.true;
    });
  });

  describe("Certificates", function () {
    const batchId = "TURMERIC2025";
    const issuedBy = "GI Registry Office";
    const certificateType = "Geographical Indication";
    const issueDate = Math.floor(Date.now() / 1000);
    const certificateId = "GI2025001";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add certificate successfully", async function () {
      await agroTrust.addCertificate(batchId, issuedBy, certificateType, issueDate, certificateId);
      
      const certificate = await agroTrust.getCertificate(batchId);
      expect(certificate.issuedBy).to.equal(issuedBy);
      expect(certificate.certificateType).to.equal(certificateType);
      expect(certificate.issueDate).to.equal(issueDate);
      expect(certificate.certificateId).to.equal(certificateId);
      expect(certificate.exists).to.be.true;
    });
  });

  describe("Transfer Records", function () {
    const batchId = "TURMERIC2025";
    const from = "Farmer Ravi Kumar";
    const to = "Processor Erode Unit";
    const purpose = "Processing";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add transfer record successfully", async function () {
      await agroTrust.addTransferRecord(batchId, from, to, purpose);
      
      const transfers = await agroTrust.getTransferRecords(batchId);
      expect(transfers.length).to.equal(1);
      expect(transfers[0].from).to.equal(from);
      expect(transfers[0].to).to.equal(to);
      expect(transfers[0].purpose).to.equal(purpose);
    });

    it("Should track multiple transfers", async function () {
      await agroTrust.addTransferRecord(batchId, from, to, purpose);
      await agroTrust.addTransferRecord(batchId, to, "Retailer ABC", "Distribution");
      
      const transfers = await agroTrust.getTransferRecords(batchId);
      expect(transfers.length).to.equal(2);
      expect(await agroTrust.getTransferRecordCount(batchId)).to.equal(2);
    });
  });

  describe("Trace Data", function () {
    const batchId = "TURMERIC2025";
    const notes = "Product ready for retail distribution";
    const qrCodeHash = "QrCodeHash123456";

    beforeEach(async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
    });

    it("Should add trace data successfully", async function () {
      await agroTrust.addTraceData(batchId, notes, qrCodeHash);
      
      const traceData = await agroTrust.getTraceNotes(batchId);
      expect(traceData.notes).to.equal(notes);
      expect(traceData.qrCodeHash).to.equal(qrCodeHash);
      expect(traceData.exists).to.be.true;
    });
  });

  describe("Utility Functions", function () {
    const batchId = "TURMERIC2025";

    it("Should correctly check if batch exists", async function () {
      expect(await agroTrust.checkBatchExists(batchId)).to.be.false;
      
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
      
      expect(await agroTrust.checkBatchExists(batchId)).to.be.true;
    });

    it("Should return correct transfer record count", async function () {
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
      
      expect(await agroTrust.getTransferRecordCount(batchId)).to.equal(0);
      
      await agroTrust.addTransferRecord(batchId, "Farmer", "Processor", "Processing");
      expect(await agroTrust.getTransferRecordCount(batchId)).to.equal(1);
    });
  });

  describe("Complete Workflow", function () {
    const batchId = "TURMERIC2025";

    it("Should handle complete product lifecycle", async function () {
      // 1. Create batch
      await agroTrust.createBatch(batchId, "Turmeric", "Erode Manjal", "Erode, Tamil Nadu", Math.floor(Date.now() / 1000));
      
      // 2. Add farmer information
      await agroTrust.addFarmerInfo(batchId, "Ravi Kumar", "Bhavani, Erode", "+91-9876543210", "FARMER001");
      
      // 3. Add cultivation details
      await agroTrust.addCultivationDetails(batchId, "Loamy", "Drip", "Organic Neem", Math.floor(Date.now() / 1000) - 86400 * 120, 10000);
      
      // 4. Add processing information
      await agroTrust.addProcessingInfo(batchId, "Erode Processing Unit", "Traditional Drying", Math.floor(Date.now() / 1000), "PROC001");
      
      // 5. Add lab results
      await agroTrust.addLabResult(batchId, "Food Safety Lab", "Passed", Math.floor(Date.now() / 1000), "QmHash123");
      
      // 6. Add certificate
      await agroTrust.addCertificate(batchId, "GI Registry", "Geographical Indication", Math.floor(Date.now() / 1000), "GI2025001");
      
      // 7. Add transfer records
      await agroTrust.addTransferRecord(batchId, "Farmer Ravi", "Processor", "Processing");
      await agroTrust.addTransferRecord(batchId, "Processor", "Retailer", "Distribution");
      
      // 8. Add trace data
      await agroTrust.addTraceData(batchId, "Ready for retail", "QrCodeHash123");
      
      // Verify all data is stored correctly
      const batch = await agroTrust.getBatch(batchId);
      const farmer = await agroTrust.getFarmerInfo(batchId);
      const cultivation = await agroTrust.getCultivationDetails(batchId);
      const processing = await agroTrust.getProcessingInfo(batchId);
      const labResult = await agroTrust.getLabResult(batchId);
      const certificate = await agroTrust.getCertificate(batchId);
      const transfers = await agroTrust.getTransferRecords(batchId);
      const traceData = await agroTrust.getTraceNotes(batchId);
      
      expect(batch.exists).to.be.true;
      expect(farmer.exists).to.be.true;
      expect(cultivation.exists).to.be.true;
      expect(processing.exists).to.be.true;
      expect(labResult.exists).to.be.true;
      expect(certificate.exists).to.be.true;
      expect(traceData.exists).to.be.true;
      expect(transfers.length).to.equal(2);
    });
  });
}); 