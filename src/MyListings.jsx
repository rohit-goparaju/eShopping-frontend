import { useEffect, useState } from "react";
import AddListing from "./AddListing";
import { useUserContext } from "./App";
import backend from "./backend";
import styles from "./MyListings.module.css";

export default function MyListings(){
    const {user}= useUserContext();
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10); 
    const [noListings, setNoListings] = useState(false);
    const [listings, setListings] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [failRemove, setFailRemove] = useState(false);


    const findMyListings = async()=>{
        try{
            const response = await backend.post("/products/findMyListings", {
                username: user,
                pageNumber : pageNumber,
                size : pageSize
            });  
            if(response?.data){
                setListings(response.data?.content);
                setTotalPages(response.data?.totalPages);
                if(response.data?.totalElements > 0){
                    setNoListings(false);
                }else{
                    setNoListings(true);
                }
                // console.log(response.data);
            }else{
                setNoListings(true);
            }
        }catch(error){
            setNoListings(true);
            console.error("Find my listings error: ", error);
        }
    };

    useEffect(
        ()=>{
            findMyListings();
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

     const removeListing = async (productID)=>{
            try{
                const response = await backend.post("/removeListing", {
                    username : user,
                    productId : productID
                });
    
                if(response?.data){
                    console.log(response.data);
                    setFailRemove(false);
                    window.location.reload();
                }
                else{
                    setFailRemove(true);
                }
    
            }catch(error){
                setFailRemove(true);
                console.error("remove listing error: ", error);
            }
        } ;
    
        function handleRemoveListing(productId){
            if(window.confirm("Do you want to remove the listing?"))
                removeListing(productId);
        }
        
    return (
        <>
            <div>
                <h1 className="d-inline-block">Your Listings: </h1>{noListings && <span className="fw-bold fs-3"> You have no current listings.</span>} <AddListing></AddListing>
                {
                    !noListings && 
                    <>
                        <div className={`${styles.listingContainer}`}>
                            {listings.map(
                                (product, index, listings)=>
                                {
                                    return (
                                        <div className={`card ${styles.listing}`} key={product?.id}>
                                            <img className="card-img-top" src={`data:${product.productImageType};base64,${product.productImage}`}  alt="product image" width={"100%"} height={"100%"} style={{objectFit:"cover"}}></img>
                                            <div className="card-body">
                                                <h4 className="card-title">{product?.name}</h4>
                                                <div className="card-text">
                                                    <p>{product?.description}</p>
                                                    <p>Sold By: <i>{product?.sellerUsername}</i></p>
                                                    <p>Price: {product?.price}</p>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                <button className="btn btn-danger" onClick={()=>handleRemoveListing(product.id)}>Remove listing</button>
                                            </div>
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
                            </select>
                        </ul>
                    </>
                }

                
              

                

            </div>
        </>
    );
}