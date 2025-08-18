const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log(
    "Testing EventTicketPlatform deployment and basic functionality..."
  );

  try {
    // Deploy the contract
    const EventTicketPlatform = await ethers.getContractFactory(
      "EventTicketPlatform"
    );
    const eventTicketPlatform = await upgrades.deployProxy(
      EventTicketPlatform,
      [
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // initialOwner (hardcoded for testing)
        "Test Event Tickets", // name
        "TEST", // symbol
        "0x0000000000000000000000000000000000000000", // gatewayAddress (placeholder)
        300000, // gas limit
        "0x0000000000000000000000000000000000000000", // uniswapRouterAddress (placeholder)
        5, // platformFeePercentage (5%)
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // platformTreasury
      ],
      {
        initializer: "initialize",
        kind: "uups",
      }
    );

    await eventTicketPlatform.deployed();
    console.log(
      "✅ EventTicketPlatform deployed successfully to:",
      eventTicketPlatform.address
    );

    // Test basic functionality
    const [deployer] = await ethers.getSigners();
    console.log("✅ Deployer address:", deployer.address);

    // Test creating an event
    const eventDetails = "Test Concert";
    const category = 0; // Concert
    const startTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
    const endTime = startTime + 7200; // 2 hours later
    const basePrice = ethers.utils.parseEther("0.01"); // 0.01 ETH
    const totalTickets = 100;

    console.log("Creating test event...");
    const createTx = await eventTicketPlatform.createEvent(
      eventDetails,
      category,
      startTime,
      endTime,
      basePrice,
      totalTickets
    );
    await createTx.wait();
    console.log("✅ Test event created successfully");

    // Test getting event info
    const event = await eventTicketPlatform.events(0);
    console.log("✅ Event details retrieved:", {
      eventId: event.eventId.toString(),
      details: event.eventDetails,
      totalTickets: event.totalTickets.toString(),
      soldTickets: event.soldTickets.toString(),
      status: event.status.toString(),
    });

    console.log("\n🎉 All tests passed! Contract is working correctly.");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

