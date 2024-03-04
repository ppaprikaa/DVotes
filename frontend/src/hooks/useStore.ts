import { create } from "zustand";
import Web3, { Contract, ContractAbi } from "web3";
import { State } from "../services/state/state"

type SetState = (state: Partial<State>) => void;

const useStore = create<State>((set: SetState) => ({
	account: null,
	web3: null,
	contract: null,
	setAccount: (account: string | null) => set({ account: account }),
	setWeb3: (web3: Web3 | null) => set({ web3: web3 }),
	setContract: (contract: Contract<ContractAbi> | null) => set({ contract: contract })
}));

export default useStore
