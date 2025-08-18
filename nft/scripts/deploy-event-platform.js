import pkg from "hardhat";
const { ethers, upgrades } = pkg;

async function main() {
  console.log("Deploying EventTicketPlatform to ZetaChain testnet...");

  // Get the contract factory
  const EventTicketPlatform = await ethers.getContractFactory(
    "EventTicketPlatform"
  );

  // ZetaChain testnet addresses
  const gatewayAddress = "0x6c533f7fe93fae114d0954697069df33c9b74fd7"; // ZetaChain Gateway
  const uniswapRouterAddress = "0x2ca7d64A7EFE2D62A725E2B35Cf7230D6677FfEe"; // Uniswap Router

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await deployer.getBalance();
  console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");

  try {
    // Deploy the contract with proxy
    console.log("Starting deployment...");
    const eventPlatform = await upgrades.deployProxy(
      EventTicketPlatform,
      [
        deployer.address, // initialOwner
        "EventTicketPlatform", // name
        "ETP", // symbol
        gatewayAddress, // gatewayAddress
        300000, // gas
        uniswapRouterAddress, // uniswapRouterAddress
        500, // platformFeePercentage (5%)
        deployer.address, // platformTreasury
      ],
      {
        gasLimit: 3000000, // Higher gas limit
        gasPrice: ethers.utils.parseUnits("20", "gwei"), // Set gas price
        initializer: "initialize",
      }
    );

    console.log("Deployment transaction sent!");
    console.log("Transaction hash:", eventPlatform.deployTransaction.hash);
    console.log("Waiting for deployment confirmation...");

    // Wait for deployment with timeout
    const deploymentPromise = eventPlatform.deployed();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Deployment timeout after 5 minutes")),
        5 * 60 * 1000
      )
    );

    await Promise.race([deploymentPromise, timeoutPromise]);

    const address = eventPlatform.address;
    console.log("✅ EventTicketPlatform deployed to:", address);

    // Get implementation address
    const implementationAddress =
      await upgrades.erc1967.getImplementationAddress(address);
    console.log("Implementation deployed to:", implementationAddress);

    // Verify the deployment
    console.log("\nVerifying deployment...");
    const name = await eventPlatform.name();
    const symbol = await eventPlatform.symbol();
    const owner = await eventPlatform.owner();

    console.log("Contract name:", name);
    console.log("Contract symbol:", symbol);
    console.log("Contract owner:", owner);

    console.log("\n🎉 Deployment successful!");
    console.log("Contract address:", address);
    console.log("Network: ZetaChain Testnet");
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);

    if (error.transaction) {
      console.log("Transaction hash:", error.transaction.hash);
      console.log("Gas used:", error.transaction.gasLimit?.toString());
    }

    // If it's a timeout, the transaction might still be pending
    if (error.message.includes("timeout")) {
      console.log(
        "⚠️  Deployment might still be pending. Check the transaction hash above."
      );
    }

    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
