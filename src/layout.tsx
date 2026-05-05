import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./shared/components/header/Header.tsx";
import { BreadcrumbContext } from "./contexts/BreadcrumbContext.tsx";

const Layout = () => {
    const [dynamicBreadcrumb, setDynamicBreadcrumb] = useState<string | null>(null);

    return (
        <BreadcrumbContext.Provider value={{ dynamicBreadcrumb, setDynamicBreadcrumb }}>
            <main>
                <Header />
                <Outlet />
            </main>
        </BreadcrumbContext.Provider>
    );
};

export default Layout;