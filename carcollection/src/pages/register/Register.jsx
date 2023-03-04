import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase"
import React, {useState} from "react";
import './Register.scss';

export default function Register(props){
    const back = "< Back";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [warning, setWarning] = useState('');
    const [timeoutKey, setTimeoutKey] = useState();

    function create(){
        const warningText = document.getElementById("warning")
        if(timeoutKey != null){
            clearTimeout(timeoutKey);
        }
            

        if(email != "" && password != "" && name != ""){
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(userCredential.user, {
                    displayName: name
                });

                setWarning("Account created succesfully!")
                warningText.style = "color: green"
            })
            .catch((error) =>{
                setWarning(extractError(error))
                warningText.style = "color: #cd3131"
            })
            setTimeoutKey(setTimeout(clearWarning, 4000))
        }
        else{
            setWarning("Please complete all required fields")
            warningText.style = "color: #cd3131"
            setTimeoutKey(setTimeout(clearWarning, 4000))
        }

        function clearWarning(){
            setWarning("")
        }
    }

    function extractError(error){
        const errorArr = error.code.slice(5).split("-")
        var err = ""
        errorArr.forEach(word => err += word + " ")
        err = err.toUpperCase()
        return err
    }

    return(
        <div className="register-container">
            <button className="back-button" onClick={()=>{props.handlePage(1)}}>{back}</button>
            <h2>Create account</h2>
            <div className="input-container">
                <input type={"text"} required={"required"} onChange={(e) => setName(e.target.value)}/>
                <label>Name</label>
            </div>
            <div className="input-container">
                <input type={"text"} required={"required"} onChange={(e) => setEmail(e.target.value)}/>
                <label>Mail</label>
            </div>
            <div className="input-container">
                <input type={"text"} required={"required"} onChange={(e) => setPassword(e.target.value)}/>
                <label>Password</label>
            </div>
            <div className="button-container">
                <button className="register-btn" onClick={create}>Create</button>
                <h3 id="warning">{warning}</h3>
            </div>
        </div>
    )
}