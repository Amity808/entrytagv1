import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0xFe86C4E5d0459Ba73611BC0F9e98028132DB741E";

  console.log(
    "Testing event creation on deployed EventTicketPlatform contract..."
  );
  console.log("Contract Address:", contractAddress);

  try {
    const provider = ethers.provider;
    const [deployer] = await ethers.getSigners();

    // Get the contract factory
    const EventTicketPlatform = await ethers.getContractFactory(
      "EventTicketPlatform"
    );
    const contract = EventTicketPlatform.attach(contractAddress);

    console.log("Deployer address:", deployer.address);

    // Based on the ABI, createEvent takes 5 parameters:
    // createEvent(string, uint8, uint256, uint256, uint256)
    // Let me try to understand what these parameters are

    console.log("\nAttempting to create an event...");

    // Try with the parameters we see in the ABI
    const eventName = "Test Music Festival";
    const category = 0; // Concert
    const startTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
    const endTime = startTime + 3600; // 1 hour later
    const basePrice = ethers.utils.parseEther("0.1"); // 0.1 ETH

    console.log("Event name:", eventName);
    console.log("Category:", category);
    console.log("Start time:", new Date(startTime * 1000).toISOString());
    console.log("End time:", new Date(endTime * 1000).toISOString());
    console.log("Base price:", ethers.utils.formatEther(basePrice), "ETH");

    const tx = await contract.createEvent(
      eventName,
      category,
      startTime,
      endTime,
      basePrice,
      {
        gasLimit: 2000000, // Higher gas limit
      }
    );

    console.log("✅ Event creation transaction sent!");
    console.log("Transaction hash:", tx.hash);

    // Wait for confirmation
    console.log("Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("✅ Event created successfully!");
    console.log("Gas used:", receipt.gasUsed.toString());
    console.log("Block number:", receipt.blockNumber);

    // Try to get the created event
    try {
      console.log("\nTrying to get the created event...");
      const event = await contract.getEvent(1, { gasLimit: 1000000 });
      console.log("✅ Event retrieved:", event);
    } catch (error) {
      console.log("❌ Could not get event:", error.message);
    }
  } catch (error) {
    console.error("❌ Event creation failed:", error.message);

    if (error.transaction) {
      console.log("Transaction hash:", error.transaction.hash);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
