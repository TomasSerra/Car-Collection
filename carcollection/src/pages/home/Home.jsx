import React, {useEffect, useState} from "react";
import './Home.scss';
import { GrFormAdd} from 'react-icons/gr';
import { auth, db, storage } from "../../firebase"
import { signOut } from "firebase/auth";
import Card from '../../components/Card';
import { getDatabase, ref, remove, onValue, set } from "firebase/database";
import { ref as refST, deleteObject} from "firebase/storage";

import Add from '../add/Add';

export default function Home(props){
    const [warningOpen, setWarningOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [infoEdit, setInfoEdit] = useState(false);
    const [data, setData] = useState({});
    const [infoOpen, setInfoOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [username, setUsername] = useState(props.user.displayName)
    const [totalCars, setTotalCars] = useState(0)

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

    const [collectionNumberNew, setCollectionNumberNew] = useState("")
    const [seriesNumberNew, setSeriesNumberNew] = useState("")
    const [yearNew, setYearNew] = useState("")
    const [dateNew, setDateNew] = useState("")
    const [ownerNew, setOwnerNew] = useState("")

    useEffect(() => {
        const db = getDatabase();
        const starCountRef = ref(db, 'users/'+props.user.uid+'/cars');
        setUsername(props.user.displayName)

        

        onValue(starCountRef, (snapshot) => {
            var datos = snapshot.val()
            setData(datos)

            var total = 0
        
            Object.keys(datos ? datos : []).map((brand)=>{
                Object.values(datos[brand] ? datos[brand] : []).map((car)=>{
                    total += 1
                })
            })
            setTotalCars(total)
            
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
        setInfoEdit(false)
    }

    function deleteCar()
    {
        remove(ref(db, 'users/' + props.user.uid + "/cars/" + brandInfo + "/" + titleInfo))
        deleteObject(refST(storage, 'users/' + props.user.uid + "/cars/"+ brandInfo + "/" +titleInfo))
        setDeleteOpen(false)
        backInfo()
    }

    function editButton()
    {
        const save = document.getElementById("saveEdit")

        if(infoEdit){ //Save
            if(navigator.onLine){
                save.disabled = true
                set(ref(db, 'users/' + props.user.uid + '/cars/' + brandInfo + '/' + titleInfo), {
                    title: titleInfo,
                    brand: brandInfo,
                    collection: collectionInfo,
                    collectionColor: collectionColorInfo,
                    collectionNumber: collectionNumberNew,
                    year: yearNew,
                    seriesNumber: seriesNumberNew,
                    date: dateNew,
                    owner: ownerNew,
                    image: titleInfo
                })
                .then(()=>{
                    save.disabled = false
                    setInfoEdit(!infoEdit)
                })
                .catch((error)=>{
                    save.disabled = false
                })            
            }
        }
        else{ //Edit
            setInfoEdit(!infoEdit)
            setCollectionNumberNew(collectionNumberInfo)
            setSeriesNumberNew(seriesNumberInfo)
            setDateNew(dateInfo)
            setYearNew(yearInfo)
            setOwnerNew(ownerInfo)
        }

        
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
            <h2 className="totalCars">Total cars: {totalCars}</h2>
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
        <div className="delete-background" style={{display: deleteOpen ? 'flex' : 'none'}}>
                <div className="delete-warning">
                    <h2>Do you want to delete?</h2>
                    <div className="buttons-container">
                        <button onClick={deleteCar}>YES</button>
                        <button onClick={()=>{setDeleteOpen(false)}}>NO</button>
                    </div>
                </div>
            </div>
        <div className="info-container" style={{display: infoOpen ? 'block' : 'none'}}>
            <div className="buttons-container">
                <button className="back-button" onClick={backInfo}>{"< Back"}</button>
                <button className="edit-button" id="saveEdit" onClick={editButton}>{ infoEdit ? "Save" : "Edit"}</button>
            </div>
            <center>
                <div className="image-title-container">
                    <div className="image-container">
                        <div className="image" style={{backgroundImage: 'url("'+imageInfo+'")'}}></div>
                    </div>
                        <h1 className="titleInfo">{titleInfo}</h1>
                        <h1 className="collectionInfo" style={{backgroundColor: collectionColorInfo}}>{collectionInfo}</h1>
                </div>

                <div className="details-container">
                    <div className="input-container">
                        <label>Brand</label>
                        <input disabled defaultValue={brandInfo}/>
                    </div>
                    <div className="input-container">
                        <label>Year</label>
                        <input disabled={!infoEdit} defaultValue={yearInfo} type="number" onChange={(e)=>{setYearNew(e.target.value)}}/>
                    </div>
                    <div className="input-container">
                        <label>Collection number</label>
                        <input disabled={!infoEdit} defaultValue={collectionNumberInfo} onChange={(e)=>{setCollectionNumberNew(e.target.value)}}/>
                    </div>
                    <div className="input-container">
                        <label>Series number</label>
                        <input disabled={!infoEdit} defaultValue={seriesNumberInfo} onChange={(e)=>{setSeriesNumberNew(e.target.value)}}/>
                    </div>
                    <div className="input-container">
                        <label>Date</label>
                        <input disabled={!infoEdit} defaultValue={dateInfo} onChange={(e)=>{setDateNew(e.target.value)}} placeholder={infoEdit ? "yyyy-mm-dd" : ""}/>
                    </div>
                    <div className="input-container">
                        <label>Owner</label>
                        <input disabled={!infoEdit} defaultValue={ownerInfo} onChange={(e)=>{setOwnerNew(e.target.value)}}/>
                    </div>
                </div>
                <button className="delete-btn" onClick={()=>{setDeleteOpen(true)}}>Delete Car</button>
            </center>
        </div>
        <Add display={addOpen} back={addPage} userId={props.user.uid} handlePage={props.handlePage}/>
        </>
    )
}
