import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const contractAddress = "0xFe86C4E5d0459Ba73611BC0F9e98028132DB741E";

  console.log("Checking available functions on deployed contract...");
  console.log("Contract Address:", contractAddress);

  try {
    const provider = ethers.provider;

    // Get contract bytecode
    const code = await provider.getCode(contractAddress);
    console.log("Contract bytecode length:", code.length);

    // Get the contract factory
    const EventTicketPlatform = await ethers.getContractFactory(
      "EventTicketPlatform"
    );

    // Try to get the ABI
    const abi = EventTicketPlatform.interface.fragments;
    console.log("\nAvailable functions from ABI:");
    abi.forEach((fragment, index) => {
      if (fragment.type === "function") {
        console.log(
          `${index + 1}. ${fragment.name}(${fragment.inputs
            .map((i) => i.type)
            .join(", ")})`
        );
      }
    });

    // Try to call a simple view function with more gas
    try {
      console.log("\nTrying to call name() with higher gas limit...");
      const contract = EventTicketPlatform.attach(contractAddress);

      const tx = await contract.name({
        gasLimit: 1000000, // Much higher gas limit
      });
      console.log("✅ Contract name:", tx);
    } catch (error) {
      console.log("❌ Still failing:", error.message);
    }

    // Check if we can get the contract owner using a different approach
    try {
      console.log("\nTrying to get owner using raw call...");
      const data = EventTicketPlatform.interface.encodeFunctionData("owner");
      console.log("Encoded data:", data);

      const result = await provider.call({
        to: contractAddress,
        data: data,
        gasLimit: 1000000,
      });

      if (result && result !== "0x") {
        const decoded = EventTicketPlatform.interface.decodeFunctionResult(
          "owner",
          result
        );
        console.log("✅ Owner:", decoded[0]);
      } else {
        console.log("❌ No result returned");
      }
    } catch (error) {
      console.log("❌ Raw call failed:", error.message);
    }

    // Check the implementation contract
    try {
      console.log("\nChecking implementation contract...");
      const implementationAddress =
        "0x8dcc416736ad938bd0768f44857C51a8f5E9a4c9";
      const implCode = await provider.getCode(implementationAddress);
      console.log("Implementation contract code length:", implCode.length);

      if (implCode !== "0x") {
        console.log("✅ Implementation contract exists");
      } else {
        console.log("❌ Implementation contract not found");
      }
    } catch (error) {
      console.log("❌ Could not check implementation:", error.message);
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
