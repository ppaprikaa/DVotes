import { Option } from "../services/models/options"
import OptionCard from "./OptionCard";

interface Props {
	pollId: string;
	options: Option[];
}

export default function OptionList({ pollId, options }: Props) {
	return (
		<>
			{options.map(option =>
				<OptionCard
					pollId={pollId}
					option={option}
					key={option.id}
				/>
			)}
		</>
	)
}
