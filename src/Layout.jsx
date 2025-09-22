import { Outlet } from "react-router-dom";
import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(){
    return (
        <div className="d-flex flex-column align-items-stretch justify-content-center h-100 w-100">
            <div className="flex-shrink-0">
                <Header></Header>
            </div>
            <div className="flex-grow-1 overflow-auto">
                <Outlet></Outlet>
            </div>
            <div className="flex-shrink-0">
                <Footer></Footer>
            </div>
        </div>
    );
}