import React, { useEffect, useState } from 'react';
import {setPersistence, browserLocalPersistence, onAuthStateChanged} from 'firebase/auth';
import './App.scss';
import { auth } from "./firebase"

import Home from './pages/home/Home';
import Add from './pages/add/Add';
import Login from './pages/login/Login'
import Register from './pages/register/Register'

function App() {
  const [userObject, setUser] = useState();
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    onAuthStateChanged(auth, (user) => {
      if(user && page===0){
        setUser(user)
        handlePage(2)
      }
    })
  },[])

  function handlePage(num)
  {
    setPage(num)
  }

  return (
    <>
      {page===0 && <Login handlePage={handlePage}/>}
      {page===1 && <Register handlePage={handlePage}/>}
      {page===2 && <Home />}
      {page===3 && <Add />}
    </>
    
  );
}

export default App;
