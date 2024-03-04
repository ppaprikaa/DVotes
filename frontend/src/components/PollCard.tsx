import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { Poll } from "../services/models/poll";

interface Props {
	poll: Poll;
}

export default function PollCard({ poll }: Props) {
	const navigate = useNavigate()

	return (
		<div className="card w-100 bg-base-100">
			<div className="card-body">
				<h2 className="card-title">{poll.title}</h2>
				<p>{poll.description}</p>
				<p><b>initiator</b>: {poll.initiator}</p>
				<p><b>vote count</b>: {poll.voteCount}</p>
				<p><b>number of options</b>: {poll.optionCount}</p>
				<p><b>status of options</b>: {poll.finished ? "finished" : "not finished"} </p>
				<div className="card-actions">
					<Button onClick={() => {
						navigate(`/poll/${String(poll.id)}`)
					}} className="btn">Navigate</Button>
				</div>
			</div>
		</div>
	)
}
