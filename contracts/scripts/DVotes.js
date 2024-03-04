const hre = require("hardhat");

const polls = [
	{
		title: "A",
		description: "A desc",
		optionNames: ["A", "B"],
		optionsPics: ["A pic", "B pic"]
	},
	{
		title: "B",
		description: "B desc",
		optionNames: ["B", "C"],
		optionsPics: ["B pic", "C pic"]
	},
	{
		title: "A",
		description: "A desc",
		optionNames: ["A", "B"],
		optionsPics: ["A pic", "B pic"]
	},
	{
		title: "B",
		description: "B desc",
		optionNames: ["B", "C"],
		optionsPics: ["B pic", "C pic"]
	}
]

async function main() {
    const DVotesContract = await hre.ethers.getContractFactory("DVotes");
    const DVotes = await DVotesContract.deploy();

    await DVotes.waitForDeployment();
		
	polls.forEach(async (poll) => {
		await DVotes.createPoll(
			poll.title,
			poll.description,
			poll.optionNames,
			poll.optionPics
		)
	})

    console.log("DVotes addr: ", (await DVotes.getAddress()).toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
