import { useEffect, useState } from "react";
import backend from "./backend";
import { useUserContext } from "./App";
import { Link } from "react-router-dom";
import Checkokut from "./Checkout";

export default function Cart(){

    const {user}= useUserContext();
    const [cartOrders, setCartOrders] = useState([]);
    const [noListings, setNoListings] = useState(false);
    const [checkout, setCheckout] = useState(false);

    const findMyCartOrders = async ()=>{
        try{
            const reqData = {
                username: user,
            };

            const response = await backend.post("/products/findMyCartOrders", reqData);
            
            if(response?.data){
                if(response.data){
                    if(response.data?.length > 0){
                        setNoListings(false);
                    }else{
                        setNoListings(true);
                    }
                    setCartOrders(response.data);
                }else{
                    setNoListings(true);
                }
                // console.log(response.data);
            }else{
                setNoListings(true);
            }

        }catch(error){
            setNoListings(true);
            console.error("cart orders error: ", error);
        }
    };

    useEffect(
            ()=>{
                findMyCartOrders();
            },
            [user]
        );

    const removeFromCart = async(productId)=>{
        try{
            const reqData = {
                username : user,
                productId : productId
            };
            const response = await backend.put("/removeFromCart", reqData);
            if(response?.data){
                if(response.data === "SUCCESS"){
                    findMyCartOrders();
                }else{
                    console.error("remove from cart error");
                }
            }else{
                console.error("remove from cart error");
            }
            // console.log(reqData);
        }catch(error){
            console.error("remove from cart error: ", error);
        }
    };

    function handleRemoveFromCart(productId){
        removeFromCart(productId);
    }

    const emptyCart = async()=>{
        try{
            const response = await backend.put("/emptyCart", {username: user});
            if(response?.data){
                console.log(response.data);
                setCheckout(true);
            }else{
                console.error("empty cart error");
            }
        }catch(error){
            console.error("empty cart error: ", error);
        }
    };
    
    function handleCheckout(){
        emptyCart();
    }

    return (
        <>
        <h1>My cart: </h1>
        <hr></hr>
        {
            noListings && 
            <>
                <span className="fs-3">You have no items in your cart.</span>
                &nbsp;&nbsp;&nbsp;<Link to={"/"} className="fs-5"><i className="bi bi-cart-plus"></i> do some shopping.</Link>
            </>
        }
        {
            !noListings &&
            <div className="table-responsive">
                <table className="table">
                    <thead className="table-secondary">
                        <tr>
                            <th>product</th>
                            <th>price</th>
                            <th className="text-center">Remove from cart</th>
                        </tr>
                    </thead>
                    <tbody>   
                    {
                    cartOrders.map(
                        (product)=>{
                            return (
                                <tr key={product?.id} style={{height: "100px"}}>
                                    <td className="align-middle">
                                        <div className="d-inline-block mx-3 my-2" style={{width : "100px", height: "100px"}}>
                                            <img src={`data:${product?.productImageType};base64,${product?.productImage}`}  alt="product image" width={"100%"} height={"100%"} style={{objectFit:"contain"}}></img>
                                        </div>
                                        {product?.name} 
                                    </td>
                                    <td className="align-middle">
                                        <i className="bi bi-currency-rupee"></i>{product?.price}
                                    </td>
                                    <td className="text-center align-middle">
                                        <button className="btn btn-danger" onClick={()=>handleRemoveFromCart(product?.id)}><i className="bi bi-cart-x"></i></button>
                                    </td>
                                </tr>
                            );
                        }
                    )
                    }
                    <tr className="table-secondary fw-bold">
                        <td className="align-middle">
                            Cart value
                        </td>
                        <td className="align-middle">
                            <i className="bi bi-currency-rupee"></i>{cartOrders.reduce((accumulator, product)=>accumulator+product?.price, 0)}
                        </td>
                        <td className="text-center align-middle">
                            <button className="btn btn-sm btn-success" onClick={()=>handleCheckout()}><i className="bi bi-cart-check"></i> proceed to checkout</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        }
        <Checkokut checkout={checkout} cartValue={cartOrders.reduce((accumulator, product)=>accumulator+product.price, 0)}></Checkokut>
        </>

    );
}