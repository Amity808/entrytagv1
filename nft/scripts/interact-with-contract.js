import pkg from "hardhat";
const { ethers, upgrades } = pkg;

async function main() {
  const contractAddress = "0xFe86C4E5d0459Ba73611BC0F9e98028132DB741E";

  console.log("Interacting with deployed EventTicketPlatform contract...");
  console.log("Contract Address:", contractAddress);

  try {
    const provider = ethers.provider;
    console.log("Provider:", provider.connection.url);

    // Get the contract factory
    const EventTicketPlatform = await ethers.getContractFactory(
      "EventTicketPlatform"
    );

    // Try to attach to the contract
    console.log("\nAttempting to attach to contract...");
    const contract = EventTicketPlatform.attach(contractAddress);

    // Check if contract exists
    const code = await provider.getCode(contractAddress);
    if (code === "0x") {
      console.log("❌ No contract code at this address");
      return;
    }
    console.log("✅ Contract code found at address");

    // Try to get basic contract info
    try {
      console.log("\nTrying to get contract name...");
      const name = await contract.name();
      console.log("✅ Contract name:", name);
    } catch (error) {
      console.log("❌ Could not get name:", error.message);
    }

    try {
      console.log("\nTrying to get contract symbol...");
      const symbol = await contract.symbol();
      console.log("✅ Contract symbol:", symbol);
    } catch (error) {
      console.log("❌ Could not get symbol:", error.message);
    }

    try {
      console.log("\nTrying to get contract owner...");
      const owner = await contract.owner();
      console.log("✅ Contract owner:", owner);
    } catch (error) {
      console.log("❌ Could not get owner:", error.message);
    }

    // Check if this is a proxy contract
    try {
      console.log("\nChecking if this is a proxy contract...");
      const implementationAddress =
        await upgrades.erc1967.getImplementationAddress(contractAddress);
      console.log("✅ Implementation address:", implementationAddress);

      // Try to get admin address
      const adminAddress = await upgrades.erc1967.getAdminAddress(
        contractAddress
      );
      console.log("✅ Admin address:", adminAddress);
    } catch (error) {
      console.log("❌ Could not get proxy info:", error.message);
    }

    // Try to create an event to test functionality
    try {
      console.log("\nTesting event creation...");
      const [deployer] = await ethers.getSigners();

      const eventName = "Test Event";
      const eventDescription = "A test event for verification";
      const startTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const endTime = startTime + 3600; // 1 hour later
      const basePrice = ethers.utils.parseEther("0.1");
      const tierCapacities = [100, 50, 25]; // General, Premium, VIP
      const tierPrices = [
        ethers.utils.parseEther("0.1"),
        ethers.utils.parseEther("0.2"),
        ethers.utils.parseEther("0.5"),
      ];

      const tx = await contract.createEvent(
        eventName,
        eventDescription,
        0, // Concert category
        startTime,
        endTime,
        basePrice,
        tierCapacities,
        tierPrices,
        false // isCrossChain
      );

      console.log("✅ Event creation transaction sent!");
      console.log("Transaction hash:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("✅ Event created successfully!");
      console.log("Gas used:", receipt.gasUsed.toString());
    } catch (error) {
      console.log("❌ Event creation failed:", error.message);
    }
  } catch (error) {
    console.error("❌ Script failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
