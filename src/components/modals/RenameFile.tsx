import React, { useState } from "react";
import { toast } from 'react-toastify';
import Modal from "../Modal";
import { DocumentRow } from "../../../server/src/common/interfaces/document";
import FileManager from "../../services/FileManager";
import { Action } from "../../interfaces/general";

type propsType = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    document: DocumentRow,
    updateDocList: (type: Action, doc: DocumentRow) => void
}

const ModalRenameFile = ({
    isOpen: isOpenModal,
    setIsOpen: setIsOpenModal,
    document,
    updateDocList
}: propsType) => {

    const [inputVal, setInputVal] = useState<string>(document.name);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.currentTarget.value);
    }

    const handleSubmitForm = () => {
        if (!inputVal || (inputVal && Boolean(inputVal.trim()))) {
            toast("The name must not be empty");
            return;
        }
    
        FileManager.updateDoc(document.id, { name: inputVal })
            .then((res: any) => {
                if (!res.data) throw new Error("no data received");
                toast.success("Renaming file with success");
                updateDocList("update", res.data as DocumentRow);
            })
            .catch(err => {
                console.log(err);
                toast.error("Error when renaiming doc, please retry");
            })
    }

    return (
        <Modal 
            title="New Folder"
            isOpen={isOpenModal}
            setIsOpen={setIsOpenModal}
        >
            <form onSubmit={handleSubmitForm}>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Rename file</label>
                    <input 
                        type="text" 
                        onChange={handleChangeInput}
                        value={inputVal}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={"File name"}     
                    />
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
                        >
                        Ok
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default ModalRenameFile;