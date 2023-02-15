import { useCallback, useEffect, useState, useRef, useContext } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import ModalCreateFolder from "../components/modals/CreateFolder";
import FileInput from "../components/FileInput";
import { toast } from 'react-toastify';
import MenuDropdown from "../components/dropdowns/MenuDropdown";
import { Action, ActionBin } from "../interfaces/general";
import ModalRenameFile from "../components/modals/RenameDoc";
import ModalDeleteDoc from "../components/modals/RemoveDoc";
import ModalVideoPlayer from "../components/modals/VideoPlayer";
import ModalRestoreDoc from "../components/modals/RestoreDoc";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { selectDocManager, setCurrentKey } from "../redux/docManagerSlice";
import { getNameForKey } from "../helpers";
import PathHeader from "../components/PathHeader";
import { AxiosResponse } from "axios";
import TableViewContext, { ContextTableType } from "../globalState/tableViewContext";
import ArchiveService from "../services/ArchiveService";

const DocList = () => {
    const [documents, setDocuments] = useState<DocumentRow[]>([])
    const [parent, setParent] = useState<number | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentRow>();
    const [documentToRename, setDocumentToRename] = useState<DocumentRow>();
    const [documentToRestore, setDocumentToRestore] = useState<DocumentRow>();
    const [videoFile, setVideoFile] = useState<DocumentRow>();
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
    const [isOpenModalToDelete, setIsOpenModalDelete] = useState<boolean>(false);
    const [isOpenPlayer, setIsOpenPlayer] = useState<boolean>(false);
    const [isOpenRenameDoc, setIsOpenRenameDoc] = useState<boolean>(false);
    const [isOpenRestoreDoc, setIsOpenRestoreDoc] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);    

    const { updateType } = useContext<ContextTableType>(TableViewContext)

    const dispatch = useAppDispatch();
    const currentKey: string = useAppSelector(selectDocManager);
   
    const getDocuments = useCallback((_parent: number | null) => {
        FileManager.getDocuments(_parent)
        .then((res: any) => {
            const data: DocumentRow[] = res.data;
            setDocuments(data);
        }).catch(err => {
            console.log("Error getting document: ", err);
        })
    }, [])

    useEffect(() => {
        updateType("drive");
    }, []) // eslint-disable-line

    const handleFileSelected = (file: File | undefined) => {
        if (!file) {
          console.log("no file selected");
          return
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("parent", `${parent}`);
        formData.append("key", `${currentKey}/${getNameForKey(file.name)}`);
    
        FileManager.uploadFile(formData).then((res: AxiosResponse) => {
          if (!res.data) throw new Error("no resultat");
          toast.success("Upload with success")
          getDocuments(parent);
        }).catch(error => {
          console.log(error)
        })
      };

    useEffect(() => {
        getDocuments(parent);
        // eslint-disable-next-line
    }, [parent, getDocuments])

    const addNewDocument = (_doc: DocumentRow) => {
        getDocuments(parent);
    }

    const handleNewFile = () => {
        inputFileRef.current?.click();
    }

    const deleteForever = (doc: DocumentRow) => {
        ArchiveService.delete(doc.id)
            .then((_res: AxiosResponse) => {
                updateList();
            })
            .catch(err => {
                console.log(err)
            })
    }

    const handleClickTableAction = async (type: Action | ActionBin, doc: DocumentRow) => {
        switch (type) {
            case "remove":
                setDocumentToDelete(doc);
                setIsOpenModalDelete(true);
                break;
            case "update":
                setDocumentToRename(doc);
                setIsOpenModalDelete(true);
                break;
            case "play":
                setVideoFile(doc);
                setIsOpenPlayer(true);
                break;
            case "download":
                (async () => {
                    await FileManager.download(doc.id)
                })()
                break;
            case "restore": 
                setDocumentToRestore(doc);
                setIsOpenRestoreDoc(true)
                break;
            case "delete":
                deleteForever(doc);
                break;
            default:
                break;
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

    const updateList = () => {
        getDocuments(parent);
    }

    const restoreDoc = (doc: DocumentRow) => {
        setDocumentToRestore(doc);
        setIsOpenRestoreDoc(true);
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
                restoreDoc={restoreDoc}
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
            { documentToRestore &&
                <ModalRestoreDoc 
                    isOpen={isOpenRestoreDoc}
                    setIsOpen={setIsOpenRestoreDoc}
                    document={documentToRestore}       
                    updateList={updateList} 
                />
            }
        </>
    )
}

export default DocList;