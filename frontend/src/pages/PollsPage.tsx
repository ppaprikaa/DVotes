import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import useStore from "../hooks/useStore";
import { State } from "../services/state/state";
import Web3 from "web3";
import { Poll } from "../services/models/poll";
import { LoadDVotesContract } from "../services/contracts/LoadDVotes";
import { getPolls } from "../services/contracts/DVotes";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { isNumber } from "../utils/nums";
import PollList from "../components/PollList";
import Pagination from "../components/Pagination";


export default function PollsPage() {
	let web3 = useStore((state: State) => state.web3)
	const account = useStore((state: State) => state.account)
	const navigate = useNavigate()
	let { page } = useParams()

	const [polls, setPolls] = useState<Poll[]>([])
	const [pages, setPages] = useState<number[]>([1])

	if (page !== undefined && !isNumber(page)) {
		navigate("/polls")
	}

	if (page === undefined) {
		page = "1"
	}

	const [activePage, setActivePage] = useState<number>(Number(page))
	const setContract = useStore((state: State) => state.setContract)

	let offset: string = "0"
	let limit: string = "10"


	if (page !== undefined || page !== undefined && isNumber(page)) {
		offset = String(Number(page) * 10)
		limit = String((Number(page) * 10) + 10)
	}

	useEffect(() => {
		const init = async () => {
			if (window.ethereum) {
				try {
					if (page === "1" || page === undefined || page === null) {
						let newPages = []
						for (let i = 1; i <= 10; i++) {
							newPages.push(i)
						}
						newPages.push(100)
						setPages(newPages)
					} else {
						let newPages = []
						newPages.push(1)
						for (let i = 0; i <= 10; i++) {
							newPages.push(i + Number(page))
						}
						newPages.push(100 + Number(page))
						setPages(newPages)
					}

					if (web3 === null) {
						web3 = new Web3(window.ethereum)
					}
					const contract = LoadDVotesContract(web3)

					setContract(contract)
					if (account !== null) {
						await getPolls(contract, offset, limit)
							.then(newPolls => {
								if (Array.isArray(newPolls) && newPolls.length === 0) {
									navigate("/polls")
								}
								setPolls(newPolls)
							})
					}
				} catch (e) {
					let message = "Unknown error"
					if (e instanceof Error) {
						message = e.message
					}

					reportError(message)
					redirect("/")
				}
			}
		}
		init()
	}, [page])

	return (
		<>
			<NavBar />
			<PollList polls={polls} />
			<Pagination pageGroup="polls" pages={pages} activePage={activePage} setActivePage={setActivePage} />
		</>
	)
}
