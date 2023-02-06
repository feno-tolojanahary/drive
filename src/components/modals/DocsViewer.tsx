import React from "react";
import Modal from "../Modal";
import DocViewer, { DocViewerRenderers, IDocument } from "react-doc-viewer";

type Props = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    docs: IDocument[]
}

export default function DocsViewer (props: Props) {
    const {
        isOpen,
        setIsOpen,
        docs
    } = props;    

    return (
        <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
            <DocViewer pluginRenderers={DocViewerRenderers} documents={docs} />
        </Modal>
    )
}