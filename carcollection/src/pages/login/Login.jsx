import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import React, {useState} from "react";
import './Login.scss';
import { auth } from "../../firebase"

export default function Login(props){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [warning, setWarning] = useState('');
    const [timeoutKey, setTimeoutKey] = useState();

    function login(){
        const warningText = document.getElementById("warning")
        if(timeoutKey != null){
            clearTimeout(timeoutKey);
        }

        if( email != "" && password != ""){
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                props.handlePage(2)
            })
            .catch((error) =>{
                setWarning(extractError(error))
                warningText.style = "color: #4d0101"
            })

            setTimeoutKey(setTimeout(clearWarning, 4000))
        }
        else{
            setWarning("Please complete all required fields")
            warningText.style = "color: #4d0101"
            setTimeoutKey(setTimeout(clearWarning, 4000))
        }
    }

    function forget()
    {
        const warningText = document.getElementById("warning")
        if(timeoutKey != null){
            clearTimeout(timeoutKey);
        }

        sendPasswordResetEmail(auth, email)
        .then(()=>{
            setWarning("Email send")
            warningText.style = "color: green"
        })
        .catch((error) =>{
            setWarning(extractError(error))
            warningText.style = "color: #4d0101"
        })

        setTimeoutKey(setTimeout(clearWarning, 4000))
    }

    function clearWarning(){
        setWarning("")
    }

    function extractError(error){
        const errorArr = error.code.slice(5).split("-")
        var err = ""
        errorArr.forEach(word => err += word + " ")
        err = err.toUpperCase()
        return err
    }

    return(
        <div className="login-container">
            <h2>Login</h2>
            <div className="input-container">
                <input type="text" required="required" onChange={(e) => setEmail(e.target.value)}/>
                <label>Email</label>
            </div>
            <div className="input-container">
                <input type="password" required="required" onChange={(e) => setPassword(e.target.value)}/>
                <label>Password</label>
            </div>
            <button className="forget-password" onClick={forget}>Forget password?</button>
            <div className="button-container">
                <button className="login-btn" onClick={login}>Login</button>
                <h3 id="warning">{warning}</h3>
            </div>
            <button className="create-account" onClick={()=>{props.handlePage(1)}}>CREATE ACCOUNT</button>

        </div>
    )
}