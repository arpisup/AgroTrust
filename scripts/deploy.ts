import { ethers } from "hardhat";

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

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 