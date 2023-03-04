import React, {useEffect, useState} from "react";
import './Card.scss';
import {ref, getDownloadURL } from "firebase/storage";
import {storage} from "../firebase"

export default function Card(props){
    const [image, setImage] = useState("")

    useEffect(() => {
        getDownloadURL(ref(storage, 'users/' + props.userId + '/cars/' +props.brand+"/"+ props.image))
        .then((url) => {
            setImage(url)
        })
        .catch((error) => {
            // Handle any errors
        });
        
    },[])
    
    return(
        <button className="card" onClick={()=>{
                props.infoOpen(props.title, props.brand, props.collection, props.collectionColor, props.collectionNumber, props.seriesNumber, props.year, props.date, props.owner, image)
            }
        }>
            <center>
                <div id="image" className="image" style={{backgroundImage: "url("+image+")"}}></div>
                <h2>{props.title}</h2>
                <p style={{backgroundColor: props.color}}>{props.collection}</p>
            </center>
        </button>
    )
}