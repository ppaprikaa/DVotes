import useStore from "../hooks/useStore";
import { vote } from "../services/contracts/DVotes";
import { Option } from "../services/models/options";
import { State } from "../services/state/state";
import Button from "./Button";

interface Props {
	pollId: string;
	option: Option;
}

export default function OptionCard({ pollId, option }: Props) {
	const contract = useStore((state: State) => state.contract)
	const account = useStore((state: State) => state.account)

	if (contract === null || account === null) {
		return (
			<div>No options unless contract loaded</div>
		)
	}

	return (
		<div className="card w-100 bg-base-100">
			<div className="card-body">
				<p><b>id</b>: {String(option.id)}</p>
				<h2 className="card-title">{option.name}</h2>
				<p><b>votes</b>: {String(option.votes)}</p>
				<figure><img alt={option.IPFSPicHash} src={`https://ipfs.io/ipfs/${option.IPFSPicHash}`} /></figure>
				<Button
					className="btn"
					onClick={async () => {
						try {
							await vote(
								contract,
								account,
								pollId,
								option.id
							)
						} catch (e: any) {
							alert(e)
						}
					}}
				>Vote</Button>
			</div>
		</div>
	)
}
