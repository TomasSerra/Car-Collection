import React, { useState } from 'react';
import {setPersistence, browserLocalPersistence, onAuthStateChanged} from 'firebase/auth';
import './App.scss';
import { auth } from "./firebase"

import Home from './pages/home/Home';
import Add from './pages/add/Add';
import Login from './pages/login/Login'
import Register from './pages/register/Register'

function App() {
  const [userObject, setUser] = useState();

  setPersistence(auth, browserLocalPersistence)
  onAuthStateChanged(auth, (user) => {
    if(user){
      setUser(user)
    }
  })

  return (
    <Login/>
  );
}

export default App;
