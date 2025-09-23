import { useEffect } from "react";
import { useUserContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const {user} = useUserContext();
    const navigate = useNavigate();

    useEffect(
        ()=>{
            localStorage.clear();
            navigate("/", {replace: true});
            window.location.reload();
        },
        [navigate, user]
    );

    return null;
}