import styles from './Modal.module.css'
export default function Modal({children, showModal, setShowModal, cleanUp}){

      function handleClose(){
        if(cleanUp)
            cleanUp();
        setShowModal(false);
    }

    if(!showModal)
        return null;
    else
        return (
            <div className={`${styles.modalBG} d-flex justify-content-center align-items-center w-100 h-100 position-fixed`}>
                <div className={`${styles.modalContent} text-bg-light rounded p-5 shadow`}>
                    <button className='btn-close d-block ms-auto' onClick={handleClose}></button>
                    {children}
                </div>    
            </div>
        );
}