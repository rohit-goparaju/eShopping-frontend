import backend from "./backend";
import AddListing from "./AddListing";
import { useState , useEffect, useActionState} from "react";
import { useUserContext } from "./App";
import styles from './FindAllListings.module.css';
import Login from './Login';

export default function FindAllListings(){

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10); 
    const [noListings, setNoListings] = useState(false);
    const [listings, setListings] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const {user} = useUserContext();
    const [showLogin, setShowLogin] = useState(false);
    
    const findAllListings = async ()=>{
        try{
            const response = await backend.get(`/products/findAllListings?size=${pageSize}&page=${pageNumber}`);

            if(response?.data){
                setListings(response.data?.content);
                setTotalPages(response.data?.totalPages);
                if(response.data?.totalElements > 0){
                    setNoListings(false);
                }else{
                    setNoListings(true);
                }
            }else{
                setNoListings(true);
            }

        }catch(error){
            setNoListings(true);
            console.error("find all listings error: ", error);
        }
    }

    useEffect(
        ()=>{
            findAllListings();
        },
        [user, pageNumber, pageSize]
    );
    
    useEffect(
        ()=>{
            setPageNumber(0);
        },
        [user, pageSize]
    );

    function printPagination(){
        let pageNumbers = [];
        for(let i=0; i<totalPages; i++){
            pageNumbers.push(<li className={`page-item ${pageNumber === i ? "active" : ""}`} key={i}><a className="page-link" href="#" onClick={()=>setPageNumber(i)}>{i+1}</a></li>);
        }
        return pageNumbers;
    }

    const addToCart = async(productId)=>{
        try{
            const reqData = {
                username : user,
                productId : productId
            };
            // console.log(reqData);
            const response = await backend.post("/addToCart", reqData);

            if(response?.data){
                console.log(response.data);
                if(response?.data === "FAILED"){
                    console.error("add to cart error");
                }else{
                    // window.location.reload();
                    findAllListings();
                }
            }else{
                console.error("add to cart error");
            }

        }catch(error){
            console.error("add to cart error: ", error);
        }
    };

    function handleAddToCart(productId){
        addToCart(productId);
    }

    const removeFromCart = async(productId)=>{
        try{
            const reqData = {
                username : user,
                productId : productId
            };
            const response = await backend.put("/removeFromCart", reqData);
            if(response?.data){
                if(response.data === "SUCCESS"){
                    findAllListings();
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

    return (
            <>
                <div>
                    <div className="row m-2">
                        <div className={`col-sm-12 d-flex ${!noListings && 'justify-content-end'}`}>
                            {noListings && <span className="fs-3"> No current listings.</span>}&nbsp;&nbsp;&nbsp;{user && noListings && <AddListing listRefreshFunction={findAllListings}></AddListing>}
                        </div>
                    </div>
                    {
                        !noListings && 
                        <>
                            <div className={`${styles.listingContainer}`}>
                                {listings.map(
                                    (product, index, listings)=>
                                    {
                                        return (
                                            <div className={`card ${styles.listing} shadow`} key={product?.id}>
                                                <img className="card-img-top" src={`data:${product.productImageType};base64,${product.productImage}`}  alt="product image" width={"100%"} height={"100%"} style={{objectFit:"contain"}}></img>
                                                <div className="card-body">
                                                    <h4 className="card-title">{product?.name}</h4>
                                                    <div className="card-text">
                                                        <p>{product?.description}</p>
                                                        <p><b>Sold By:</b> <i>{product?.sellerUsername}</i></p>
                                                        <p><b>Price:</b> <i className="bi bi-currency-rupee"></i>{product?.price}</p>
                                                    </div>
                                                </div>
                                                {
                                                    user &&
                                                <div className="card-footer d-flex flex-column justify-content-center align-items-stretch gap-2 flex-wrap">
                                                    {user && product?.buyerUsername !== user &&<button className="btn btn-primary" onClick={()=>handleAddToCart(product?.id)}><i className="bi bi-cart-plus"></i> Add to cart</button>}
                                                    {user && product?.buyerUsername === user && <button className="btn btn-danger" onClick={()=>handleRemoveFromCart(product?.id)}><i className="bi bi-cart-x"></i> Remove from cart</button>}
                                                </div>
                                                }
                                                {
                                                    !user &&
                                                    <button className={`${styles.hoverDisplay} btn btn-dark m-3`} onClick={()=>setShowLogin(true)}>Login to make purchases.</button>
                                                }
                                            </div>  
                                        );
                                    }
                                )}
                            </div>
                            <ul className="pagination d-flex flex-wrap justify-content-center align-items-center">
                                <li className="page-item"><a className={`page-link ${pageNumber === 0 ? "disabled" : ""}`} href="#"  onClick={()=>setPageNumber(prev=>prev-1)}>Prev</a></li>
                                    {
                                        printPagination()
                                    }
                                <li className="page-item"><a className={`page-link ${pageNumber === (totalPages-1)? "disabled" : ""}`} href="#" onClick={()=>setPageNumber(prev=>prev+1)}>Next</a></li>
                                <select className="page-link rounded-end" name="pageSize" value={pageSize} onChange={(event)=>setPageSize(event.target.value)}>
                                    <option value={1}>1</option>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </ul>
                        </>
                    }
                </div>
                <Login showLogin={showLogin} setShowLogin={setShowLogin}></Login>
            </>
        );
}