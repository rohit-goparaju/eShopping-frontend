import { useState } from "react";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import backend from "./backend";

export default function ForgotPwd(){
    const [showUsernamePrompt, setShowUsernamePrompt] = useState(true);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [noUser, setNoUser] = useState(false);
    const [securityDetails, setSecurityDetails] = useState({});

    const getSecurityDetails = async ()=>{
        try{    
            const response = await backend.post("/forgotPassword/getSecurityDetails",{
                username : username
            });

            if(response?.data){
                setNoUser(false);
                setSecurityDetails(response.data);
                navigate("/securityQuestion", {replace : true, state : {...response.data, username : username}});
                window.location.reload();
                console.log(response.data);
            }else{
                setNoUser(true);
            }

        }catch(error){
            setNoUser(true);
            console.error("forgot password error: ", error);
        }
    };

    function cleanup(){
        setNoUser(false);
        setSecurityDetails({});
        navigate("/" , {replace: true});
    }

    function handleChange(event){
        setUsername(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        getSecurityDetails();
    }

    return (
        <Modal showModal={showUsernamePrompt} setShowModal={setShowUsernamePrompt} cleanUp={cleanup}>
            <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
                <label className='form-label'>
                    username:
                    <input className='form-control' type='text' name='username' value={username || ""} placeholder='enter username' onChange={handleChange} pattern="^[a-z][a-z0-9]{1,9}(?:@eShopping\.in)$" title="username must start with an alphabet, can contain only lowercase and numbers, length of the prefix must be between 2 to 10 inclusive, must end with @eShopping.in" required></input>
                </label>
                {noUser && <span className="text-danger">User does not exist.</span>}
                <input className="btn btn-primary" type="submit"></input>
            </form>
        </Modal>
    );
}