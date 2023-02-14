import React, { useState, useContext } from "react";
import "../../assets/css/tableView.css";
import { useTable, Column, Row } from "react-table";
import Item from "./components/Item";
import { DocumentRow, DocType } from "../../../server/src/common/interfaces/document";
import { bytesToSize, isImage, isDocFile, isVideoFile } from "../../../server/src/common/helper";
import DropdownAction from "../dropdowns/DropdownAction";
import { Action } from "../../interfaces/general";
import ImageView from "../modals/ImageView";
import { getUrlImage, getIDocumentViewer } from "../../helpers";
import { IDocument } from "react-doc-viewer";
import DocsViewer from "../modals/DocsViewer";
import { FaFolder, FaRegFile, FaRegFileImage, FaRegFileVideo } from "react-icons/fa";
import TableViewContext, { ContextTableType } from "../../globalState/tableViewContext";

type propsType = {
    documents: DocumentRow[],
    setParentDrillDownView?: (folder: DocumentRow) => void,
    onClickAction: (type: Action, doc: DocumentRow) => void,
    parent?: number | null,
    restoreDoc?: (doc: DocumentRow) => void
}

const DocName = ({ doc }: { doc: DocumentRow }) => {
    return (
        <span>
            { doc.type === DocType.FOLDER 
                ? <FaFolder /> 
                : isVideoFile(doc.key)
                ? <FaRegFileVideo />
                : isImage(doc.key)
                ? <FaRegFileImage />
                : <FaRegFile />
            }
            <span className="ml-2">{doc.originalname}</span>
        </span>
    )
}

const TableView = (props: propsType) => {
    const { 
        documents: data, 
        setParentDrillDownView = () => {}, 
        onClickAction,
        restoreDoc = () => {}
    } = props;

    const [indexImageShowing, setIndexImageShowing] = useState<number>(0);
    const [isOpenImageViewer, setIsOpenImageViewer] = useState<boolean>(false);

    const [isOpenDocViewer, setIsOpenDocViewer] = useState<boolean>(false);

    const { type } = useContext<ContextTableType>(TableViewContext);

    const columns: Column<DocumentRow>[]  = React.useMemo(() => {
        return [
            {
                Header: "Name",
                accessor: 'name',
                Cell: ({ row }) => <DocName doc={row.original} />
            },
            {
                Header: "Size",
                accessor: "size",
                Cell: ({value}) => value ? <>{bytesToSize(value)}</> : <></>
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

    const imageViewList: string[] = React.useMemo(() => data.filter((doc: DocumentRow) => (
            doc.type === DocType.FILE && isImage(doc.key)
        )).map((doc: DocumentRow) => getUrlImage(doc.key))
    , [data]);

    const docsViewList: IDocument[] = React.useMemo(() => data.filter((doc: DocumentRow) => (
        doc.type === DocType.FILE && isDocFile(doc.key)
    )).map((doc: DocumentRow) => getIDocumentViewer(doc.key)), [data])

    const previewImage = (url: string) => {
        const index = imageViewList.indexOf(url);
        setIndexImageShowing(index);
        setIsOpenImageViewer(true)
    }

    const previewDoc = (iDoc: IDocument) => {
        const index = docsViewList.findIndex((e: IDocument) => e.uri === iDoc.uri);
        docsViewList.splice(index, 1);
        docsViewList.unshift(iDoc);
        setIsOpenDocViewer(true)
    }

    const processItem = (doc: DocumentRow) => {
        if (type === "drive") {
            if (doc.type === DocType.FOLDER) {
                setParentDrillDownView(doc);
            }
            if (doc.type === DocType.FILE) {
                if (isImage(doc.key)) previewImage(getUrlImage(doc.key));
                if (isDocFile(doc.key)) previewDoc(getIDocumentViewer(doc.key));
            }
        } else {
            restoreDoc(doc);
        }

    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data })

    return (
        <>
            <div className="flex flex-col">
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <table className="min-w-full" {...getTableProps()}>
                                <thead className="bg-white border-b">
                                    { headerGroups.map((headerGroup: any) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column: any) => (
                                            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left" {...column.getHeaderProps()}>
                                            {column.render('Header')}
                                            </th>
                                        ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                {
                                    rows.length ?
                                        rows.map((row: Row<DocumentRow>) => {
                                            prepareRow(row)
                                            return (
                                                <Item
                                                    key={row.id}
                                                    row={row}
                                                    processItem={processItem}
                                                />
                                            )
                                        })
                                    : 
                                    <tr>
                                        <span>Folder is empty.</span>
                                    </tr>
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <ImageView 
                images={imageViewList}
                defaultIndex={indexImageShowing}
                isOpen={isOpenImageViewer}
                setIsOpen={setIsOpenImageViewer}
            />

            <DocsViewer
                isOpen={isOpenDocViewer}
                setIsOpen={setIsOpenDocViewer}
                docs={docsViewList}
            />
        </>
                
    )
}

export default TableView;