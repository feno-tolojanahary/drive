import React from "react";
import { API_URL } from "../../services/http";
import Modal from "../Modal";
import { DocumentRow } from "../../../server/src/common/interfaces/document";

type Props = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    videoFile: DocumentRow
}

export default function ModalVideoPlayer({
    isOpen,
    setIsOpen,
    videoFile
}: Props) {

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
        >
            <div className="w-4/6">
                <video controls muted className="w-full">
                    <source src={`${API_URL}/doc/read-video/${videoFile.id}`} type="video/mp4"></source>
                </video>
            </div>
        </Modal>
    );
}