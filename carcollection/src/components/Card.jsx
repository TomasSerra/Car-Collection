import React, {useEffect, useState} from "react";
import './Card.scss';

export default function Card(props){
    const [title, setTitle] = useState("")
    const [collection, setCollection] = useState("")
    const [image, setImage] = useState("")
    const [color, setColor] = useState("")

    useEffect(() => {
        setTitle(props.title)
        setCollection(props.collection)
        setImage(props.image)
        setColor(props.color)
      },[])
    
    return(
        <div className="card">
            <center>
                <div id="image" className="image" style={{backgroundImage: "url("+image+")"}}></div>
                <h2>{title}</h2>
                <p style={{backgroundColor: color}}>{collection}</p>
            </center>
        </div>
    )
}