import React, { useEffect, useState } from 'react';
import {setPersistence, browserLocalPersistence, onAuthStateChanged} from 'firebase/auth';
import './App.scss';
import { auth } from "./firebase"

import Home from './pages/home/Home';
import Add from './pages/add/Add';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import SplashScreen from './pages/splashscreen/SplashScreen'

function App() {
  const [userObject, setUser] = useState();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    onAuthStateChanged(auth, (user) => {
      if(user && page===0){
        setUser(user)
        handlePage(3)
      }
      else{
        handlePage(1)
      }
    })
  },[])

  function handlePage(num)
  {
    setPage(num)

    if(num===1 || num===2){
      document.documentElement.style.overflow = "hidden"
    }
    else if(num===3){
      document.documentElement.style.overflowX = "hidden"
      document.documentElement.style.overflowY = "scroll"
    }

  }

  return (
    <>
      {page===0 && <SplashScreen/>}
      {page===1 && <Login handlePage={handlePage}/>}
      {page===2 && <Register handlePage={handlePage}/>}
      {page===3 && <Home handlePage={handlePage} user={userObject}/>}
      {page===4 && <Add handlePage={handlePage} user={userObject}/>}
    </>
    
  );
}

export default App;
