import React, {useEffect, useState} from "react";
import './Home.scss';
import { GrFormAdd} from 'react-icons/gr';
import { auth, db, storage } from "../../firebase"
import { signOut } from "firebase/auth";
import Card from '../../components/Card';
import { getDatabase, ref, remove, onValue } from "firebase/database";
import { ref as refST, deleteObject} from "firebase/storage";

import Add from '../add/Add';

export default function Home(props){
    const [warningOpen, setWarningOpen] = useState(false);
    const [data, setData] = useState({});
    const [infoOpen, setInfoOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [username, setUsername] = useState(props.user.displayName)

    const [titleInfo, setTitle] = useState("")
    const [brandInfo, setBrand] = useState("")
    const [collectionInfo, setCollection] = useState("")
    const [collectionNumberInfo, setCollectionNumber] = useState("")
    const [collectionColorInfo, setCollectionColor] = useState("")
    const [seriesNumberInfo, setSeriesNumber] = useState("")
    const [yearInfo, setYear] = useState("")
    const [dateInfo, setDate] = useState("")
    const [ownerInfo, setOwner] = useState("")
    const [imageInfo, setImage] = useState("")

    useEffect(() => {
        const db = getDatabase();
        const starCountRef = ref(db, 'users/'+props.user.uid+'/cars');
        setUsername(props.user.displayName)

        onValue(starCountRef, (snapshot) => {
            setData(snapshot.val())
          });

      },[])

    function addPage(){
        setAddOpen(!addOpen)
    }

    function logoutWarning(){
        setWarningOpen(!warningOpen)
    }

    function infoOpenButton(title="", brand="", collection="", collectionColor="", collectionNumber="", seriesNumber="", year="", date="", owner="", image=""){
        setInfoOpen(!infoOpen)

        setTitle(title)
        setBrand(brand)
        setCollection(collection)
        setCollectionColor(collectionColor)
        setCollectionNumber(collectionNumber)
        setDate(date)
        setOwner(owner)
        setSeriesNumber(seriesNumber)
        setYear(year)
        setImage(image)
    }

    function logout(){
        signOut(auth)
        .then(() =>{
            props.handlePage(1)
        })
    }

    function backInfo(){
        setInfoOpen(!infoOpen)
    }

    function deleteCar()
    {
        remove(ref(db, 'users/' + props.user.uid + "/cars/" + brandInfo + "/" + titleInfo))
        deleteObject(refST(storage, 'users/' + props.user.uid + "/cars/"+ brandInfo + "/" +titleInfo))
        backInfo()
    }

    return(
        <>
        <div className="home-container" id="home-container" style={{overflow: warningOpen ? 'hidden' : 'scroll', display: infoOpen || addOpen ? 'none' : 'block'}}>
            <div className="logout-background" id="warning" style={{display: warningOpen ? 'flex' : 'none'}}>
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
                <h2>{username}</h2>
                <button className="add-btn" onClick={addPage}>
                    <GrFormAdd size="3rem"/>
                </button>
            </header>
            <section className="container">
                {
                    Object.keys(data ? data : []).map((brand)=>{
                        return(
                            <div key={brand}>
                                <h3 className="title">{brand}</h3>
                                <hr/>

                                <div className="cards-container">
                                    {
                                        Object.values(data[brand] ? data[brand] : []).map((car)=>{
                                            
                                            return(
                                                < Card key={props.user.uid+car.title} infoOpen={infoOpenButton} userId={props.user.uid} title={car.title} collection={car.collection} collectionColor={car.collectionColor} collectionNumber={car.collectionNumber} seriesNumber={car.seriesNumber} owner={car.owner} year={car.year} date={car.date}  color={car.collectionColor} image={car.title} brand={car.brand}/>
                                            )
                                        })
                                    }
                                </div>    
                            </div>
                        )
                    })
                },{
                    <h2 style={{display: data ? "none" : "block", color: "grey", textAlign: "center", fontSize: "28px", paddingRight: "20px"}}>To add your first car, tap the "+" button</h2>
                }
            </section>
        </div>
        <div className="info-container" style={{display: infoOpen ? 'block' : 'none'}}>
            <button className="back-button" onClick={backInfo}>{"< Back"}</button>
            <center>
                <div className="image-title-container">
                    <div className="image-container">
                        <div className="image" style={{backgroundImage: "url("+imageInfo+")"}}></div>
                    </div>
                        <h1 className="titleInfo">{titleInfo}</h1>
                        <h1 className="collectionInfo" style={{backgroundColor: collectionColorInfo}}>{collectionInfo}</h1>
                </div>

                <div className="details-container">
                    <div className="input-container">
                        <label>Brand</label>
                        <input disabled placeholder={brandInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Year</label>
                        <input disabled placeholder={yearInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Collection number</label>
                        <input disabled placeholder={collectionNumberInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Series number</label>
                        <input disabled placeholder={seriesNumberInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Date</label>
                        <input disabled placeholder={dateInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Owner</label>
                        <input disabled placeholder={ownerInfo}/>
                    </div>
                </div>
                <button className="delete-btn" onClick={deleteCar}>Delete Car</button>
            </center>
        </div>
        <Add display={addOpen} back={addPage} userId={props.user.uid} handlePage={props.handlePage}/>
        </>
    )
}
