import React, {useState} from "react";
import './Add.scss';

export default function Add(props){

    const [uploadImage, setUploadImage] = useState();

    function back(){
        props.handlePage(2)
    }

    function readImage(){
        const imageInput = document.getElementById("imageInput")
        const image = document.getElementById("image")
        const uploadBtn = document.getElementById("uploadBtn")

        if(imageInput.files && imageInput.files[0]){
            var reader = new FileReader();
            reader.onload = function (e){
                setUploadImage(e.target.result)
                image.style = "background-image: url("+ e.target.result + "); background-size: auto 100%; background-position-y: 0;"
                uploadBtn.style = "opacity: 50%;"
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    }

    return(
        <div className="add-container">
            <button className="back-button" onClick={back}>{"< Back"}</button>
            <input id={"title"} placeholder={"Title"}/>
            <div className="image-container">
                <div className="image" id="image">
                    <div className="upload-btn" id="uploadBtn">Upload image<input type={"file"} accept={"image/png, image/jpeg"} multiple={false} onChange={readImage} id="imageInput"/></div>
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
                <div className="input-container">
                    <label>Owner</label>
                    <input id={"owner"}/>
                </div>
                <button className="add-btn">ADD CAR</button>
            </div>
            
        </div>
    )
}