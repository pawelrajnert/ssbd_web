import {useNavigate} from "react-router-dom";
import {PATHS} from "../../../routes/paths.ts";

export default function Header() {
    const navigate = useNavigate();
    function handleHome() {
        navigate(PATHS.HOME)
    }
    function handleAbout() {
        navigate(PATHS.ABOUT)
    }

    return (
        <header>
            <button onClick={handleHome} className={"bg-amber-600 text-5xl"}>home</button>
            <button onClick={handleAbout}>about</button>
        </header>
    )
}