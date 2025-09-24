import { useState } from "react";
import {useUserContext} from "./App";
import backend from "./backend";

export default function AddListing(){

    const [inputs, setInputs] = useState({});
    const {user} = useUserContext();

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
            }else{
                console.error("Failed to add listing");
            }

        }catch(error){
            console.error("Add listing error: ", error);
        }
    };

    function handleChange(event){
        const {name, value, type, files} = event.target;
        setInputs((prev)=>({...prev, [name] : type==="file" ? files[0] : value}));
    }

    function handleSubmit(event){
        event.preventDefault();
        addListing();
        console.log(inputs , user);
    }

    return (
        <div>
            <form className="d-flex flex-column gap-2 m-5 p-5 border shadow rounded" onSubmit={handleSubmit}>
                <label className="form-label"> 
                    Product image:
                    <input type="file" className="form-control" name="productImage" onChange={handleChange} required></input>
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
                <input type="submit" className="btn btn-primary" value={"Add Listing"}></input>
            </form>
        </div>
    );
}