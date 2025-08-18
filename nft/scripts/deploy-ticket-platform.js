const { ethers, upgrades } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy EventTicketPlatform using upgradeable pattern
  const EventTicketPlatform = await ethers.getContractFactory(
    "EventTicketPlatform"
  );
  const eventTicketPlatform = await upgrades.deployProxy(
    EventTicketPlatform,
    [
      deployer.address, // initialOwner
      "ZetaChain Event Tickets", // name
      "ZET", // symbol
      "0x0000000000000000000000000000000000000000", // gatewayAddress (placeholder)
      300000, // gas limit
      "0x0000000000000000000000000000000000000000", // uniswapRouterAddress (placeholder)
      5, // platformFeePercentage (5%)
      deployer.address, // platformTreasury
    ],
    {
      initializer: "initialize",
      kind: "uups",
    }
  );

  await eventTicketPlatform.deployed();
  console.log("EventTicketPlatform deployed to:", eventTicketPlatform.address);

  // Create a sample event to demonstrate functionality
  console.log("\nCreating sample event...");
  const eventDetails = "Sample Concert Event";
  const category = 0; // Concert
  const startTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
  const endTime = startTime + 7200; // 2 hours later
  const basePrice = ethers.utils.parseEther("0.01"); // 0.01 ETH
  const totalTickets = 50;

  const createTx = await eventTicketPlatform.createEvent(
    eventDetails,
    category,
    startTime,
    endTime,
    basePrice,
    totalTickets
  );
  await createTx.wait();
  console.log("✅ Sample event created successfully");

  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log(`Contract Address: ${eventTicketPlatform.address}`);
  console.log(`Owner: ${deployer.address}`);
  console.log(`Platform Fee: 5%`);
  console.log(`Treasury: ${deployer.address}`);

  console.log("\nNext steps:");
  console.log("1. Update gateway and router addresses for production");
  console.log("2. Test event creation and ticket purchasing");
  console.log("3. Deploy to testnet for further testing");

  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
