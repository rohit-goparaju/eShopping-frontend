import { useEffect, useRef, useState } from "react";
import { useUserContext } from "./App";
import Modal from "./Modal";
import backend from "./backend";
import { base64ToFile } from "./util";

export default function EditListing({showEditListing, setShowEditListing, editListingProductDetails, setEditListingProductDetails, listRefreshFunction}){

    const {user} = useUserContext();
    const [inputs, setInputs] = useState({productName: editListingProductDetails.name, productDescription: editListingProductDetails.description, productPrice : editListingProductDetails.price});
    const fileRef = useRef(null);
    const [fileFormatErr, setFileFormatErr] = useState(false);
    const [editError, setEditError] = useState(false);


    function cleanup(){
        listRefreshFunction();
        setEditListingProductDetails({});
        setInputs({});
        setFileFormatErr(false);
        setEditError(false);
        fileRef.current.value = "";
    }

    const editListing = async ()=>{
        try{

            const formData = new FormData();

            formData.append("productDetails", new Blob(
                [
                    JSON.stringify(
                        {
                            productCode : editListingProductDetails.code,
                            name : inputs.productName,
                            description : inputs.productDescription,
                            price : inputs.productPrice,
                            sellerUsername : editListingProductDetails.seller
                        }
                    )
                ],
                {
                    type : "application/json"
                }
            ));

            //handle no image
            if(!inputs?.productImage){
                const oldImagefile = base64ToFile(editListingProductDetails.image, editListingProductDetails.imageType, editListingProductDetails.imageFileName);
                formData.append("productImage", oldImagefile);
            }
            else
                formData.append("productImage", inputs.productImage);

            const response = await backend.put("/editListing", formData);

            if(response?.data){
                // console.log(response?.data);
                setShowEditListing(false);
                cleanup();
            }else{
                setEditError(true);
            }

        }catch(error){
            setEditError(true);
            console.error("edit listing error: ", error);
        }
    };


    function handleSubmit(event){
        event.preventDefault();
        // console.log(inputs);
        editListing();
    }

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

    // function test(){
    //     const file = base64ToFile(editListingProductDetails.image, editListingProductDetails.imageType, editListingProductDetails.imageFileName);
    //     console.log(editListingProductDetails);
    // }

    // useEffect(
    //     ()=>test(),
    //     [editListingProductDetails]
    // );

    useEffect(
        ()=>{
            setInputs({productName: editListingProductDetails.name, productDescription: editListingProductDetails.description, productPrice : editListingProductDetails.price});
        },
        [editListingProductDetails]
    );

    return (
        <Modal showModal={showEditListing} setShowModal={setShowEditListing} cleanUp={cleanup}>
            <h1>edit listing</h1>
            {/* <div className={`card shadow`} >
                <img className="card-img-top" src={`data:${editListingProductDetails.imageType};base64,${editListingProductDetails.image}`}  alt="product image" width={"100%"} height={"100%"} style={{objectFit:"contain"}}></img>
                <div className="card-body">
                    <h4 className="card-title">{editListingProductDetails?.name}</h4>
                    <div className="card-text">
                        <p>{editListingProductDetails?.description}</p>
                        <p><b>Sold By:</b> <i>{editListingProductDetails?.seller}</i></p>
                        <p><b>Price:</b> <i className="bi bi-currency-rupee"></i>{editListingProductDetails?.price}</p>
                    </div>
                </div>
            </div>   */}
            <div>
                <form className="d-flex flex-column gap-2 p-5" onSubmit={handleSubmit}>
                <h1>Edit Listing:</h1>
                <label className="form-label"> 
                    Product image:
                    <div className=" d-flex align-items-center justify-content-center border border-1 rounded" >
                        <img src={inputs?.productImage ? URL.createObjectURL(inputs.productImage) : `data:${editListingProductDetails.imageType};base64,${editListingProductDetails.image}`} alt="no image"  height={ "200px"} width={"100%"} style={{objectFit: "contain" }}></img>
                    </div>
                    <div className=" d-flex align-items-center">
                        <input ref={fileRef} type="file" className="form-control" name="productImage" onChange={handleChange}></input>
                    </div>
                {fileFormatErr && <span className="text-danger">Supported file formats: <b>.jpg, .jpeg, .png</b></span>}
                </label>
                <label className="form-label">
                    product name:
                    <input type="text" className="form-control" name="productName" value={inputs.productName||editListingProductDetails?.name} onChange={handleChange} required></input>
                </label>
                <label className="form-label">
                    product description:
                    <textarea className="form-control" name="productDescription" value={inputs.productDescription||editListingProductDetails?.description} onChange={handleChange} required></textarea>
                </label>
                <label className="form-label">
                    product price:
                    <input type="text" className="form-control" pattern="^\d+(\.\d+)?$" name="productPrice" value={inputs.productPrice||editListingProductDetails?.price} title="should be a currency number format." onChange={handleChange} required></input>
                </label>
                {editError && <span className="text-danger">Failed to update listing, contact support.</span>}
                <input type="submit" className="btn btn-primary" value={"Update Listing"}></input>
            </form>
            </div>
        </Modal>
    )
}