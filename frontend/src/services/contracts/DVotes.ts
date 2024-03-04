import { Contract, ContractAbi } from "web3";
import { Poll } from "../models/poll";
import { Option } from "../models/options";

export async function getPolls(
	contract: Contract<ContractAbi>,
	offset: string,
	limit: string
): Promise<Poll[]> {
	let polls: Poll[] = [];

	await contract.methods.getPolls(offset, limit)
		.call()
		.then((pollsFetched: any) => {
			if (Array.isArray(pollsFetched)) {
				const newPolls = pollsFetched.map((item: any): Poll => {
					return {
						id: item.ID,
						initiator: item.initiator,
						title: item.title,
						description: item.description,
						voteCount: String(item.voteCount),
						optionCount: String(item.optionCount),
						finished: item.finished
					}
				})
				polls = newPolls
			}
		})

	return polls
}

export async function getOptions(
	contract: Contract<ContractAbi>,
	id: string
): Promise<Option[] | null> {
	let options: Option[] | null = null;

	await contract.methods.getOptions(id)
		.call()
		.then((optionsFetched: any) => {
			if (Array.isArray(optionsFetched)) {
				const newOptions = optionsFetched.map((item: any): Option => {
					return {
						id: item.ID,
						name: item.Name,
						IPFSPicHash: item.IPFSPicHash,
						votes: item.Votes
					}
				})

				options = newOptions
			}
		})

	return options
}

export async function getPoll(
	contract: Contract<ContractAbi>,
	id: string
): Promise<Poll | null> {
	let poll: Poll | null = null;

	await contract.methods.getPoll(id)
		.call()
		.then((pollFetched: any) => {
			poll = {
				id: String(pollFetched.ID),
				initiator: pollFetched.initiator,
				title: pollFetched.title,
				description: pollFetched.description,
				voteCount: String(pollFetched.voteCount),
				optionCount: String(pollFetched.optionCount),
				finished: pollFetched.finished
			}
		})

	return poll
}

export async function vote(
	contract: Contract<ContractAbi>,
	from: string,
	pollId: string,
	optionId: string
) {

	await contract.methods.vote(pollId, optionId)
		.send({ from: from, gas: import.meta.env.VITE_GAS_PRICE })
		.catch((e: any) => {
			let message = "error: unknown error"
			if (e instanceof Error) {
				message = e.message
			}

			throw Error(message)
		})
}

export async function createPoll(
	contract: Contract<ContractAbi>,
	from: string,
	title: string,
	description: string,
	optionNames: string[],
	optionIPFSPicHashes: string[]
) {
	await contract.methods.createPoll(
		title,
		description,
		optionNames,
		optionIPFSPicHashes
	)
		.send({ from: from, gas: import.meta.env.VITE_GAS_PRICE })
		.catch((e: any) => {
			let message = "error: unknown error"

			if (e instanceof Error) {
				message = e.message
			}

			throw Error(message)
		})
}
