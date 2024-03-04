import Web3, { Contract, ContractAbi } from "web3";
import DVotes from "./ABI/DVotes.json"

export function LoadDVotesContract(web3: Web3): Contract<ContractAbi> {
	return new web3.eth.Contract(
		DVotes.abi,
		import.meta.env.VITE_DVOTES_CONTRACT_ADDRESS
	)
}
