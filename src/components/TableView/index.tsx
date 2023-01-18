import React from "react";
import "../../assets/css/tableView.css";
import { useTable } from "react-table";
import Item from "./components/Item";

type Document = {
    name: string,
    type: string,
    size?: number,
    updatedAt?: Date
}

type propsType = {
    documents: Document[],
}


const TableView = (props: propsType) => {
    const columns = React.useMemo(() => (
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
    } = useTable({ columns, data: props.documents })

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
                            {rows.map((row: any) => {
                                prepareRow(row)
                                return (
                                <Item
                                    key={...row.getRowProps()}
                                    row={row}
                                />
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
                
    )
}

export default TableView;