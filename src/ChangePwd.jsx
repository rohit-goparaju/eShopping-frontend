import { useState } from "react";
import Modal from "./Modal";
import backend from "./backend";
import { useUserContext } from "./App";
import { useNavigate } from "react-router-dom";

export default function ChangePwd({showChangePwd, setShowChangePwd}){
    const [passwords, setPasswords] = useState({});
    const [confirmFail, setConfirmFail] = useState(false);
    const [changeFail, setChangeFail] = useState(false);
    const {user} = useUserContext();
    const navigate = useNavigate();

    const changePassword = async ()=>{
        try{
            const response = await backend.post("/changePassword", {
                username : user,
                oldPassword : passwords.oldPassword,
                newPassword : passwords.newPassword
            });

            if(response?.data){
                console.log(response?.data);
                cleanup();
                setShowChangePwd(false);
                navigate("/logout", {replace:true});
            }else{
                setChangeFail(true);
            }

        }catch(error){
            setChangeFail(true);
            console.error("Change password error: ", error);
        }
    };

    function handleChange(event){
        const {name, value} = event.target;
        setPasswords(prev=>({...prev, [name] : value}));
    }

    function handleSubmit(event){
        event.preventDefault();
        if(passwords.newPassword !== passwords.confirmPassword){
            setConfirmFail(true);
        }else{
            setConfirmFail(false);
            changePassword();
        }
    }

    function cleanup(){
        setPasswords({});
        setConfirmFail(false);
        setChangeFail(false);
    }

    return (
        <Modal showModal={showChangePwd} setShowModal={setShowChangePwd} cleanUp={cleanup}>
            <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
                    <label className="form-label">
                        Enter current password:
                        <input className='form-control' type='password' name='oldPassword' value={passwords.oldPassword || ""} placeholder='enter current password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                    </label>
                    <label className="form-label">
                        Enter new password:
                        <input className='form-control' type='password' name='newPassword' value={passwords.newPassword || ""} placeholder='enter new password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                    </label>
                    <label className="form-label">
                        Confirm new password:
                        <input className='form-control' type='password' name='confirmPassword' value={passwords.confirmPassword || ""} placeholder='confirm new password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                    </label>
                    {confirmFail && <span className="text-danger">Passwords do not match.</span>}
                    {changeFail && <span className="text-danger">Failed to change password, make sure the current password is correct.</span>}
                    <input className="btn btn-primary" type="submit" value={"Change Password"}></input>
                </form>
        </Modal>
    );
}