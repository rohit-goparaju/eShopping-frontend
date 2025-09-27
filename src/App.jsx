import { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Layout from './Layout'
import Logout from './Logout';
import ForgotPwd from './ForgotPwd';
import SecurityQuestion from './SecurityQuestion';
import ResetPassword from './ResetPassword';
import RequireAuth from './RequireAuth';
import MyListings from './MyListings';
import Cart from './Cart';

const UserContext = createContext();

export function useUserContext(){
  return useContext(UserContext);
}

function App() {
  const [user, setUser] = useState(null);
  
  function updateFromLocalStorage(){
    const userStr = localStorage.getItem("user");
      if(userStr)
      {
        setUser(userStr);
      }    
  }

  useEffect(
    ()=>{
      updateFromLocalStorage();
      window.addEventListener("storage", updateFromLocalStorage);
      return ()=>window.removeEventListener("storage", updateFromLocalStorage);
    },
    []
  );

  return (
    <UserContext.Provider value={{user, setUser}}> 
    <Routes>
      <Route path='/' element={<Layout></Layout>}>
        <Route index element={<Home></Home>}></Route>
        <Route path='/logout' element={<Logout></Logout>}></Route>
        <Route path='/forgotPassword' element={<ForgotPwd></ForgotPwd>}></Route>
        <Route path= '/securityQuestion' element={<SecurityQuestion></SecurityQuestion>}></Route>
        <Route path='/resetPassword' element={<ResetPassword></ResetPassword>}></Route>
        <Route path='/myListings' element={<RequireAuth><MyListings></MyListings></RequireAuth>} ></Route>
        <Route path='/cart' element={<RequireAuth><Cart></Cart></RequireAuth>}></Route>

        <Route path="*" element={<Logout></Logout>}></Route>
      </Route>
    </Routes>
    </UserContext.Provider>
  )
}

export default App
