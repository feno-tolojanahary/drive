import React, { useState } from "react";
import "../../assets/css/tableView.css";
import { useTable, Column, Row } from "react-table";
import Item from "./components/Item";
import { DocumentRow, DocType } from "../../../server/src/common/interfaces/document";
import { bytesToSize, isImage } from "../../../server/src/common/helper";
import DropdownAction from "../dropdowns/DropdownAction";
import { Action } from "../../interfaces/general";
import ImageView from "../modals/ImageView";
import { getUrlImage } from "../../helpers";

type propsType = {
    documents: DocumentRow[],
    setParentDrillDownView: (folder: DocumentRow) => void,
    onClickAction: (type: Action, doc: DocumentRow) => void,
    parent: number | null
}


const TableView = (props: propsType) => {
    const { documents: data, setParentDrillDownView, onClickAction } = props;

    const [indexImageShowing, setIndexImageShowing] = useState<number>(0);
    const [isOpenImageViewer, setIsOpenImageViewer] = useState<boolean>(false);

    const columns: Column<DocumentRow>[]  = React.useMemo(() => {
        return [
            {
                Header: "Name",
                accessor: 'name'
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
    }, [])   

    const imagesList: string[] = React.useMemo(() => data.filter((doc: DocumentRow) => (
            doc.type === DocType.FILE && isImage(doc.key)
        )).map((doc: DocumentRow) => getUrlImage(doc.key))
    , [data]);

    const previewImage = (url: string) => {
        const index = imagesList.indexOf(url);
        setIndexImageShowing(index);
        setIsOpenImageViewer(true)
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
                                                    setParentDrillDownView={setParentDrillDownView}
                                                    previewImage={previewImage}
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
                images={imagesList}
                defaultIndex={indexImageShowing}
                isOpen={isOpenImageViewer}
                setIsOpen={setIsOpenImageViewer}
            />
        </>
                
    )
}

export default TableView;