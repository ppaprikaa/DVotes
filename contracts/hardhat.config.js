require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.24",

	networks: {
		sepolia: {
			url: process.env.NODE_URL,
			accounts: [process.env.PKEY]
		},
		ganache: {
			url: "HTTP://127.0.0.1:7545",
			accounts: [process.env.GANACHE_PKEY]
		}
	}
};
