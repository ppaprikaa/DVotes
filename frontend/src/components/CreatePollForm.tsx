import { ChangeEvent, useEffect, useState } from "react";
import Button from "./Button";
import { createPoll } from "../services/contracts/DVotes";
import useStore from "../hooks/useStore";
import { State } from "../services/state/state";
import { useNavigate } from "react-router-dom";
import { LoadDVotesContract } from "../services/contracts/LoadDVotes";

interface Option {
	name: string;
	ipfsHash: string;
}

export default function CreatePollForm() {
	const [options, setOptions] = useState<Option[]>([]);
	const [title, setTitle] = useState<string>("")
	const [description, setDescription] = useState<string>("")
	const [optionName, setOptionName] = useState<string>("")
	const [optionIPFSHash, setOptionIPFSHash] = useState<string>("")

	const contract = useStore((state: State) => state.contract)
	const account = useStore((state: State) => state.account)
	let w3 = useStore((state: State) => state.web3)
	const setContract = useStore((state: State) => state.setContract)
	const setW3 = useStore((state: State) => state.setWeb3)


	const navigate = useNavigate()

	useEffect(() => {
		const init = async () => {
			if (window.ethereum) {
				try {
					if (w3 === null || w3 === undefined) {
						setW3(window.ethereum)
					}

					if (w3 && contract === null) {
						setContract(LoadDVotesContract(w3))
					}
				} catch (e) {
					let message = "error: unknown error"
					if (e instanceof Error) {
						message = e.message
					}

					reportError(Error(message))
					navigate("/")
				}
			}
		}
		init();
	}, [])

	function addOption() {
		if (optionName.trim().length <= 8 || optionIPFSHash.trim().length === 0) {
			return
		}

		setOptions([...options, { name: optionName, ipfsHash: optionIPFSHash }])
		setOptionName("")
		setOptionIPFSHash("")
	}

	async function create() {
		if (title.trim().length < 8 || description.trim().length < 8 ||
			options.length < 2) {
			return
		}
		if (contract && account) {
			try {
				await createPoll(
					contract,
					account,
					title,
					description,
					options.map(option => option.name),
					options.map(option => option.ipfsHash),
				)

				setOptions([])
				setTitle("")
				setDescription("")
			} catch (e) {
				let message = "error: unknown error"
				if (e instanceof Error) {
					message = e.message
				}
				reportError(Error(message))
			}
		}
	}

	return (
		<div className="card card-body w-100 flex items-center">
			<h2 className="card-title">Create poll</h2>
			<div className="card-actions flex flex-col">
				<div>
					<input
						type="text"
						className="input input-bordered w-100"
						placeholder="title"
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
					/>
				</div>
				<div className="">
					<input
						type="text"
						className="input input-bordered w-100"
						placeholder="description"
						value={description}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
					/>
				</div>
			</div>
			<h4 className="card-title">Option</h4>
			<h4 className="card-title">Option count: {options.length}</h4>
			<div className="card-actions flex flex-col">
				<div>
					<input
						type="text"
						className="input input-bordered w-100"
						placeholder="option name"
						value={optionName}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setOptionName(e.target.value)}
					/>
				</div>
				<div>
					<input
						type="text"
						className="input input-bordered w-100"
						placeholder="option picture IPFS Hash"
						value={optionIPFSHash}
						onChange={(e: ChangeEvent<HTMLInputElement>) => setOptionIPFSHash(e.target.value)}
					/>
				</div>
			</div>
			<div>
				<Button
					className="btn btn-primary justify-center"
					onClick={async () => await create()}
				>
					Create
				</Button>
				<Button
					className="btn btn-primary justify-center ml-1"
					onClick={() => addOption()}
				>
					Add Option
				</Button>
			</div>
		</div>
	)
}
