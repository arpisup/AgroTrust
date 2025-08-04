import { ethers } from "hardhat";

async function main() {
  console.log("Interacting with AgroTrust contract...");

  // Get the deployed contract address (you'll need to replace this with your actual deployed address)
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const AgroTrust = await ethers.getContractFactory("AgroTrust");
  const agroTrust = AgroTrust.attach(contractAddress);

  const [owner, farmer, processor, lab] = await ethers.getSigners();

  // Sample data for Erode Turmeric (GI Tagged Product)
  const batchId = "Clove_001";
  const cropName = "clove";
  const variety = "Erode Manjal";
  const location = "Erode, Tamil Nadu";
  const harvestDate = Math.floor(Date.now() / 1000);


  try {
    // 1. Create a new batch
    console.log("\n1. Creating new batch...");
    const createBatchTx = await agroTrust.createBatch(batchId, cropName, variety, location, harvestDate);
    await createBatchTx.wait();
    console.log(`✓ Batch created: ${batchId}`);

    // 2. Add farmer information
    console.log("\n2. Adding farmer information...");
    const addFarmerTx = await agroTrust.addFarmerInfo(
      batchId,
      "Ravi Kumar",
      "Bhavani, Erode District",
      "+91-9876543210",
      "FARMER001"
    );
    await addFarmerTx.wait();
    console.log("✓ Farmer information added");

    // 3. Add cultivation details
    console.log("\n3. Adding cultivation details...");
    const sowingDate = Math.floor(Date.now() / 1000) - 86400 * 120; // 120 days ago
    const addCultivationTx = await agroTrust.addCultivationDetails(
      batchId,
      "Red Loamy Soil",
      "Drip Irrigation",
      "Organic Neem Spray",
      sowingDate,
      15000 // 15,000 sq meters
    );
    await addCultivationTx.wait();
    console.log("✓ Cultivation details added");

    // 4. Add processing information
    console.log("\n4. Adding processing information...");
    const processingDate = Math.floor(Date.now() / 1000);
    const addProcessingTx = await agroTrust.addProcessingInfo(
      batchId,
      "Erode Traditional Processing Unit",
      "Traditional Sun Drying",
      processingDate,
      "PROC_ERODE_001"
    );
    await addProcessingTx.wait();
    console.log("✓ Processing information added");

    // 5. Add lab test results
    console.log("\n5. Adding lab test results...");
    const testDate = Math.floor(Date.now() / 1000);
    const addLabTx = await agroTrust.addLabResult(
      batchId,
      "Food Safety and Standards Authority of India",
      "Passed - Curcumin content: 5.2%, Moisture: 8.5%, All parameters within GI standards",
      testDate,
      "QmHash123456789abcdef"
    );
    await addLabTx.wait();
    console.log("✓ Lab results added");

    // 6. Add GI certificate
    console.log("\n6. Adding GI certificate...");
    const issueDate = Math.floor(Date.now() / 1000);
    const addCertTx = await agroTrust.addCertificate(
      batchId,
      "Geographical Indications Registry, Chennai",
      "Erode Turmeric GI Certificate",
      issueDate,
      "GI_ERODE_TURMERIC_2025_001"
    );
    await addCertTx.wait();
    console.log("✓ GI certificate added");

    // 7. Add transfer records
    console.log("\n7. Adding transfer records...");
    const addTransfer1Tx = await agroTrust.addTransferRecord(
      batchId,
      "Farmer Ravi Kumar",
      "Erode Processing Unit",
      "Harvest to Processing"
    );
    await addTransfer1Tx.wait();

    const addTransfer2Tx = await agroTrust.addTransferRecord(
      batchId,
      "Erode Processing Unit",
      "Chennai Distribution Center",
      "Processing to Distribution"
    );
    await addTransfer2Tx.wait();
    console.log("✓ Transfer records added");

    // 8. Add trace data
    console.log("\n8. Adding trace data...");
    const addTraceTx = await agroTrust.addTraceData(
      batchId,
      "Product ready for retail distribution. QR code generated for consumer verification.",
      "QrCodeHash123456789abcdef"
    );
    await addTraceTx.wait();
    console.log("✓ Trace data added");

    // 9. Retrieve and display all information
    console.log("\n9. Retrieving complete product information...");
    
    const batch = await agroTrust.getBatch(batchId);
    const farmer = await agroTrust.getFarmerInfo(batchId);
    const cultivation = await agroTrust.getCultivationDetails(batchId);
    const processing = await agroTrust.getProcessingInfo(batchId);
    const labResult = await agroTrust.getLabResult(batchId);
    const certificate = await agroTrust.getCertificate(batchId);
    const transfers = await agroTrust.getTransferRecords(batchId);
    const traceData = await agroTrust.getTraceNotes(batchId);

    console.log("\n=== COMPLETE PRODUCT TRACEABILITY REPORT ===");
    console.log(`Batch ID: ${batchId}`);
    console.log(`Crop: ${batch.cropName} - ${batch.variety}`);
    console.log(`Location: ${batch.location}`);
    console.log(`Harvest Date: ${new Date(Number(batch.harvestDate) * 1000).toLocaleDateString()}`);
    
    console.log(`\nFarmer: ${farmer.farmerName}`);
    console.log(`Farm Location: ${farmer.farmLocation}`);
    console.log(`Contact: ${farmer.contact}`);
    console.log(`Farmer ID: ${farmer.farmerId}`);
    
    console.log(`\nCultivation Area: ${cultivation.area} sq meters`);
    console.log(`Soil Type: ${cultivation.soilType}`);
    console.log(`Irrigation: ${cultivation.irrigationType}`);
    console.log(`Pesticide: ${cultivation.pesticideUsed}`);
    
    console.log(`\nProcessor: ${processing.processorName}`);
    console.log(`Method: ${processing.method}`);
    console.log(`Processing Date: ${new Date(Number(processing.processingDate) * 1000).toLocaleDateString()}`);
    
    console.log(`\nLab: ${labResult.labName}`);
    console.log(`Result: ${labResult.result}`);
    console.log(`Test Date: ${new Date(Number(labResult.testDate) * 1000).toLocaleDateString()}`);
    
    console.log(`\nCertificate: ${certificate.certificateType}`);
    console.log(`Issued By: ${certificate.issuedBy}`);
    console.log(`Certificate ID: ${certificate.certificateId}`);
    
    console.log(`\nTransfer History:`);
    transfers.forEach((transfer, index) => {
      console.log(`  ${index + 1}. ${transfer.from} → ${transfer.to} (${transfer.purpose})`);
      console.log(`     Date: ${new Date(Number(transfer.transferDate) * 1000).toLocaleDateString()}`);
    });
    
    console.log(`\nTrace Notes: ${traceData.notes}`);
    console.log(`QR Code Hash: ${traceData.qrCodeHash}`);
    
    console.log("\n=== END OF REPORT ===");
    console.log("\n✓ All operations completed successfully!");

  } catch (error) {
    console.error("Error during interaction:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 