import { useState } from "react";
import { useUserContext } from "./App";
import Modal from "./Modal";

export default function Home(){
    const {user} = useUserContext();
    const [showModal, setShowModal] = useState(true);

    return (
        <>
            <h1>
                Welcome to eShopping {user}
            </h1>
            {/* <Modal showModal={showModal} setShowModal={setShowModal}>Hello</Modal>
            <button onClick={()=>setShowModal(true)}>show modal</button> */}
        </>
    );
}