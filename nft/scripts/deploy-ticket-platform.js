const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy EventTicketPlatform
  const EventTicketPlatform = await ethers.getContractFactory("EventTicketPlatform");
  const eventTicketPlatform = await EventTicketPlatform.deploy();
  await eventTicketPlatform.deployed();
  console.log("EventTicketPlatform deployed to:", eventTicketPlatform.address);

  // Deploy TicketMarketplace
  const TicketMarketplace = await ethers.getContractFactory("TicketMarketplace");
  const ticketMarketplace = await TicketMarketplace.deploy(eventTicketPlatform.address, deployer.address);
  await ticketMarketplace.deployed();
  console.log("TicketMarketplace deployed to:", ticketMarketplace.address);

  // Initialize the EventTicketPlatform
  const platformName = "ZetaChain Event Tickets";
  const platformSymbol = "ZET";
  const gatewayAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual gateway address
  const gas = 300000;
  const uniswapRouterAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual router address
  
  await eventTicketPlatform.initialize(
    deployer.address,
    platformName,
    platformSymbol,
    gatewayAddress,
    gas,
    uniswapRouterAddress,
    deployer.address // platform fee collector
  );
  console.log("EventTicketPlatform initialized");

  // Set marketplace fee collector
  await ticketMarketplace.setFeeCollector(deployer.address);
  console.log("Marketplace fee collector set");

  console.log("Deployment completed successfully!");
  console.log("EventTicketPlatform:", eventTicketPlatform.address);
  console.log("TicketMarketplace:", ticketMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
