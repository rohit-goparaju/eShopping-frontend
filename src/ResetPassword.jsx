import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useState } from 'react';
import backend from './backend';
import { useUserContext } from './App';

export default function ResetPassword(){
    const [showResetPassword, setShowResetPassword] = useState(true);
    const location = useLocation();
    const username = location?.state;
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({});
    const [confirmFail, setConfirmFail] = useState(false);
    const [changeFail, setChangeFail] = useState(false);
    const {user, setUser} = useUserContext();

    function handleChange(event){
        const {name, value} = event.target;
        setPasswords(prev=>({...prev, [name] : value}));
    }

    if(!username){
        navigate("/logout", {replace:true});
    }

    function cleanup(){
        setPasswords({});
        setConfirmFail(false);
        setChangeFail(false);
        navigate("/logout", {replace:true});
    }

    const resetPassword = async ()=>{
        try{    
            const response = await backend.put("/forgotPassword/resetPassword",{
                username : username,
                newPassword : passwords.newPassword
            });

            if(response?.data){
                setChangeFail(false);
                localStorage.setItem("jwt", response?.data?.jwt);
                localStorage.setItem("user", response?.data?.username);
                setUser(response?.data?.username);
                navigate("/", {replace:true});
                window.location.reload();
                // console.log(response?.data);
            }else{
                setChangeFail(true);
            }
        }catch(error){
            setChangeFail(true);
            console.error("reset password error: ", error);
        }
    };

    function handleSubmit(event){
        event.preventDefault();
        if(passwords.newPassword !== passwords.confirmPassword){
            setConfirmFail(true);
        }else{
            setConfirmFail(false);
            resetPassword();
        }
        console.log(passwords);
    }

    return (
        <Modal showModal={showResetPassword} setShowModal={setShowResetPassword} cleanUp={cleanup}>
            <b>{username}</b> reset password: 
            <hr></hr>
            <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
                <label className="form-label">
                        Enter new password:
                        <input className='form-control' type='password' name='newPassword' value={passwords.newPassword || ""} placeholder='enter new password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                    </label>
                    <label className="form-label">
                        Confirm new password:
                        <input className='form-control' type='password' name='confirmPassword' value={passwords.confirmPassword || ""} placeholder='confirm new password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                    </label>
                    {confirmFail && <span className="text-danger">Passwords do not match.</span>}
                    {changeFail && <span className="text-danger">Failed to reset password, contact support.</span>}
                    <input className="btn btn-outline-dark" type="submit" value={"Reset Password"}></input>
            </form>
        </Modal>
    );
}