const hre = require("hardhat");

async function main() {
    const DVotesContract = await hre.ethers.getContractFactory("DVotes");
    const DVotes = await DVotesContract.deploy();

    await DVotes.waitForDeployment();
    console.log("DVotes addr: ", (await DVotes.getAddress()).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });