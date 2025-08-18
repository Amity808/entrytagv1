import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("Searching for deployed EventTicketPlatform contract...");

  try {
    const provider = ethers.provider;
    console.log("Provider:", provider.connection.url);

    // Get the latest block
    const latestBlock = await provider.getBlockNumber();
    console.log("Latest block:", latestBlock);

    // Search for our deployment transaction
    const txHash =
      "0xf201e80d39a5a664596371e95f819067ca47ab2d36c9b22f771dac3c6256a79b";
    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt && receipt.status === 1) {
      console.log("✅ Deployment transaction confirmed!");
      console.log("Block:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());

      // Look for contract creation logs
      if (receipt.logs && receipt.logs.length > 0) {
        console.log("\nContract creation logs found:");
        receipt.logs.forEach((log, index) => {
          console.log(`Log ${index}:`, {
            address: log.address,
            topics: log.topics,
            data: log.data,
          });
        });
      }

      // Try to get the contract address from the transaction
      const tx = await provider.getTransaction(txHash);
      if (tx && tx.to === null) {
        console.log("\n🎯 Contract Address (from transaction):");
        console.log("This was a contract creation transaction");
        console.log(
          "Contract address should be derived from the transaction hash"
        );
      }

      // Calculate contract address from transaction hash and nonce
      const fromAddress = receipt.from;
      const nonce = tx.nonce;
      const contractAddress = ethers.utils.getContractAddress({
        from: fromAddress,
        nonce: nonce,
      });

      console.log("\n🎯 Calculated Contract Address:");
      console.log("Address:", contractAddress);
      console.log("From:", fromAddress);
      console.log("Nonce:", nonce);

      // Try to interact with the contract to verify it's deployed
      try {
        const EventTicketPlatform = await ethers.getContractFactory(
          "EventTicketPlatform"
        );
        const contract = EventTicketPlatform.attach(contractAddress);

        const name = await contract.name();
        const symbol = await contract.symbol();
        const owner = await contract.owner();

        console.log("\n✅ Contract verification successful!");
        console.log("Name:", name);
        console.log("Symbol:", symbol);
        console.log("Owner:", owner);

        console.log("\n🎉 EventTicketPlatform is deployed and working!");
        console.log("Contract Address:", contractAddress);
      } catch (error) {
        console.log("\n⚠️  Could not verify contract at calculated address");
        console.log("Error:", error.message);
      }
    } else {
      console.log("❌ Transaction not found or failed");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
