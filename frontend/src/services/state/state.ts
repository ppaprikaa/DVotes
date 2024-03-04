import Web3, { Contract, ContractAbi } from "web3";

export interface State {
	account: string | null;
	web3: Web3 | null;
	contract: Contract<ContractAbi> | null,
	setAccount: (account: string | null) => void,
	setWeb3: (web3: Web3 | null) => void,
	setContract: (contract: Contract<ContractAbi> | null) => void
}
