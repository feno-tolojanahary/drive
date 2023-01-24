import React, { useCallback, useEffect, useState, useRef } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { Document, DocType, DocumentRow } from "../../server/src/common/interfaces/document";
import ModalCreateFolder from "../components/CreateFolder";
import FileInput from "../components/FileInput";
import { toast } from 'react-toastify';
import MenuDropdown from "../components/MenuDropdown";
import { Action } from "../interfaces/general";

const DocList = () => {
    const [documents, setDocuments] = useState<DocumentRow[]>([])
    const [parent, setParent] = useState<number | null>(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
   
    const getDocuments = useCallback((_parent: number | null, _docValue: DocumentRow[]) => {
        if (_docValue.length === 0) {
            FileManager.getDocuments()
            .then((res: any) => {
                const data: DocumentRow[] = res.data;
                setDocuments(getByParent(_parent, data));
            }).catch(err => {
                console.log("Error getting document: ", err);
            })
        } else {
            const parentDoc: DocumentRow | undefined = _docValue.find((item: DocumentRow) => item.id === _parent);
            if (parentDoc?.type === DocType.FOLDER) setDocuments(getByParent(_parent, _docValue))
        }
    }, [])

    const handleFileSelected = (file: File | undefined) => {
        if (!file) {
          console.log("no file selected");
          return
        }
        const formData = new FormData();
        formData.append("file", file)
    
        FileManager.uploadFile(formData).then(res => {
          if (!res) throw new Error("no resultat");
          toast.success("Upload with success")
          const doc: DocumentRow = res.data;
          getDocuments(parent, [...documents, doc]);
        }).catch(error => {
          console.log(error)
        })
      };

    useEffect(() => {
        getDocuments(parent, documents);
        // eslint-disable-next-line
    }, [parent, getDocuments])

    const addNewDocument = (doc: DocumentRow) => {
        getDocuments(parent, [...documents, doc]);
    }

    const getByParent = (parent: number | null, docs: DocumentRow[]): DocumentRow[] => {
        return docs.filter((item: DocumentRow) => item.parent === parent)
    }

    const handleNewFile = () => {
        inputFileRef.current?.click();
    }

    
    const handleClickTableAction = async (type: Action, doc: DocumentRow) => {
        if (type === "delete") {
            const res = await FileManager.removeDoc(doc.id);
            if (typeof res.data?.id === "number") {
                const _documents = documents.filter((item: DocumentRow) => item.id === res.data.id);
                setDocuments(_documents);
            }
        } else if (type === "update") {
            const res = await FileManager.updateDoc(doc)
            if (typeof res.data?.id === "number") {
                const _documents = documents.map((item: DocumentRow) => {
                    if (item.id === res.data.id) {
                        item = {
                            ...item,
                            ...doc
                        }
                    }
                    return item;
                })
                setDocuments(_documents);
            }
        }
    }

    return (
        <>
            <div className="mb-8">
                <MenuDropdown 
                    onClickFolder={() => setIsCreateFolderOpen(true)}
                    onClickFile={handleNewFile}
                />
            </div>
            <TableView
                documents={documents}
                setView={setParent}
                onClickAction={handleClickTableAction}
            />
            <FileInput onFileSelected={handleFileSelected} input={inputFileRef} />
            <ModalCreateFolder 
                addNewDocument={addNewDocument}
                isOpen={isCreateFolderOpen}
                setIsOpen={setIsCreateFolderOpen}
            />
        </>
    )
}

export default DocList;