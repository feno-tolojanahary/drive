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
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { selectDocManager, setCurrentKey } from "../redux/docManagerSlice";
import { getNameForKey } from "../helpers";
import PathHeader from "../components/PathHeader";
import { AxiosResponse } from "axios";
import TableViewContext, { ContextTableType } from "../globalState/tableViewContext";

const DocList = () => {
    const [documents, setDocuments] = useState<DocumentRow[]>([])
    const [parentId, setParentId] = useState<number | null>(null);
    const [documentToDelete, setDocumentToDelete] = useState<DocumentRow>();
    const [documentToRename, setDocumentToRename] = useState<DocumentRow>();
    const [videoFile, setVideoFile] = useState<DocumentRow>();
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState<boolean>(false);
    const [isOpenModalToDelete, setIsOpenModalDelete] = useState<boolean>(false);
    const [isOpenPlayer, setIsOpenPlayer] = useState<boolean>(false);
    const [isOpenRenameDoc, setIsOpenRenameDoc] = useState<boolean>(false);
    const inputFileRef = useRef<HTMLInputElement>(null);    

    const { updateType } = useContext<ContextTableType>(TableViewContext)

    const dispatch = useAppDispatch();
    const currentKey: string = useAppSelector(selectDocManager);
   
    const getDocuments = useCallback((_parentId: number | null) => {
        FileManager.getDocuments(_parentId)
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
        formData.append("parentId", `${parentId}`);
        formData.append("key", `${currentKey}/${getNameForKey(file.name)}`);
    
        FileManager.uploadFile(formData).then((res: AxiosResponse) => {
          if (!res.data) throw new Error("no resultat");
          toast.success("Upload with success")
          getDocuments(parentId);
        }).catch(error => {
          console.log(error)
        })
      };

    useEffect(() => {
        getDocuments(parentId);
        // eslint-disable-next-line
    }, [parentId, getDocuments])

    const addNewDocument = (_doc: DocumentRow) => {
        getDocuments(parentId);
    }

    const handleNewFile = () => {
        inputFileRef.current?.click();
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
        setParentId(selectedFolder.id);
    }

    const handleClickParentPath = (folderName: string) => {
        let parentId: number | null = null;
        if (folderName) {
            const parentDoc: DocumentRow | undefined = documents.find((item: DocumentRow) => item.name === folderName);
            if (parentDoc) parentId = parentDoc.id;
        }
        setParentId(parentId);
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
            />
            <FileInput onFileSelected={handleFileSelected} input={inputFileRef} />
            <ModalCreateFolder 
                addNewDocument={addNewDocument}
                isOpen={isCreateFolderOpen}
                setIsOpen={setIsCreateFolderOpen}
                parentId={parentId}
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