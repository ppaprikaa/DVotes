const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { Contract } = require("ethers");
const { ethers } = require("hardhat");


describe("DVotes", () => {
	let dvotes;
	let owner;
	let addrA;
	let addrB;

	beforeEach(async function() {
		contract = await loadFixture(deploy);
	})

	async function deploy() {
		const DVotes = await ethers.getContractFactory("DVotes");
		dvotes = await DVotes.deploy();
		[owner, addrA, addrB] = await ethers.getSigners();
		await dvotes.waitForDeployment();
		return dvotes;
	}

	describe("createPoll", function() {
		it("should create a new poll", async function() {
			title = "Poll A"
			description = "Just poll A"
			optionNames = ["A", "B"]
			optionPics = ["A Hash", "B Hash"]

			pollID = await dvotes.createPoll(
				title,
				description,
				optionNames,
				optionPics
			)

			polls = await dvotes.getPolls(0, 1000)
			poll = await dvotes.getPoll(1)

			await dvotes.vote(1, 1)

			options = await dvotes.getOptions(1)
			expect(options[0].Votes).to.equal(1)
			expect(options.length).to.equal(2)
			expect(polls.length).to.equal(1)
			expect(poll.initiator).to.equal(owner.address);
			expect(poll.title).to.equal(title);
			expect(poll.description).to.equal(description);
			expect(poll.optionCount).to.equal(optionNames.length);
			expect(poll.optionCount).to.equal(optionNames.length);
			expect(poll.finished).to.equal(false);
			optionA = await dvotes.getOption(1, 1)
			expect(optionA.Name).to.equal(optionNames[0]);
		})
	})

	describe("voting", function() {
		it("vote", async function() {
			title = "Poll A"
			description = "Just poll A"
			optionNames = ["A", "B"]
			optionPics = ["A Hash", "B Hash"]

			pollID = await dvotes.createPoll(
				title,
				description,
				optionNames,
				optionPics
			)

			expect(poll.voteCount).to.equal(0);

			await dvotes.vote(1, 0)
			poll = await dvotes.getPoll(1)

			expect(poll.voteCount).to.equal(1);
		})

	})
	describe("cancel vote", function() {
		it("should be zero votes when cancelling", async function() {
			title = "Poll A"
			description = "Just poll A"
			optionNames = ["A", "B"]
			optionPics = ["A Hash", "B Hash"]

			pollID = await dvotes.createPoll(
				title,
				description,
				optionNames,
				optionPics
			)

			poll = await dvotes.getPoll(1)
			expect(poll.voteCount).to.equal(0);

			await dvotes.vote(1, 0)

			poll = await dvotes.getPoll(1)
			expect(poll.voteCount).to.equal(1);

			await dvotes.cancelVote(1)
			poll = await dvotes.getPoll(1)
			expect(poll.voteCount).to.equal(0);
		})
	})

	describe("delete poll", function() {
		it("shouldn't get poll when poll deleted", async function() {
			title = "Poll A"
			description = "Just poll A"
			optionNames = ["A", "B"]
			optionPics = ["A Hash", "B Hash"]

			pollID = await dvotes.createPoll(
				title,
				description,
				optionNames,
				optionPics
			)

			poll = await dvotes.getPoll(1)
			expect(poll.voteCount).to.equal(0);

			optionA = await dvotes.getOption(1, 1)
			expect(optionA.Name).to.equal(optionNames[0]);

			await dvotes.deletePoll(1)
			poll = await dvotes.getPoll(1)

			expect(poll.initiator).to.equal(ethers.ZeroAddress);
			expect(poll.title).to.equal("");
			expect(poll.description).to.equal("");
			expect(poll.optionCount).to.equal(0);
			expect(poll.finished).to.equal(false);
			optionA = await dvotes.getOption(1, 1)
			expect(optionA.Name).to.equal("");
		})
	})
});
