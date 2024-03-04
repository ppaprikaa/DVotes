import Web3 from "web3"
import useStore from "../hooks/useStore";
import { State } from "../services/state/state";

export async function ThrowsConnectMetamaskAndReturnW3(): Promise<Web3> {
	if (!window.ethereum) {
		throw new Error("error: metamask not found")
	}

	const web3 = new Web3(window.ethereum);
	await window.ethereum.request({ method: 'eth_requestAccounts' });

	return web3
}

export async function ThrowsLoadStateIfEmpty(): Promise<Web3> {
	try {
		const setW3 = useStore((state: State) => state.setWeb3)
		const setAccount = useStore((state: State) => state.setAccount)

		const web3 = await ThrowsConnectMetamaskAndReturnW3()
		setW3(web3)

		const accounts = await web3.eth.getAccounts()

		if (accounts[0] !== null) {
			setAccount(accounts[0])
		}

		return web3
	} catch (e) {
		let message = "error: unknown error"
		if (e instanceof Error) {
			message = e.message
		}

		throw Error(message)
	}
}
