import { AxiosResponse } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import TableView from "../components/TableView";
import ArchiveService from "../services/ArchiveService";
import TableViewContext, { ContextTableType } from "../globalState/tableViewContext";
import ModalRestoreDoc from "../components/modals/RestoreDoc";
import { Action, ActionBin } from "../interfaces/general";

export default function Bin() {
    const { updateType } = useContext<ContextTableType>(TableViewContext);
    const [documents, setDocuments] = useState<DocumentRow[]>([]);
    const [documentToRestore, setDocumentToRestore] = useState<DocumentRow>();
    const [isOpenRestoreDoc, setIsOpenRestoreDoc] = useState<boolean>(false);

    const getArchives = useCallback(() => {
        ArchiveService.getArchives()
        .then((res: AxiosResponse) => {
            if (!res.data) throw new Error("Server error");
            setDocuments(res.data as DocumentRow[]);
        }).catch((err: Error) => {
            console.log("Error get archive: ", err.message);
        })
    }, [])

    useEffect(() => {
        updateType("archive");
        getArchives()
    }, []); // eslint-disable-line

    const handleClickTableAction = async (type: Action | ActionBin, doc: DocumentRow) => {
        switch (type) {
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

    const deleteForever = (doc: DocumentRow) => {
        ArchiveService.delete(doc.id)
            .then((_res: AxiosResponse) => {
                getArchives();
            })
            .catch(err => {
                console.log(err)
            })
    }

    const restoreDoc = (doc: DocumentRow) => {
        setDocumentToRestore(doc);
        setIsOpenRestoreDoc(true);
    }

    return (
        <>
            <TableView 
                documents={documents}
                onClickAction={handleClickTableAction}
                restoreDoc={restoreDoc}
            />
             { documentToRestore &&
                <ModalRestoreDoc 
                    isOpen={isOpenRestoreDoc}
                    setIsOpen={setIsOpenRestoreDoc}
                    document={documentToRestore}   
                    updateList={getArchives}
                />
            }
        </>
    )
}   