import React from "react";
import './Login.scss';

export default function Component(){

    return(
        <div className="login-container">
            <h2>Hot Collection</h2>
            <div className="input-container">
                <input type={"text"} required={"required"}/>
                <label>Mail</label>
            </div>
            <div className="input-container">
                <input type={"password"} required={"required"}/>
                <label>Password</label>
            </div>
            <button className="forget-password">Forget password?</button>
            <button className="login-btn">Login</button>
            <button className="create-account">CREATE ACCOUNT</button>
        </div>
    )
}