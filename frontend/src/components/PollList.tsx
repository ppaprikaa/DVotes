import { Poll } from "../services/models/poll"
import PollCard from "./PollCard"

interface Props {
	polls: Poll[]
}

export default function PollList({ polls }: Props) {
	return <>
		{polls.map(poll => <PollCard poll={poll} key={poll.id} />)}
	</>
}
