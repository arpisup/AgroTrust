import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  console.log("Verifying blockchain data for Erode Turmeric and Clove batches...");

  // Load contract address and ABI from deployed-contract.json
  const deployed = JSON.parse(fs.readFileSync("./deployed-contract.json", "utf8"));
  const contractAddress = deployed.address;
  const contractAbi = deployed.abi;
  const contract = new ethers.Contract(contractAddress, contractAbi, (await ethers.getSigners())[0]);

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Using signer:", await signer.getAddress());

  const testBatches = [
    {
      batchId: "ERD-TUR-2025-001",
      name: "Erode Turmeric (Erode Manjal)"
    },
    {
      batchId: "KC-CLOVE-2025-001", 
      name: "Kanyakumari Clove"
    }
  ];

  for (const batch of testBatches) {
    console.log(`\n=== Checking ${batch.name} ===`);
    
    try {
      // Check if batch exists
      const exists = await contract.checkBatchExists(batch.batchId);
      console.log(`✓ Batch exists: ${exists}`);
      
      if (exists) {
        // Get batch details
        const batchData = await contract.getBatch(batch.batchId);
        console.log(`✓ Crop: ${batchData.cropName}`);
        console.log(`✓ Variety: ${batchData.variety}`);
        console.log(`✓ Location: ${batchData.location}`);
        console.log(`✓ Harvest Date: ${new Date(Number(batchData.harvestDate) * 1000).toLocaleDateString()}`);
        
        // Get farmer info
        const farmerData = await contract.getFarmerInfo(batch.batchId);
        if (farmerData.exists) {
          console.log(`✓ Farmer: ${farmerData.farmerName}`);
          console.log(`✓ Farm Location: ${farmerData.farmLocation}`);
        }
        
        // Get cultivation details
        const cultivationData = await contract.getCultivationDetails(batch.batchId);
        if (cultivationData.exists) {
          console.log(`✓ Soil Type: ${cultivationData.soilType}`);
          console.log(`✓ Irrigation: ${cultivationData.irrigationType}`);
        }
        
        // Get processing info
        const processingData = await contract.getProcessingInfo(batch.batchId);
        if (processingData.exists) {
          console.log(`✓ Processor: ${processingData.processorName}`);
          console.log(`✓ Method: ${processingData.method}`);
        }
        
        // Get lab results
        const labData = await contract.getLabResult(batch.batchId);
        if (labData.exists) {
          console.log(`✓ Lab: ${labData.labName}`);
          console.log(`✓ Result: ${labData.result}`);
        }
        
        // Get certificate
        const certData = await contract.getCertificate(batch.batchId);
        if (certData.exists) {
          console.log(`✓ Certificate: ${certData.certificateType}`);
          console.log(`✓ Issued By: ${certData.issuedBy}`);
        }
        
        // Get transfer records
        const transferCount = await contract.getTransferRecordCount(batch.batchId);
        console.log(`✓ Transfer Records: ${transferCount}`);
        
        // Get trace data
        const traceData = await contract.getTraceNotes(batch.batchId);
        if (traceData.exists) {
          console.log(`✓ Trace Notes: ${traceData.notes}`);
        }
        
        console.log(`✅ ${batch.name} data is complete and accessible!`);
      } else {
        console.log(`❌ ${batch.name} does not exist on the blockchain`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${batch.name}:`, error);
    }
  }

  console.log("\n=== Verification Complete ===");
  console.log("If all batches show ✅, the data is properly populated!");
  console.log("If any show ❌, run 'npm run populate' to add the data.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 