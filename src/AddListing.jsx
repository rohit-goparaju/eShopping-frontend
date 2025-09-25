import { useRef, useState } from "react";
import {useUserContext} from "./App";
import backend from "./backend";
import Modal from "./Modal";

export default function AddListing(){

    const [inputs, setInputs] = useState({});
    const {user} = useUserContext();
    const fileRef = useRef(null);
    const [fileFormatErr, setFileFormatErr] = useState(false);
    const [addError, setAddError] = useState(false);
    const [showAddListings, setShowAddListings] = useState(false);

    const addListing = async ()=>{
        try{
            const formData = new FormData();

            formData.append("productDetails", new Blob(
                [
                    JSON.stringify(
                        {
                            name : inputs.productName,
                            description: inputs.productDescription,
                            price : inputs.productPrice,
                            sellerUsername : user
                        }
                    )
                ],
                {
                    type: "application/json"
                }
            ));

            formData.append("productImage", inputs.productImage);
            const response = await backend.post("/addListing", formData);

            if(response?.data){
                console.log(response.data);
                cleanup();
                setShowAddListings(false);
                window.location.reload();                
            }else{
                setAddError(true);
                console.error("Failed to add listing");
            }

        }catch(error){
            setAddError(true);
            console.error("Add listing error: ", error);
        }
    };

    function handleChange(event){
        const {name, value, type, files} = event.target;
        if(type === "file"){
            const filename = files[0]?.name;
            if(filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png")){
                setFileFormatErr(false);
                setInputs((prev)=>({...prev, [name] : files[0]}));
            }else{
                setFileFormatErr(true);
                fileRef.current.value = "";
                setInputs((prev)=>({...prev, [name]: ""}));
            }
        }else{
            setInputs((prev)=>({...prev, [name] : value}));
        }
    }

    function handleSubmit(event){
        event.preventDefault();
        addListing();
        console.log(inputs , user);
    }

    function cleanup(){
        setInputs({});
        setFileFormatErr(false);
        setAddError(false);
        fileRef.current.value = "";
    }

   
    return (
        <>
        <button className="btn btn-outline-dark" onClick={()=>{setShowAddListings(true)}}><i className="bi bi-box-seam"></i> Add listings</button>
        <Modal showModal={showAddListings} setShowModal={setShowAddListings} cleanUp={cleanup}>
        <div>
            <form className="d-flex flex-column gap-2 p-5" onSubmit={handleSubmit}>
                <h1>Add Listing:</h1>
                <label className="form-label"> 
                    Product image:
                    <div className=" d-flex align-items-center justify-content-center border border-1 rounded" >
                        <img src={inputs?.productImage && URL.createObjectURL(inputs.productImage)} alt="no image"  height={ inputs.productImage && "200px"} width={"100%"} style={{objectFit: "contain" }}></img>
                    </div>
                    <div className=" d-flex align-items-center">
                        <input ref={fileRef} type="file" className="form-control" name="productImage" onChange={handleChange} required></input>
                    </div>
                {fileFormatErr && <span className="text-danger">Supported file formats: <b>.jpg, .jpeg, .png</b></span>}
                </label>
                <label className="form-label">
                    product name:
                    <input type="text" className="form-control" name="productName" value={inputs.productName||""} onChange={handleChange} required></input>
                </label>
                <label className="form-label">
                    product description:
                    <textarea className="form-control" name="productDescription" value={inputs.productDescription||""} onChange={handleChange} required></textarea>
                </label>
                <label className="form-label">
                    product price:
                    <input type="text" className="form-control" pattern="^\d+(\.\d+)?$" name="productPrice" value={inputs.productPrice||""} title="should be a currency number format." onChange={handleChange} required></input>
                </label>
                {addError && <span className="text-danger">Failed to add listing, contact support.</span>}
                <input type="submit" className="btn btn-primary" value={"Add Listing"}></input>
            </form>
        </div>
        </Modal>
        </>
    );
}