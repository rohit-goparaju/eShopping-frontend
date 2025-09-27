import { useState } from "react";
import { useUserContext } from "./App";
import Modal from "./Modal";
import FindAllListings from "./FindAllListings";

export default function Home(){
    const {user} = useUserContext();
    const [showModal, setShowModal] = useState(true);

    return (
        <>
            {/* {!user && <span className="fs-3">Login to buy/sell products.</span>} */}
            {/* <div>Welcome to eShopping</div> */}
            <FindAllListings></FindAllListings>
        </>
    );
}