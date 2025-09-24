import { useEffect, useState } from 'react';
import backend from './backend'
import { useUserContext } from './App';
import Modal from './Modal';

export default function Login({showLogin, setShowLogin}){

    const [credentials, setCredentials] = useState({});
    const [invalidCreds, setInvalidCreds] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [usernameMessage, setUsernameMessage] = useState("");
    const {user, setUser} = useUserContext();
    const [register, setRegister] = useState(false);
    const [registerPwdMissmatch, setRegisterPwdMissmatch] = useState(false);
    const [addFailed, setAddFailed] = useState(false);

    const login = async ()=>{
        try{
            const response = await backend.post(
                "/login",
                {
                    username : credentials.username,
                    password : credentials.password
                }
            );
            if(response?.data){
                // console.log(response.data);
                // setInvalidCreds(false);
                // setPasswordMessage("");
                // setUsernameMessage("");

                warningCleanup();

                localStorage.setItem("jwt", response?.data?.jwt);
                localStorage.setItem("user", response?.data?.username);

                setUser(response?.data?.username);

                handleClose();
            }else{
                setInvalidCreds(true);
            }
        }catch(error){
            setInvalidCreds(true);
            const usernameErr = error?.response?.data?.username;
            const passwordErr = error?.response?.data?.password;

            if(usernameErr)
                setUsernameMessage(usernameErr);
            if(passwordErr)
                setPasswordMessage(passwordErr);
            console.error("Login error: ",error);
        }
    }

    const addUser = async ()=>{
        try{
            const response = await backend.post("/addUser", {
                username: credentials.username,
                password : credentials.password,
                securityQuestion : credentials.securityQuestion,
                securityAnswer : credentials.securityAnswer
            });
            if(response?.data){
                // console.log(response.data);
                warningCleanup();
                localStorage.setItem("jwt", response?.data?.jwt);
                localStorage.setItem("user", response?.data?.username);

                setUser(response?.data?.username);

                handleClose();
            }else{
                setAddFailed(true);
            }
        }catch(error){
            setAddFailed(true);
            console.error("Add user error: ", error);
        }
    }

    function handleChange(event){
        const {name, value} = event.target;
        setCredentials(prev=>({...prev, [name] : value}));
    }

    function handleRegister(event){
        if(register){
            if(credentials.password === credentials.confirmPassword)
            {
                warningCleanup();
                addUser();
            }
            else
                setRegisterPwdMissmatch(true);
        }else{
            setRegister(true);
            warningCleanup();
        }
    }

    function warningCleanup(){
        setCredentials({});
        setInvalidCreds(false);
        setPasswordMessage("");
        setUsernameMessage("");
        setRegisterPwdMissmatch(false);
        setAddFailed(false);
    }

    function handleClose(){
        warningCleanup();
        setShowLogin(false);
        setRegister(false);
    }

    function handleSubmit(event){
        event.preventDefault();
        // console.log(credentials);
        login();
    }

    return (
        <Modal showModal={showLogin} setShowModal={setShowLogin} cleanUp={handleClose}>
            <form className='d-flex flex-column gap-3' onSubmit={handleSubmit}>
                <label className='form-label'>
                    username:
                    <input className='form-control' type='text' name='username' value={credentials.username || ""} placeholder='enter username' onChange={handleChange} pattern="^[a-z][a-z0-9]{1,9}(?:@eShopping\.in)$" title="username must start with an alphabet, can contain only lowercase and numbers, length of the prefix must be between 2 to 10 inclusive, must end with @eShopping.in" required></input>
                </label>
                {usernameMessage && <span className='text-danger'>{usernameMessage}</span>}
                <label className='form-label'>
                    password:
                    <input className='form-control' type='password' name='password' value={credentials.password || ""} placeholder='enter password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                </label>
                {passwordMessage && <span className='text-danger'>{passwordMessage}</span>}
                {invalidCreds && <span className='text-danger'>Invalid credentials</span>}
                {
                    register &&
                    <>
                        <label className='form-label'>
                            confirm password:
                           <input className='form-control' type='password' name='confirmPassword' value={credentials.confirmPassword || ""} placeholder='confirm password' onChange={handleChange} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*@)(?=.*\d)[a-zA-Z][a-zA-Z0-9@]{7,}" title="password must be atleast 8 characters long, must contain lowercase, uppercase, @ and digits" required></input>
                        </label>
                        <label className='form-label'>
                            security question:
                            <input className='form-control' type='text' name='securityQuestion' value={credentials.securityQuestion || ""} placeholder='enter security question' onChange={handleChange} required></input>
                        </label>
                        <label className='form-label'>
                            security answer:
                            <input className='form-control' type='text' name='securityAnswer' value={credentials.securityAnswer || ""} placeholder='answer security question' onChange={handleChange} required></input>
                        </label>
                    </>
                }
                {registerPwdMissmatch && <span className='text-danger'>Password missmatch</span>}
                {addFailed && <span className='text-danger'>Failed to create user, contact support if user does not already exist.</span>}
                <div className='d-flex gap-2'>
                    {!register && <input className='btn btn-outline-dark flex-grow-1' type='submit' value={"Login"}></input>}
                    <input className='btn btn-outline-dark flex-grow-1' type="button" value={"Register"} onClick={handleRegister}></input>
                </div>
                {!register && <a href='/eShopping/forgotPassword'>Forgot password?</a>}
            </form>
        </Modal>
    );
}