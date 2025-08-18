import { ethers } from "hardhat";
import { upgrades } from "hardhat";
import { EventTicketPlatform } from "../typechain-types";

async function main() {
    console.log("Deploying EventTicketPlatform...");

    // Get the contract factory
    const EventTicketPlatform = await ethers.getContractFactory("EventTicketPlatform");

    // Get the deployer signer
    const [deployer] = await ethers.getSigners();

    // Deploy the contract using upgradeable pattern
    const ticketPlatform = await upgrades.deployProxy(EventTicketPlatform, [
        deployer.address, // initialOwner
        "Event Tickets", // name
        "TICKET", // symbol
        "0x0000000000000000000000000000000000000000", // gatewayAddress (placeholder)
        300000, // gas limit
        "0x0000000000000000000000000000000000000000", // uniswapRouterAddress (placeholder)
        5, // platformFeePercentage (5%)
        deployer.address // platformTreasury
    ], {
        initializer: 'initialize',
        kind: 'uups'
    });

    await ticketPlatform.waitForDeployment();

    const address = await ticketPlatform.getAddress();
    console.log(`EventTicketPlatform deployed to: ${address}`);

    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log(`Contract Address: ${address}`);
    console.log(`Owner: ${deployer.address}`);
    console.log(`Platform Fee: 5%`);
    console.log(`Treasury: ${deployer.address}`);

    console.log("\nNext steps:");
    console.log("1. Update gateway and router addresses for production");
    console.log("2. Test event creation and ticket purchasing");
    console.log("3. Deploy to testnet for further testing");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
