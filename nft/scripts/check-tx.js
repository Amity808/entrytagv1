import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const txHash =
    "0xf201e80d39a5a664596371e95f819067ca47ab2d36c9b22f771dac3c6256a79b";

  console.log("Checking transaction status for:", txHash);

  try {
    const provider = ethers.provider;
    console.log("Provider:", provider.connection.url);

    // Check transaction receipt
    console.log("Checking transaction receipt...");
    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt) {
      console.log("✅ Transaction found!");
      console.log("Block number:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      console.log("Status:", receipt.status === 1 ? "Success" : "Failed");
      console.log("Confirmations:", receipt.confirmations);
    } else {
      console.log("⏳ Transaction not yet mined or pending...");

      // Check if transaction is in mempool
      const tx = await provider.getTransaction(txHash);
      if (tx) {
        console.log("📝 Transaction found in mempool");
        console.log("From:", tx.from);
        console.log("To:", tx.to);
        console.log("Gas limit:", tx.gasLimit.toString());
        console.log(
          "Gas price:",
          ethers.utils.formatUnits(tx.gasPrice, "gwei"),
          "gwei"
        );
        console.log("Nonce:", tx.nonce);
      } else {
        console.log("❌ Transaction not found in mempool");
      }
    }
  } catch (error) {
    console.error("Error checking transaction:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
