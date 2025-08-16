import { ethers } from "hardhat";
import { EventTicketPlatform } from "../typechain-types";

async function main() {
    console.log("Deploying EventTicketPlatform...");

    // Get the contract factory
    const EventTicketPlatform = await ethers.getContractFactory("EventTicketPlatform");

    // Deploy the contract
    const ticketPlatform = await EventTicketPlatform.deploy();
    await ticketPlatform.waitForDeployment();

    const address = await ticketPlatform.getAddress();
    console.log(`EventTicketPlatform deployed to: ${address}`);

    // Initialize the contract with default values
    const [deployer] = await ethers.getSigners();

    // Default configuration
    const platformFeePercentage = 5; // 5% platform fee
    const platformTreasury = deployer.address; // Deployer as treasury initially

    // Initialize the contract
    const tx = await ticketPlatform.initialize(
        deployer.address, // initialOwner
        "Event Tickets", // name
        "TICKET", // symbol
        "0x0000000000000000000000000000000000000000", // gatewayAddress (placeholder)
        300000, // gas limit
        "0x0000000000000000000000000000000000000000", // uniswapRouterAddress (placeholder)
        platformFeePercentage,
        platformTreasury
    );

    await tx.wait();
    console.log("EventTicketPlatform initialized successfully!");

    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log(`Contract Address: ${address}`);
    console.log(`Owner: ${deployer.address}`);
    console.log(`Platform Fee: ${platformFeePercentage}%`);
    console.log(`Treasury: ${platformTreasury}`);

    console.log("\nNext steps:");
    console.log("1. Update gateway and router addresses for production");
    console.log("2. Create promo codes using createPromoCode()");
    console.log("3. Test event creation and ticket purchasing");
    console.log("4. Deploy to testnet for further testing");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
