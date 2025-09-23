import { useState } from "react";
import Modal from "./Modal";
import { useLocation, useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

export default function SecurityQuestion(){
    
    const location = useLocation();
    const [showSecurityQuestion, setShowSecurityQuestion] = useState(true);
    const securityDetails = location.state;
    const navigate = useNavigate();
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [wrongAnswer, setWrongAnswer] = useState(false);
    
    function cleanup(){
        location.state = null;
        setWrongAnswer(false);
    }

    function handleSubmit(event){
        event.preventDefault();
        if(securityDetails?.securityAnswer == securityAnswer.trim().toLowerCase())
        {
            navigate("/resetPassword", {replace:true, state: securityDetails?.username});
            setWrongAnswer(false);
            setShowSecurityQuestion(false);
        }
        else
            setWrongAnswer(true);
    }

    function handleChange(event){
        setSecurityAnswer(event.target.value);
    }


    if(!securityDetails || !securityDetails?.securityQuestion || !securityDetails?.username || !securityDetails?.securityAnswer){
        cleanup();
        window.location.href="/eShopping/logout";
    }

    return (
        <>
            <Modal showModal={showSecurityQuestion} setShowModal={setShowSecurityQuestion} cleanUp={cleanup}>
                <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
                    <label className="form-label">
                        {securityDetails?.username}
                        <hr></hr>
                        {securityDetails?.securityQuestion}{securityDetails.securityQuestion.endsWith("?") ? "" : "?"}
                        <input className="form-control" type="text" name="securityAnswer" value={securityAnswer || ""} onChange={handleChange} required></input>
                    </label>
                    {wrongAnswer && <span className="text-danger">incorrect answer.</span>}
                    <input className="btn btn-outline-dark" type="submit"></input>
                </form>
            </Modal>
        </>
    );
}