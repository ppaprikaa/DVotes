export interface Poll {
	id: string;
	initiator: string;
	title: string;
	description: string;

	voteCount: string;
	optionCount: string;
	finished: boolean;
}
