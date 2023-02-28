import React from "react";
import './Home.scss';
import { GrFormAdd, GrMenu } from 'react-icons/gr';
import { IconContext } from "react-icons";
import nissan from "../../img/nissan1.jpeg"

export default function Component(){

    return(
        <div className="home-container">
            <header>
                <GrMenu size="2rem"/>
                <h2>Hot Collection</h2>
                <GrFormAdd size="2.5rem"/>
            </header>
            <section>
                <h3 className="title">Nissan</h3>
                <hr/>

                <div className="cards-container">
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                    <div className="card">
                        <center>
                            <div className="image"></div>
                            <h2>'17 Nissan GT-R (R35)</h2>
                            <p>HW J-Imports</p>
                        </center>
                    </div>
                </div>
                
            </section>
        </div>
    )
}