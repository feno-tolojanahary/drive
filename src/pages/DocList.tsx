import React, { useCallback, useEffect, useState, useRef } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { DocType, DocumentRow } from "../../server/src/common/interfaces/document";
import ModalCreateFolder from "../components/modals/CreateFolder";
import FileInput from "../components/FileInput";
import { toast } from 'react-toastify';
import MenuDropdown from "../components/dropdowns/MenuDropdown";
import { Action } from "../interfaces/general";
import ModalRenameFile from "../components/modals/RenameFile";
import ModalDeleteDoc from "../components/modals/RemoveDoc";
import ModalVideoPlayer from "../components/modals/VideoPlayer";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { selectDocManager, setCurrentKey } from "../redux/docManagerSlice";
import { getNameForKey } from "../helpers";
import PathHeader from "../components/PathHeader";

const DocList = () => {
    const [documents, setDocuments] = useState<DocumentRow[]>([])
    const [parent, setParent] = useState<number | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentRow>();
    const [documentToRename, setDocumentToRename] = useState<DocumentRow>();
    const [videoFile, setVideoFile] = useState<DocumentRow>();
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
    const [isOpenModalToDelete, setIsOpenModalDelete] = useState<boolean>(false);
    const [isOpenPlayer, setIsOpenPlayer] = useState<boolean>(false);
    const [isOpenRenameDoc, setIsOpenRenameDoc] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const currentKey: string = useAppSelector(selectDocManager);
   
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
        formData.append("file", file);
        formData.append("parent", `${parent}`);
        formData.append("key", `${currentKey}/${getNameForKey(file.name)}`);
    
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
        if (type === "remove") {
            setDocumentToDelete(doc);
            setIsOpenModalDelete(true);
        } else if (type === "update") {
            setDocumentToRename(doc);
            setIsOpenModalDelete(true);
        } else if (type === "play") {
            setVideoFile(doc);
            setIsOpenPlayer(true);
        }
    }

    const updateDocList = (type: Action, doc: DocumentRow) => {
        let _newDocs: DocumentRow[] = documents;
        if (type === "update") {
            _newDocs = documents.map((item: DocumentRow) => {
                if (item.id === doc.id) {
                    item = {
                        ...item,
                        ...doc
                    }
                }
                return item;
            })
        }
        if (type === "remove") {
            _newDocs = documents.filter((item: DocumentRow) => item.id !== doc.id);
        }
        setDocuments(_newDocs);
    }

    const handleDrillDownView = (selectedFolder: DocumentRow) => {
        const newKey: string = currentKey + selectedFolder.key;
        dispatch(setCurrentKey(newKey));
        setParent(selectedFolder.id);
    }

    const handleClickParentPath = (folderName: string) => {
        let parentId: number | null = null;
        if (folderName) {
            const parentDoc: DocumentRow | undefined = documents.find((item: DocumentRow) => item.name === folderName);
            if (parentDoc) parentId = parentDoc.id;
        }
        setParent(parentId);
    }

    return (
        <>
            <div className="mb-8">
                <MenuDropdown 
                    onClickFolder={() => setIsCreateFolderOpen(true)}
                    onClickFile={handleNewFile}
                />
            </div>
            <PathHeader
                onClickPath={handleClickParentPath}
            />
            <TableView
                documents={documents}
                setParentDrillDownView={handleDrillDownView}
                onClickAction={handleClickTableAction}
                parent={parent}
            />
            <FileInput onFileSelected={handleFileSelected} input={inputFileRef} />
            <ModalCreateFolder 
                addNewDocument={addNewDocument}
                isOpen={isCreateFolderOpen}
                setIsOpen={setIsCreateFolderOpen}
                parent={parent}
            />
            { documentToRename &&
                <ModalRenameFile
                    document={documentToRename}
                    isOpen={isOpenRenameDoc}
                    setIsOpen={setIsOpenRenameDoc}
                    updateDocList={updateDocList}
                />
            }
            { documentToDelete &&
                <ModalDeleteDoc
                    document={documentToDelete}
                    isOpen={isOpenModalToDelete}
                    setIsOpen={setIsOpenRenameDoc}
                    updateDocList={updateDocList}
                />
            }
            { videoFile &&
                <ModalVideoPlayer 
                    isOpen={isOpenPlayer}
                    setIsOpen={setIsOpenPlayer}
                    videoFile={videoFile}
                />
            }
        </>
    )
}

export default DocList;