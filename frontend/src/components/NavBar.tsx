import { Link } from "react-router-dom"
import useStore from "../hooks/useStore"
import { State } from "../services/state/state"
import Button from "./Button"
import Web3 from "web3"
import { useCookies } from "react-cookie"
import { ThrowsConnectMetamaskAndReturnW3 } from "../utils/LoadW3"
import { useEffect } from "react"

declare global {
	interface Window {
		ethereum?: any;
	}
}

export default function NavBar() {
	let account = useStore((state: State) => state.account)
	let web3: Web3 | null = useStore((state: State) => state.web3)
	const setAccount = useStore((state: State) => state.setAccount)
	const setWeb3 = useStore((state: State) => state.setWeb3)

	const [cookies, setCookie, removeCookie] = useCookies(["userAccount"]);
	useEffect(() => {
		async function loadAccountAndW3() {
			if (cookies.userAccount) {
				setAccount(cookies.userAccount)
				if (web3 === null && window.ethereum) {
					web3 = await ThrowsConnectMetamaskAndReturnW3()
				}
			}
		}

		loadAccountAndW3()
	}, [])

	if (account === null && !cookies.userAccount) {
		return (
			<div className="navbar bg-primary">
				<div className="navbar-start project-name">
					<Link to="/" className="btn">
						DVotes
					</Link>
				</div>
				<div className="navbar-end">
					{!window.ethereum ?
						<a> Install Metamask </a>
						:
						<Button onClick={
							async () => {
								try {
									web3 = await ThrowsConnectMetamaskAndReturnW3();
									const accounts = await web3.eth.getAccounts();
									account = accounts[0];
									if (account !== null) {
										setAccount(account)
										setCookie("userAccount", account, {
											maxAge: 3600,
											path: "/",
											sameSite: "none"
										})
										setWeb3(web3)
									}
								}
								catch (e) {
									let message: string = "Unknown error"
									if (e instanceof Error) {
										message = e.message
									}

									reportError(message);
								}
							}}>Connect</Button>
					}
				</div>
			</div >
		)
	}

	interface RouteButton {
		Route: string;
		Text: string;
	}

	let buttons: RouteButton[] = [
		{
			Route: "/polls",
			Text: "Polls",
		},
		{
			Route: "/polls/create",
			Text: "Create poll",
		},
	]
	return (
		<div className="navbar bg-primary">
			<div className="navbar-start project-name">
				<Link to="/" className="btn">
					DVotes
				</Link>
				{
					buttons.map(button => <Link
						to={button.Route}
						key={button.Route}
						className="btn ml-2"
					>{button.Text}</Link>)
				}
			</div>
			<div className="navbar-end">
				<Button onClick={() => {
					removeCookie("userAccount", { path: "/", sameSite: "none" })
					setAccount(null)
					setWeb3(null)
				}} className="btn">Logout</Button>
			</div>
		</div>
	)
}
