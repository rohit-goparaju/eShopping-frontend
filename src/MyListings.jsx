import { useState } from "react";
import AddListing from "./AddListing";

export default function MyListings(){
    const [showAddListings, setShowAddListings] = useState(false);
    return (
        <>
            <button className="btn btn-lg btn-outline-dark" onClick={()=>{setShowAddListings(true)}}><i className="bi bi-box-seam"></i> Add listings</button>
            <AddListing showAddListings={showAddListings} setShowAddListings={setShowAddListings}></AddListing>
        </>
    );
}