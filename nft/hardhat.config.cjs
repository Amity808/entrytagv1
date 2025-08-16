require("@nomicfoundation/hardhat-toolbox");
const { HardhatUserConfig } = require("hardhat/config");
const dotenv = require("dotenv");

require("@zetachain/standard-contracts/tasks/nft");
require("@zetachain/localnet/tasks");
require("@zetachain/toolkit/tasks");
const { getHardhatConfig } = require("@zetachain/toolkit/utils");

require("@nomiclabs/hardhat-ethers");
require("@openzeppelin/hardhat-upgrades");

dotenv.config();

const config = {
  ...getHardhatConfig({ accounts: [process.env.PRIVATE_KEY || ""] }),
  solidity: {
    compilers: [
      {
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
          viaIR: true,
        },
        version: "0.8.26",
      },
    ],
  },
};

module.exports = config;
