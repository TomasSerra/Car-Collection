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
    const [newData, setNewData] = useState({});
    const [infoOpen, setInfoOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [username, setUsername] = useState(props.user.displayName)
    const [totalCars, setTotalCars] = useState(0)
    const [ownerFilter, setOwnerFilter] = useState("All")
    const [ownersList, setOwnersList] = useState([])
    const [imageZoom, setImageZoom] = useState(false)
    

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
            setNewData(datos)

            var total = 0
            var owners = new Set()
            owners.add("All")
        
            Object.keys(datos ? datos : []).map((brand)=>{
                Object.values(datos[brand] ? datos[brand] : []).map((car)=>{
                    if(car.owner.trim() != ""){
                        owners.add(car.owner)
                    }
                    total += 1
                })
            })
            setTotalCars(total)
            setOwnersList(Array.from(owners))
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

    function filterChange(filterValue)
    {
        var datos = data
        var total = 0
        var newData = {}
        
    
        Object.keys(datos ? datos : []).map((brand)=>{
            newData[brand] = {}
            Object.values(Object.values(data[brand]).filter((car => (car.owner == filterValue) || (filterValue == "All"))) ? Object.values(data[brand]).filter((car => (car.owner == filterValue) || (filterValue == "All"))) : []).map((car)=>{
                total += 1
                Object.assign(newData[brand], {[car.title]:car});
            })
            
        })
        setTotalCars(total)
        setNewData(newData)
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

    function infoImageZoom(){
        setImageZoom(!imageZoom)
    }

    return(
        <>
        <div className="home-container" id="home-container" style={{display: infoOpen || addOpen ? 'none' : 'block'}}>
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
            <div className="subHeader">
                <h2 className="totalCars">Total cars: {totalCars}</h2>
                <div className="filterContainer">
                    <label>Owner</label>
                    <select className="ownerFilter" value={ownerFilter} onChange={(e)=>{setOwnerFilter(e.target.value); filterChange(e.target.value)}}>
                        {
                        ownersList.map((owner) => {
                            return <option key={ownersList.indexOf(owner)} value={owner}>{owner}</option>
                        })
                        }
                    </select>
                </div>
                
            </div>
            
            <section className="container">
                {
                    Object.keys(newData ? newData : []).map((brand)=>{
                        if(Object.values(newData[brand]).length === 0){
                            return;
                        }
                        return(
                            <div key={brand} id={brand}>
                                <h3 className="title">{brand}</h3>
                                <hr/>

                                <div className="cards-container" id={brand+'Container'}>
                                    {
                                        Object.values(Object.values(newData[brand]).filter((car => (car.owner == ownerFilter) || (ownerFilter == "All"))) ? Object.values(newData[brand]).filter((car => (car.owner == ownerFilter) || (ownerFilter == "All"))) : []).map((car)=>{
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
                <div className="imageZoom" style={{display: imageZoom ? "flex" : "none"}}>
                    <button className="back-button" onClick={infoImageZoom}>{"< Back"}</button>
                    <img src={imageInfo}></img>
                </div>
                <div className="image-title-container">
                    <button className="image-container" onClick={infoImageZoom}>
                        <div className="image" style={{backgroundImage: 'url("'+imageInfo+'")'}}></div>
                    </button>
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
