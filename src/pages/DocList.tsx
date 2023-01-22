import React, { useCallback, useEffect, useState } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { Document, DocType } from "../../server/src/common/interfaces/document";
import ModalCreateFolder from "../components/CreateFolder";
import { FaFolderPlus } from "react-icons/fa";

const DocList = () => {
    const [documents, setDocuments] = useState<Document[]>([])
    const [parent, setParent] = useState<number | null>(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
   
    const getDocuments = useCallback((_parent: number | null, _docValue: Document[]) => {
        if (_docValue.length === 0) {
            FileManager.getDocuments()
            .then((res: any) => {
                const data: Document[] = res.data;
                setDocuments(getByParent(_parent, data));
            }).catch(err => {
                console.log("Error getting document: ", err);
            })
        } else {
            const parentDoc: Document | undefined = _docValue.find((item: Document) => item.id === _parent);
            if (parentDoc?.type === DocType.FOLDER) setDocuments(getByParent(_parent, _docValue))
        }
    }, [])

    useEffect(() => {
        getDocuments(parent, documents);
        // eslint-disable-next-line
    }, [parent, getDocuments])

    const addNewDocument = (doc: Document) => {
        getDocuments(parent, [...documents, doc]);
    }

    const getByParent = (parent: number | null, docs: Document[]): Document[] => {
        return docs.filter((item: Document) => item.parent === parent)
    }

    return (
        <>
            <div>
                <div className="flex mb-10">
                    <FaFolderPlus 
                        className="text-base hover:cursor-pointer"
                        onClick={() => setIsCreateFolderOpen(true)}
                    />
                </div>
                    <TableView
                        documents={documents}
                        setView={setParent}
                    />
            </div>
            
            <ModalCreateFolder 
                addNewDocument={addNewDocument}
                isOpen={isCreateFolderOpen}
                setIsOpen={setIsCreateFolderOpen}
            />
        </>
    )
}

export default DocList;