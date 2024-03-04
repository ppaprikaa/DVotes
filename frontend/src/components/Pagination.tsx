import Button from "./Button";
import { useNavigate } from "react-router-dom";

interface Props {
	pages: number[];
	pageGroup: string;
	activePage: number,
	setActivePage: (number: number) => void;
}

export default function Pagination({
	pages,
	pageGroup,
	activePage,
	setActivePage
}: Props) {
	const navigate = useNavigate()
	const classes = "join-item btn"

	function getClasses(page: number, activePage: number): string {
		return page == activePage ? classes + " btn-active" : classes
	}

	return (
		<div className="join">
			{pages.map(
				page => <Button
					key={page}
					onClick={() => {
						setActivePage(page)
						navigate(`/${pageGroup}/${page}`)
					}}
					className={getClasses(page, activePage)}
				> {page}</Button>
			)
			}
		</div >
	)
}

