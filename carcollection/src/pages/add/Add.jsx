import React from "react";
import './Add.scss';

export default function Component(){
    const back = "< Back"

    return(
        <div className="add-container">
            <button className="back-button">{back}</button>
            <input id={"title"} placeholder={"Title"}/>
            <div className="image-container">
                <div className="image">
                    <div className="upload-btn">Upload image<input type={"file"} accept={"image/png, image/jpeg"} multiple={false}/></div>
                </div>
            </div>
            <div className="inputs-container">
                <div className="input-container">
                    <label>Brand</label>
                    <input id={"brand"} placeholder={""}/>
                </div>
                <div className="input-container-row">
                    <div className="column1">
                        <label>Collection</label>
                        <input id={"collection"} placeholder={""}/>
                    </div>
                    <div className="column2">
                        <input id={"collectionColor"} placeholder={""} type={"color"}/>
                    </div>
                </div>
                <div className="input-container-row">
                    <div className="column3">
                        <label>Collection number</label>
                        <input id={"collectionNumber"} placeholder={""}/>
                    </div>
                    <div className="column4">
                        <label>Year</label>
                        <input id={"year"} placeholder={""} type={"number"}/>
                    </div>
                </div>
                <div className="input-container">
                    <label>Series number</label>
                    <input id={"series"} placeholder={""}/>
                </div>
                <div className="input-container">
                    <label>Purchase date</label>
                    <input id={"date"} type={"date"}/>
                </div>
                <button className="add-btn">ADD CAR</button>
            </div>
            
        </div>
    )
}