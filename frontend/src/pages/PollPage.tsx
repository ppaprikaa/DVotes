import { useState, useEffect } from "react"
import NavBar from "../components/NavBar"
import { State } from "../services/state/state"
import { Poll } from "../services/models/poll"
import useStore from "../hooks/useStore"
import Web3 from "web3"
import { LoadDVotesContract } from "../services/contracts/LoadDVotes"
import { useParams, useNavigate } from "react-router-dom"
import { getOptions, getPoll } from "../services/contracts/DVotes"
import { isNumber } from "../utils/nums"
import PollCard from "../components/PollCard"
import { Option } from "../services/models/options"
import OptionList from "../components/OptionList"

export default function PollPage() {
	const setWeb3 = useStore((state: State) => state.setWeb3)
	const [poll, setPoll] = useState<Poll | null>(null)
	const [options, setOptions] = useState<Option[] | null>(null)
	const account = useStore((state: State) => state.account)
	const contract = useStore((state: State) => state.contract)
	const web3 = useStore((state: State) => state.web3)
	const setContract = useStore((state: State) => state.setContract)
	const navigate = useNavigate()

	const { id } = useParams()

	if (id === undefined || id === null || id !== undefined && !isNumber(String(id))) {
		navigate("/")
	}

	useEffect(() => {
		const init = async () => {
			if (window.ethereum) {
				try {
					if (web3 === null || web3 === undefined) {
						setWeb3(new Web3(window.ethereum))
					}

					if (web3 && contract === null) {
						const contract = LoadDVotesContract(web3)
						setContract(contract)
					}

					if (account !== null && id !== undefined && contract !== null) {
						await getPoll(contract, String(id))
							.then(newPoll => {
								if (String(newPoll?.id) === "0") {
									navigate("/polls")
								}

								if (newPoll === null) {
									navigate("/polls")
								}

								setPoll(newPoll)
							})
						await getOptions(contract, String(id))
							.then(newOptions => {
								if (newOptions === null || newOptions === undefined) {
									navigate("/polls")
									return
								}

								if (newOptions?.length < 2) {
									navigate("/polls")
									return
								}

								setOptions(newOptions)
							})
					}
				} catch (e) {
					let message = "Unknown error"
					if (e instanceof Error) {
						message = e.message
					}

					reportError(message)
					navigate("/")
				}
			}
		}
		init()
	}, [id])

	if (poll === null) {
		navigate("/polls")
	}

	return (
		<>
			<NavBar />
			<div>
				{
					poll && options ?
						<div>
							<PollCard poll={poll} />
							<OptionList pollId={poll.id} options={options} />
						</div>
						: <h1><b>Poll does not exist</b></h1>
				}
			</div>
		</>
	)
}
