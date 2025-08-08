
import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Deploying AgroTrust contract...");

  const AgroTrust = await ethers.getContractFactory("AgroTrust");
  const agroTrust = await AgroTrust.deploy();
  await agroTrust.waitForDeployment();

  const address = await agroTrust.getAddress();
  console.log(`AgroTrust deployed to: ${address}`);

  // Verify the deployment
  const owner = await agroTrust.owner();
  console.log(`Contract owner: ${owner}`);

  const isOwnerAuthorized = await agroTrust.authorizedUsers(owner);
  console.log(`Owner is authorized: ${isOwnerAuthorized}`);

  // Write deployed-contract.json
  const artifactPath = path.join(__dirname, "../artifacts/contracts/AgroTrust.sol/AgroTrust.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const deployed = {
    address,
    abi: artifact.abi
  };
  const outputPath = path.join(__dirname, "../deployed-contract.json");
  fs.writeFileSync(outputPath, JSON.stringify(deployed, null, 2));
  console.log(`deployed-contract.json written to: ${outputPath}`);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 