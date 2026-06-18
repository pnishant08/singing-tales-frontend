import React from "react";
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Outlet, useLocation } from "react-router-dom";

const MainLayout=()=>{
    const { pathname, search } = useLocation();

    React.useEffect(() => {
        if (!("scrollRestoration" in window.history)) return undefined;

        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";

        return () => {
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    React.useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [pathname, search]);

    return(
        <>
        <Header />
        <main className="main-content">
            <Outlet/>
        </main>
        <Footer />
        </>
    )
}

export default MainLayout;
