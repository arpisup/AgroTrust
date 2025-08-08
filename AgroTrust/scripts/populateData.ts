import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Populating blockchain with sample crop data...");


  // Load contract address and ABI from deployed-contract.json
  const deployed = JSON.parse(fs.readFileSync("./deployed-contract.json", "utf8"));
  const contractAddress = deployed.address;
  const contractAbi = deployed.abi;
  if (!contractAddress || !contractAbi) {
    throw new Error("Contract address or ABI missing in deployed-contract.json");
  }
  // Connect to contract
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  console.log("Using signer:", await signer.getAddress());
  // Check contract exists at address
  try {
    const owner = await contract.owner();
    console.log("Connected to contract. Owner:", owner);
  } catch (err) {
    throw new Error(`Could not connect to contract at ${contractAddress}. Is it deployed? Error: ${err}`);
  }

  // Sample data for Turmeric
  const turmericData = {
    batchId: "ERD-TUR-2025-001",
    cropName: "Turmeric",
    variety: "Erode Manjal",
    location: "Erode, Tamil Nadu",
    harvestDate: Math.floor(new Date("2025-07-10").getTime() / 1000),
    farmer: {
      farmerName: "Dhanasekaran V",
      farmLocation: "Alathur, Erode, Tamil Nadu",
      contact: "+91 9876543210",
      farmerId: "F12345"
    },
    cultivation: {
      soilType: "Red Soil",
      irrigationType: "Drip Irrigation",
      pesticideUsed: "Organic Neem Oil",
      sowingDate: Math.floor(new Date("2024-12-01").getTime() / 1000),
      area: 8100
    },
    processing: {
      processorName: "Erode Processing Unit",
      method: "Boiled & Sun-dried 15 days",
      processingDate: Math.floor(new Date("2025-07-25").getTime() / 1000),
      processingUnitId: "PROC-ERD-010"
    },
    labResult: {
      labName: "Food Safety Lab",
      result: "Curcumin content: 3.5%, Moisture: 9%",
      testDate: Math.floor(new Date("2025-07-20").getTime() / 1000),
      reportHash: "Qmabc123erdfgh456lab789hash"
    },
    certificate: {
      issuedBy: "Erode Turmeric Merchants Association",
      certificateType: "GI Certificate",
      issueDate: Math.floor(new Date("2019-03-06").getTime() / 1000),
      certificateId: "GI-231/340"
    },
    transfer: {
      from: "Farmer",
      to: "Processor",
      purpose: "Processing",
      transferDate: Math.floor(new Date("2025-07-20").getTime() / 1000)
    },
    traceData: {
      notes: "Premium quality Erode Manjal with high curcumin content",
      qrCodeHash: "QRHASH-ERD2025-TURM001"
    }
  };

  // Sample data for Clove
  const cloveData = {
    batchId: "KC-CLOVE-2025-001",
    cropName: "Clove",
    variety: "Kanyakumari Clove",
    location: "Kanyakumari, Tamil Nadu",
    harvestDate: Math.floor(new Date("2025-07-10").getTime() / 1000),
    farmer: {
      farmerName: "Chinnachenna Naicker",
      farmLocation: "Thiruvattar, Kanyakumari, Tamil Nadu",
      contact: "+91 9876543211",
      farmerId: "F12356"
    },
    cultivation: {
      soilType: "Laterite Soil",
      irrigationType: "Rain-fed",
      pesticideUsed: "Organic",
      sowingDate: Math.floor(new Date("2024-12-01").getTime() / 1000),
      area: 9000
    },
    processing: {
      processorName: "Kanyakumari Processing Unit",
      method: "Sun drying on bamboo mats for 4-5 days",
      processingDate: Math.floor(new Date("2025-07-25").getTime() / 1000),
      processingUnitId: "PROC-KC-010"
    },
    labResult: {
      labName: "Spices Board Lab",
      result: "Eugenol content: 85%, Moisture: 9%",
      testDate: Math.floor(new Date("2025-07-20").getTime() / 1000),
      reportHash: "HASH-KC-LAB-94"
    },
    certificate: {
      issuedBy: "Spices Board India",
      certificateType: "GI Certificate",
      issueDate: Math.floor(new Date("2020-06-12").getTime() / 1000),
      certificateId: "CERT-KC-2024-001"
    },
    transfer: {
      from: "Farmer",
      to: "Processor",
      purpose: "Processing",
      transferDate: Math.floor(new Date("2025-07-20").getTime() / 1000)
    },
    traceData: {
      notes: "Premium Kanyakumari Clove with high eugenol content",
      qrCodeHash: "QRHASH-KC2025-CLOVE001"
    }
  };

  try {
    // Add Turmeric data
    console.log("\n=== Adding Turmeric Data ===");
    
    // Create batch
    console.log("Creating batch...");
    const turmericBatchTx = await contract.createBatch(
      turmericData.batchId,
      turmericData.cropName,
      turmericData.variety,
      turmericData.location,
      turmericData.harvestDate
    );
    await turmericBatchTx.wait();
    console.log("✓ Batch created");

    // Add farmer info
    console.log("Adding farmer info...");
    const turmericFarmerTx = await contract.addFarmerInfo(
      turmericData.batchId,
      turmericData.farmer.farmerName,
      turmericData.farmer.farmLocation,
      turmericData.farmer.contact,
      turmericData.farmer.farmerId
    );
    await turmericFarmerTx.wait();
    console.log("✓ Farmer info added");

    // Add cultivation details
    console.log("Adding cultivation details...");
    const turmericCultivationTx = await contract.addCultivationDetails(
      turmericData.batchId,
      turmericData.cultivation.soilType,
      turmericData.cultivation.irrigationType,
      turmericData.cultivation.pesticideUsed,
      turmericData.cultivation.sowingDate,
      turmericData.cultivation.area
    );
    await turmericCultivationTx.wait();
    console.log("✓ Cultivation details added");

    // Add processing info
    console.log("Adding processing info...");
    const turmericProcessingTx = await contract.addProcessingInfo(
      turmericData.batchId,
      turmericData.processing.processorName,
      turmericData.processing.method,
      turmericData.processing.processingDate,
      turmericData.processing.processingUnitId
    );
    await turmericProcessingTx.wait();
    console.log("✓ Processing info added");

    // Add lab result
    console.log("Adding lab result...");
    const turmericLabTx = await contract.addLabResult(
      turmericData.batchId,
      turmericData.labResult.labName,
      turmericData.labResult.result,
      turmericData.labResult.testDate,
      turmericData.labResult.reportHash
    );
    await turmericLabTx.wait();
    console.log("✓ Lab result added");

    // Add certificate
    console.log("Adding certificate...");
    const turmericCertTx = await contract.addCertificate(
      turmericData.batchId,
      turmericData.certificate.issuedBy,
      turmericData.certificate.certificateType,
      turmericData.certificate.issueDate,
      turmericData.certificate.certificateId
    );
    await turmericCertTx.wait();
    console.log("✓ Certificate added");

    // Add transfer record
    console.log("Adding transfer record...");
    const turmericTransferTx = await contract.addTransferRecord(
      turmericData.batchId,
      turmericData.transfer.from,
      turmericData.transfer.to,
      turmericData.transfer.purpose
    );
    await turmericTransferTx.wait();
    console.log("✓ Transfer record added");

    // Add trace data
    console.log("Adding trace data...");
    const turmericTraceTx = await contract.addTraceData(
      turmericData.batchId,
      turmericData.traceData.notes,
      turmericData.traceData.qrCodeHash
    );
    await turmericTraceTx.wait();
    console.log("✓ Trace data added");

    // Add Clove data
    console.log("\n=== Adding Clove Data ===");
    
    // Create batch
    console.log("Creating batch...");
    const cloveBatchTx = await contract.createBatch(
      cloveData.batchId,
      cloveData.cropName,
      cloveData.variety,
      cloveData.location,
      cloveData.harvestDate
    );
    await cloveBatchTx.wait();
    console.log("✓ Batch created");

    // Add farmer info
    console.log("Adding farmer info...");
    const cloveFarmerTx = await contract.addFarmerInfo(
      cloveData.batchId,
      cloveData.farmer.farmerName,
      cloveData.farmer.farmLocation,
      cloveData.farmer.contact,
      cloveData.farmer.farmerId
    );
    await cloveFarmerTx.wait();
    console.log("✓ Farmer info added");

    // Add cultivation details
    console.log("Adding cultivation details...");
    const cloveCultivationTx = await contract.addCultivationDetails(
      cloveData.batchId,
      cloveData.cultivation.soilType,
      cloveData.cultivation.irrigationType,
      cloveData.cultivation.pesticideUsed,
      cloveData.cultivation.sowingDate,
      cloveData.cultivation.area
    );
    await cloveCultivationTx.wait();
    console.log("✓ Cultivation details added");

    // Add processing info
    console.log("Adding processing info...");
    const cloveProcessingTx = await contract.addProcessingInfo(
      cloveData.batchId,
      cloveData.processing.processorName,
      cloveData.processing.method,
      cloveData.processing.processingDate,
      cloveData.processing.processingUnitId
    );
    await cloveProcessingTx.wait();
    console.log("✓ Processing info added");

    // Add lab result
    console.log("Adding lab result...");
    const cloveLabTx = await contract.addLabResult(
      cloveData.batchId,
      cloveData.labResult.labName,
      cloveData.labResult.result,
      cloveData.labResult.testDate,
      cloveData.labResult.reportHash
    );
    await cloveLabTx.wait();
    console.log("✓ Lab result added");

    // Add certificate
    console.log("Adding certificate...");
    const cloveCertTx = await contract.addCertificate(
      cloveData.batchId,
      cloveData.certificate.issuedBy,
      cloveData.certificate.certificateType,
      cloveData.certificate.issueDate,
      cloveData.certificate.certificateId
    );
    await cloveCertTx.wait();
    console.log("✓ Certificate added");

    // Add transfer record
    console.log("Adding transfer record...");
    const cloveTransferTx = await contract.addTransferRecord(
      cloveData.batchId,
      cloveData.transfer.from,
      cloveData.transfer.to,
      cloveData.transfer.purpose
    );
    await cloveTransferTx.wait();
    console.log("✓ Transfer record added");

    // Add trace data
    console.log("Adding trace data...");
    const cloveTraceTx = await contract.addTraceData(
      cloveData.batchId,
      cloveData.traceData.notes,
      cloveData.traceData.qrCodeHash
    );
    await cloveTraceTx.wait();
    console.log("✓ Trace data added");

    console.log("\n=== Data Population Complete ===");
    console.log("✓ Turmeric batch ID: ERD-TUR-2025-001");
    console.log("✓ Clove batch ID: KC-CLOVE-2025-001");
    console.log("\nYou can now search for these batches in the frontend!");

  } catch (error) {
    console.error("Error populating data:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 