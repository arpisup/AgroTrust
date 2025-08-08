import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  // Load contract address and ABI
  const deployed = JSON.parse(fs.readFileSync("./deployed-contract.json", "utf8"));
  const contractAddress = deployed.address;
  const contractAbi = deployed.abi;
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  // Batch data
  const batches = [
    {
      batchId: "ERD-TUR-2025-001",
      cropName: "Erode Turmeric (Erode Manjal)",
      variety: "Erode",
      location: "Erode, Tamil Nadu",
      harvestDate: Math.floor(new Date("2025-01-15").getTime() / 1000),
    },
    {
      batchId: "KC-CLOVE-2025-001",
      cropName: "Kanyakumari Clove",
      variety: "Kanyakumari",
      location: "Kanyakumari, Tamil Nadu",
      harvestDate: Math.floor(new Date("2025-02-10").getTime() / 1000),
    },
  ];

  for (const batch of batches) {
    // Try to delete batch if exists (by setting exists to false via a custom function, if available)
    // If your contract does not support deletion, you must reset the blockchain node for a clean state.
    try {
      const exists = await contract.checkBatchExists(batch.batchId);
      if (exists) {
        console.log(`Batch ${batch.batchId} already exists. Skipping deletion (no delete function in contract).`);
        // If you want to reset, stop your node and restart for a clean chain.
        continue;
      }
    } catch (e) {
      // Ignore errors
    }
    // Add batch
    try {
      const tx = await contract.createBatch(
        batch.batchId,
        batch.cropName,
        batch.variety,
        batch.location,
        batch.harvestDate
      );
      await tx.wait();
      console.log(`Batch ${batch.batchId} added.`);
    } catch (e) {
      console.error(`Error adding batch ${batch.batchId}:`, e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
