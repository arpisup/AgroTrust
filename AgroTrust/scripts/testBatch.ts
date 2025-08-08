import { ethers } from "hardhat";

async function main() {
  console.log("Testing batch data...");

  // Get the deployed contract
  const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";
  const AgroTrust = await ethers.getContractFactory("AgroTrust");
  const contract = AgroTrust.attach(contractAddress);

  const batchId = "ERD-TUR-2025-001";

  try {
    // Check if batch exists
    const exists = await contract.checkBatchExists(batchId);
    console.log(`Batch ${batchId} exists:`, exists);

    if (exists) {
      // Get batch info
      const batch = await contract.batches(batchId);
      console.log("Batch info:", {
        cropName: batch.cropName,
        variety: batch.variety,
        location: batch.location,
        harvestDate: Number(batch.harvestDate),
        exists: batch.exists
      });

      // Get farmer info
      const farmer = await contract.farmerData(batchId);
      console.log("Farmer info:", {
        farmerName: farmer.farmerName,
        farmLocation: farmer.farmLocation,
        contact: farmer.contact,
        farmerId: farmer.farmerId,
        exists: farmer.exists
      });

      // Get cultivation details
      const cultivation = await contract.cultivationDetails(batchId);
      console.log("Cultivation details:", {
        soilType: cultivation.soilType,
        irrigationType: cultivation.irrigationType,
        pesticideUsed: cultivation.pesticideUsed,
        sowingDate: Number(cultivation.sowingDate),
        area: Number(cultivation.area),
        exists: cultivation.exists
      });

      // Get processing info
      const processing = await contract.processingInfo(batchId);
      console.log("Processing info:", {
        processorName: processing.processorName,
        method: processing.method,
        processingDate: Number(processing.processingDate),
        processingUnitId: processing.processingUnitId,
        exists: processing.exists
      });

      // Get lab result
      const labResult = await contract.labResults(batchId);
      console.log("Lab result:", {
        labName: labResult.labName,
        result: labResult.result,
        testDate: Number(labResult.testDate),
        reportHash: labResult.reportHash,
        exists: labResult.exists
      });

      // Get certificate
      const certificate = await contract.certificates(batchId);
      console.log("Certificate:", {
        issuedBy: certificate.issuedBy,
        certificateType: certificate.certificateType,
        issueDate: Number(certificate.issueDate),
        certificateId: certificate.certificateId,
        exists: certificate.exists
      });

      // Get transfer count
      const transferCount = await contract.getTransferRecordCount(batchId);
      console.log("Transfer count:", Number(transferCount));

      // Get trace data
      const traceData = await contract.traceRecords(batchId);
      console.log("Trace data:", {
        notes: traceData.notes,
        qrCodeHash: traceData.qrCodeHash,
        exists: traceData.exists
      });
    }
  } catch (error) {
    console.error("Error testing batch:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 