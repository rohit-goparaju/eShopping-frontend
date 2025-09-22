import { createContext, useContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Layout from './Layout'
import Logout from './Logout';

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
      </Route>
    </Routes>
    </UserContext.Provider>
  )
}

export default App
