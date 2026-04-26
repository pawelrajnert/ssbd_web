import {Outlet} from "react-router-dom";
import Header from "./shared/components/header/Header.tsx";

const Layout = () => {
    return (
            <main>
                <Header/>
                <Outlet/>
            </main>
    )
}
export default Layout;