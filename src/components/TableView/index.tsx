import React from "react";
import "../../assets/css/tableView.css";
import { useTable, Column, Row } from "react-table";
import Item from "./components/Item";
import { Document } from "../../../server/src/common/interfaces/document";

type propsType = {
    documents: Document[],
    setView: React.Dispatch<React.SetStateAction<number | null>>
}


const TableView = (props: propsType) => {
    const { documents: data, setView } = props;

    const columns: Column<Document>[]  = React.useMemo(() => (
        [
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
            }
        ]
    ), [])   


    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data })

    return (
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
                                    rows.map((row: Row<Document>) => {
                                        prepareRow(row)
                                        return (
                                            <Item
                                                key={row.id}
                                                row={row}
                                                setView={setView}
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
                
    )
}

export default TableView;