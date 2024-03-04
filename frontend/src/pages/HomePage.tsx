import { useEffect } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
	const navigate = useNavigate()

	useEffect(() => {
		navigate("/polls")
	})

	return (
		<>
			<NavBar />
		</>
	)
}
