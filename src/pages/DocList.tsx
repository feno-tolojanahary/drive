import React, { useCallback, useEffect, useState, useRef } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { Document, DocType } from "../../server/src/common/interfaces/document";
import ModalCreateFolder from "../components/CreateFolder";
import FileInput from "../components/FileInput";
import { toast } from 'react-toastify';
import MenuDropdown from "../components/MenuDropdown";

const DocList = () => {
    const [documents, setDocuments] = useState<Document[]>([])
    const [parent, setParent] = useState<number | null>(null);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);
   
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
          const doc: Document = res.data;
          getDocuments(parent, [...documents, doc]);
        }).catch(error => {
          console.log(error)
        })
      };

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

    const handleNewFile = () => {
        inputFileRef.current?.click();
    }

    return (
        <>
            <MenuDropdown 
                onClickFolder={() => setIsCreateFolderOpen(true)}
                onClickFile={handleNewFile}
            />
            <TableView
                documents={documents}
                setView={setParent}
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