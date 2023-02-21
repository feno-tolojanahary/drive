import React from "react";
import { AxiosResponse } from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import {  Column } from "react-table";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import TableView from "../components/TableView";
import ArchiveService from "../services/ArchiveService";
import TableViewContext, { ContextTableType } from "../globalState/tableViewContext";
import ModalRestoreDoc from "../components/modals/RestoreDoc";
import { Action, ActionBin } from "../interfaces/general";
import { toast } from 'react-toastify';
import DropdownActionBin from "../components/dropdowns/DropdownActionBin";
import moment from "moment";

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

    const columns: Column<DocumentRow>[]  = React.useMemo(() => {
        return [
            {
                Header: "Name",
                accessor: 'name'
            },
            {
                Header: "Size",
                accessor: "size"
            },
            {
                Header: "Date binned",
                accessor: "archive",
                Cell: ({ value }) => <>{moment(value?.createdAt).format("Do MMM YYYY")}</>
            },
            {
                Header: "Original location",
                accessor: "parent",
                Cell: ({ value }) => <>{value ? value.name : "-"}</>
            },
            {
                Header: "",
                accessor: "id",
                Cell: ({ row }) => <DropdownActionBin onClick={handleClickTableAction} doc={row.original} />
            }
        ]
    // eslint-disable-next-line
    }, [])   

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

    const emptyBin = async () => {
        await ArchiveService.emptyBin();
        toast.success("Your bin is now empty!")
    }

    return (
        <>
            <div className="alert bg-yellow-100 rounded-lg py-5 px-6 mb-3 text-base text-yellow-700 inline-flex items-center w-full alert-dismissible fade show" role="alert">
                Items in the bin are deleted forever after 30 days
                <button onClick={emptyBin} type="button" className="p-1 ml-auto bg-yellow-200 hover:bg-yellow-500 rounded text-yellow-900 border-none opacity-70 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-yellow-400 hover:opacity-75 hover:no-underline"><strong>Empty bin</strong></button>
            </div>
            <TableView 
                columns={columns}
                documents={documents}
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