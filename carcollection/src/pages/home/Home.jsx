import React, {useState} from "react";
import './Home.scss';
import { GrFormAdd} from 'react-icons/gr';
import { auth } from "../../firebase"
import { signOut } from "firebase/auth";
import Card from '../../components/Card';

export default function Home(props){
    const [warningOpen, setWarningOpen] = useState(true)

    function addPage(){
        props.handlePage(3);
    }

    function logoutWarning(){
        const warning = document.getElementById("warning");
        const allPage = document.getElementById("home-container");

        setWarningOpen(!warningOpen)

        if(warningOpen){
            warning.style = "display: flex"
            allPage.style = "overflow: hidden"
        }
        else{
            warning.style = "display: none"
            allPage.style = "overflow: scroll"
        }
    }

    function logout(){
        signOut(auth)
        .then(() =>{
            props.handlePage(0)
        })
    }

    return(
        <div className="home-container" id="home-container">
            <div className="logout-background" id="warning">
                <div className="logout-warning">
                    <h2>Do you want to logout?</h2>
                    <div className="buttons-container">
                        <button onClick={logout}>YES</button>
                        <button onClick={logoutWarning}>NO</button>
                    </div>
                </div>
            </div>
            
            <header>
                <button onClick={logoutWarning} className="logout-btn">Logout</button>
                <h2>Hot Collection</h2>
                <button className="add-btn" onClick={addPage}>
                    <GrFormAdd size="3rem"/>
                </button>
            </header>
            <section>
                <h3 className="title">Toyota</h3>
                <hr/>

                <div className="cards-container">
                    <Card title={"Toyota Supra"} collection={"HW Speed Graphic"} color={"green"} image={"https://static.wikia.nocookie.net/hotwheels/images/4/43/GTB76.jpg"}/>
                </div>
                
            </section>
        </div>
    )
}