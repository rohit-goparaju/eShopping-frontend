import { useState } from 'react';
import logo from './assets/shopping-cart-svgrepo-com.svg'
import Login from "./Login";
import { Link, NavLink } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import { useUserContext } from './App';
import ChangePwd from './ChangePwd';

export default function Header(){

    const [showLogin, setShowLogin] = useState(false);
    const [showChangePwd, setShowChangePwd] = useState(false);
    const {user} = useUserContext();

    function handleLoginToggle(event){
        setShowLogin(true);
    }

    function handleChangePwdToggle(event){
        setShowChangePwd(true);
    }

    return (
        <>
        
        <nav className="navbar navbar-dark bg-primary p-2">
            <a className="ms-2 navbar-brand" href="/">
                <img src={logo} alt='logo' width={"50px"} height={"50px"}></img>
                <span className='frederickaFont fs-2'>eShopping</span>
            </a>
            <div className='ms-auto me-3 d-flex justify-content-center align-items-center gap-3'>
                <form className='d-flex gap-2 ms-auto'>
                    <input className='form-control' type='text' placeholder='Search' size={"50"}></input>
                    <input className='btn btn-outline-light' type='submit' value={"search"}></input>
                </form>
                <div className='dropdown text-light'>
                    <a className= {`nav-link dropdown-toggle noCaret hoverFadeWhite`} role='button' href='#' data-bs-toggle="dropdown" aria-expanded="false">
                        <div className='d-flex justify-content-center align-items-center gap-2'>
                            <i className='bi bi-person-circle fs-2'></i> <span className='fs-5'>{user}</span>
                        </div>
                    </a>
                    <ul className='dropdown-menu dropdown-menu-end'>
                        {
                            !user && 
                            <>
                                <li>
                                    <a className='dropdown-item' href='#' onClick={handleLoginToggle}><i className='bi bi-box-arrow-in-right'></i> Login</a>
                                </li>
                            </>
                        }
                        <li>
                            <a className='dropdown-item' href='#'><i className='bi bi-cart-check'></i> Cart</a>
                        </li>
                        {
                            user && 
                            <>  
                                <li>
                                    <a className='dropdown-item' href='#' onClick={handleChangePwdToggle}><i className='bi bi-key'></i> Change password</a>
                                </li>  
                                <li>
                                    <a href='/eShopping/logout' className='dropdown-item'><i className='bi bi-box-arrow-right'></i> Logout</a>
                                </li>
                            </>    
                        }
                    </ul>
                </div>
            </div>
        </nav>
         <Login showLogin={showLogin} setShowLogin={setShowLogin}></Login>
         <ChangePwd showChangePwd={showChangePwd} setShowChangePwd={setShowChangePwd}></ChangePwd>
        </>
    );
}