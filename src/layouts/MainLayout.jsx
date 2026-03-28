import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Outlet } from "react-router-dom";

const MainLayout=()=>{
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