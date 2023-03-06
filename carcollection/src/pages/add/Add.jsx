import React, {useState} from "react";
import {set, ref as refDB } from "firebase/database";
import {ref, uploadBytes } from "firebase/storage";
import { db, storage} from "../../firebase"
import './Add.scss';
import loadingSpin from "../../img/loading-spin.svg"

export default function Add(props){

    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [warningText, setWarningText] = useState("");
    

    const [uploadImage, setUploadImage] = useState();
    const [brandInput, setBrand] = useState("");
    const [titleInput, setTitle] = useState("");
    const [collectionInput, setCollection] = useState("")
    const [collectionNumberInput, setCollectionNumber] = useState("")
    const [collectionColorInput, setCollectionColor] = useState("#000000")
    const [seriesNumberInput, setSeriesNumber] = useState("")
    const [yearInput, setYear] = useState("")
    const [dateInput, setDate] = useState("")
    const [ownerInput, setOwner] = useState("")
    const [viewImage, setViewImage] = useState("")

    function back(){
        setViewImage("")
        setUploadImage("")
        setBrand("")
        setTitle("")
        setCollection("")
        setCollectionColor("#000000")
        setCollectionNumber("")
        setSeriesNumber("")
        setDate("")
        setOwner("")
        setYear("")
        setWarningText("")
        props.back()
    }

    async function readImage(){
        const imageInput = document.getElementById("imageInput")
        const uploadBtn = document.getElementById("uploadBtn")

        if(imageInput.files && imageInput.files[0]){
            const archivo = imageInput.files[0];

            const blob = await comprimirImagen(archivo, parseInt(20));

            let reader = new FileReader();
            reader.onload = function (e){
                setUploadImage(blob)
                setViewImage(URL.createObjectURL(blob))

                uploadBtn.style = "opacity: 50%;"
            };
            reader.readAsDataURL(imageInput.files[0]);
        }
    }

    function uploadData()
    {
        setButtonDisabled(true)
        if(navigator.onLine){
            if(titleInput.trim() != "" && brandInput.trim() != "" && collectionInput.trim() != "" && uploadImage != null){
                setLoading(true)
                const storageRef = ref(storage, 'users/' + props.userId + '/cars/' + brandInput + '/' + titleInput);
                uploadBytes(storageRef, uploadImage).then(()=>{
                    set(refDB(db, 'users/' + props.userId + '/cars/' + brandInput + '/' + titleInput), {
                        title: titleInput,
                        brand: brandInput,
                        collection: collectionInput,
                        collectionColor: collectionColorInput ,
                        collectionNumber: collectionNumberInput,
                        year: yearInput,
                        seriesNumber: seriesNumberInput,
                        date: dateInput,
                        owner: ownerInput,
                        image: titleInput
                    })
                    .then(()=>{
                        setLoading(false)
                        setButtonDisabled(false)
                        back()
                    })
                    .catch((error)=>{
                        setLoading(false)
                        setButtonDisabled(false)
                        setWarningText(error)
                    })
                }).catch((error)=>{
                    setButtonDisabled(false)
                    setLoading(false)
                    setWarningText(error)
                })            
            }
            else{
                setWarningText("Please complete all required fields")
                setButtonDisabled(false)
            }
        }
        else{
            setWarningText("No internet connection")
            setButtonDisabled(false)
        }
    }

    function comprimirImagen(imagenComoArchivo, porcentajeCalidad){
		return new Promise((resolve, reject) => {
			const $canvas = document.createElement("canvas");
			const imagen = new Image();
			imagen.onload = () => {
				$canvas.width = imagen.width;
				$canvas.height = imagen.height;
				$canvas.getContext("2d").drawImage(imagen, 0, 0);
				$canvas.toBlob(
					(blob) => {
						if (blob === null) {
							return reject(blob);
						} else {
							resolve(blob);
						}
					},
					"image/jpeg",
					porcentajeCalidad / 100
				);
			};
			imagen.src = URL.createObjectURL(imagenComoArchivo);
		});
	};

    return(
        <>
        <div className="loading-container" style={{display: loading ? "flex" : "none"}}>
            <div className="loading-box">
                <h2>Adding car...</h2>
                <img src={loadingSpin}></img>
            </div>
        </div>
        <div className="add-container" style={{display: props.display ? "flex" : "none"}}>
            <button className="back-button" onClick={back} disabled={buttonDisabled}>{"< Back"}</button>
            <input id={"title"} placeholder={"Title *"} onChange={(e)=>{setTitle(e.target.value)}} value={titleInput}/>
            <div className="image-container">
                <div className="image" id="image" style={{backgroundImage: "url("+viewImage+")"}}>
                    <div className="upload-btn" id="uploadBtn">Upload image *<input type={"file"} accept={"image/png, image/jpeg"} multiple={false} onChange={readImage} id="imageInput"/></div>
                </div>
            </div>
            <div className="inputs-container">
                <div className="input-container">
                    <label>Brand *</label>
                    <input id="brand" placeholder="" onChange={(e)=>{setBrand(e.target.value)}} value={brandInput}/>
                </div>
                <div className="input-container-row">
                    <div className="column1">
                        <label>Collection *</label>
                        <input id="collection" placeholder={""} onChange={(e)=>{setCollection(e.target.value)}} value={collectionInput}/>
                    </div>
                    <div className="column2">
                        <input id="collectionColor" placeholder={""} type={"color"} onChange={(e)=>{setCollectionColor(e.target.value)}} value={collectionColorInput}/>
                    </div>
                </div>
                <div className="input-container-row">
                    <div className="column3">
                        <label>Collection number</label>
                        <input id="collectionNumber" placeholder={""} onChange={(e)=>{setCollectionNumber(e.target.value)}} value={collectionNumberInput}/>
                    </div>
                    <div className="column4">
                        <label>Year</label>
                        <input id="year" placeholder={""} type={"number"} onChange={(e)=>{setYear(e.target.value)}} value={yearInput}/>
                    </div>
                </div>
                <div className="input-container">
                    <label>Series number</label>
                    <input id="series" placeholder={""} onChange={(e)=>{setSeriesNumber(e.target.value)}} value={seriesNumberInput}/>
                </div>
                <div className="input-container">
                    <label>Purchase date</label>
                    <input id="date" type={"date"} onChange={(e)=>{setDate(e.target.value)}} value={dateInput}/>
                </div>
                <div className="input-container">
                    <label>Owner</label>
                    <input id="owner" onChange={(e)=>{setOwner(e.target.value)}} value={ownerInput}/>
                </div>
                <h2 className="warning-text">{warningText}</h2>
                <button className="add-btn" onClick={uploadData} disabled={buttonDisabled}>ADD CAR</button>
                
            </div>
        </div>
        </>
    )
}