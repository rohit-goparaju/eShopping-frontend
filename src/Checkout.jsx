import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./App";
import backend from "./backend";

export default function Checkokut({cartValue, checkout}){
    const navigate = useNavigate();
    
    if(!checkout || !cartValue)
    {
        // navigate("/", {replace:true});
        return null;
    }
    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{position: "fixed", top: 0, bottom : 0, left: 0, right: 0, zIndex : 999, backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)"}}>
            <div className="rounded text-bg-success m-5 p-5">
                <h1>Pay <i className="bi bi-currency-rupee"></i>{cartValue} at delivery.</h1>
                <Link to={"/"} className="btn btn-outline-light"><i className="bi bi-cart-plus"></i>Shop more products</Link>
            </div>
        </div>
    );
}