import { useEffect, useState } from "react";
import AddListing from "./AddListing";
import { useUserContext } from "./App";
import backend from "./backend";
import styles from "./MyListings.module.css";
import EditListing from "./EditListing";

export default function MyListings(){
    const {user}= useUserContext();
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10); 
    const [noListings, setNoListings] = useState(false);
    const [listings, setListings] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [failRemove, setFailRemove] = useState(false);
    const [showEditListing, setShowEditListing] = useState(false);
    const [editListingProductDetails, setEditListingProductDetails]= useState({});
    const [search, setSearch] = useState("");

    const findMyListings = async()=>{
        try{
            const reqData = {
                username: user,
                pageNumber : pageNumber,
                size : pageSize,
                search: search
            };
            const response = await backend.post("/products/findMyListings", reqData);  
            if(response?.data){
                setListings(response.data?.content);
                setTotalPages(response.data?.totalPages);
                if(response.data?.totalElements > 0){
                    setNoListings(false);
                }else{
                    if(!search){
                        setNoListings(true);
                    }
                }
                // console.log(response.data);
            }else{
                if(!search)
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
                const reqData = {
                    username : user,
                    productId : productID,
                };

                const response = await backend.post("/removeListing", reqData);
    
                if(response?.data){
                    console.log(response.data);
                    setFailRemove(false);
                    findMyListings();
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
        
        function handleEditListing(productName, productDescription, productPrice, productImage, productImageType, produtImageFileName, sellerUsername, productCode){
            setEditListingProductDetails({
                name : productName,
                description : productDescription,
                price : productPrice,
                image : productImage,
                imageType :  productImageType,
                imageFileName : produtImageFileName,
                seller : sellerUsername,
                code : productCode
            })
            setShowEditListing(true);
        }
        
    function handleSearchChange(event){
        setSearch(event.target.value);
    }

    function handleSearch(event){
        event?.preventDefault();
        setPageNumber(0);
        findMyListings();
    }

    useEffect(
        ()=>{
            if(search === ""){
                setPageNumber(0);
                findMyListings();
            }
        },
        [search]
    );

    return (
        <>
            <div>
                <div className="row m-2">
                    <div className={`col-sm-12 d-flex ${!noListings && 'justify-content-end'}`}>
                        {noListings && <span className="fs-3"> You have no current listings.</span>}&nbsp;&nbsp;&nbsp;<AddListing listRefreshFunction={findMyListings}></AddListing>
                    </div>
                </div>
                {
                    !noListings && 
                    <>
                        <form className="row ms-auto me-3 mb-4 g-0" onSubmit={handleSearch}>
                                <div className="col-11 col-md-6 col-lg-5 col-xl-3 d-flex gap-1 ms-auto">
                                    <input className="form-control border border-dark" type="text" placeholder="&#x1F50D; Search" name="search" value={search || ""} onChange={handleSearchChange}></input>
                                    <input type="submit" className="btn btn-primary" value={"search"}></input>
                                </div>
                        </form>
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
                                            <div className="card-footer d-flex flex-column justify-content-around align-items-stretch gap-2 flex-wrap">
                                                <button className="btn btn-primary" onClick={()=>handleEditListing(product?.name, product?.description, product?.price, product?.productImage,product?.productImageType, product?.productImageFileName,product?.sellerUsername, product?.productCode)}>Edit listing</button>
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
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </ul>
                    </>
                }
            </div>
            <EditListing showEditListing={showEditListing} setShowEditListing={setShowEditListing} editListingProductDetails={editListingProductDetails} setEditListingProductDetails={setEditListingProductDetails} listRefreshFunction={findMyListings}></EditListing>
        </>
    );
}