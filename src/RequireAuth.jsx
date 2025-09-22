import { useEffect } from "react";
import { useUserContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function RequireAuth({children}){
    const {user} = useUserContext();
    const navigate = useNavigate();

    useEffect(
        ()=>{   
            if(!user && !localStorage.getItem("user") && !localStorage.getItem("jwt")){
                navigate("/logout");
            }
        },
        [user, navigate]
    );

    if(user){
        return children;
    }else{
        return null;
    }

}