import React from "react";
import Modal from "../Modal";
import { DocumentRow } from "../../../server/src/common/interfaces/document";

type propsType = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    document: DocumentRow,
    updateDocListDel: (doc: Document) => void
}

export default function ModalDeleteDoc({
    isOpen: isOpenModal,
    setIsOpen: setIsOpenModal,
    document,
    updateDocListDel
} : propsType) {

    const handleDeleteDoc = () => {

    }


    return (
        <Modal 
            title="Delete document"
            isOpen={isOpenModal}
            setIsOpen={setIsOpenModal}
        >
            <div className="mb-6">
                <span className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Are you sure to delete this document?</span>
                
            </div>
            <div className="flex justify-around">
                <button 
                        type="button" 
                        className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={() => setIsOpenModal(false)}
                    >
                    Cancel
                </button>
                <button 
                        type="submit" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={handleDeleteDoc}
                    >
                    Ok
                </button>
                </div>
        </Modal>
    )
}