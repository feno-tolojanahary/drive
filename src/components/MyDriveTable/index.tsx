import React from "react";
import "../../assets/css/tableView.css";
import {  Column } from "react-table";
import { DocumentRow } from "../../../server/src/common/interfaces/document";
import DropdownAction from "../dropdowns/DropdownAction";
import { Action, ActionBin } from "../../interfaces/general";
import TableView from "../TableView";

type propsType = {
    documents: DocumentRow[],
    setParentDrillDownView?: (folder: DocumentRow) => void,
    onClickAction: (type: Action | ActionBin, doc: DocumentRow) => void,
    restoreDoc?: (doc: DocumentRow) => void
}

const MyDrive = (props: propsType) => {
    const { 
        documents, 
        setParentDrillDownView = () => {}, 
        onClickAction,
        restoreDoc = () => {}
    } = props;

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
                Header: "Modified",
                accessor: "updatedAt"
            },
            {
                Header: "",
                accessor: "id",
                Cell: ({ row }) => <DropdownAction onClick={onClickAction} doc={row.original} />
            }
        ]
    // eslint-disable-next-line
    }, [])   

    return (
        <>
            <TableView
                documents={documents}
                setParentDrillDownView={setParentDrillDownView}
                restoreDoc={restoreDoc}
                columns={columns}
            />
        </>  
    )
}

export default MyDrive;