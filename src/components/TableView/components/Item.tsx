import React from "react";
import { DocumentRow } from "../../../../server/src/common/interfaces/document";
import { Row } from "react-table";

type propsType = {
    row: Row<DocumentRow>,
    processItem: (doc: DocumentRow) => void
}

const Item = (props: propsType) => {
    const { row, processItem } = props;
    const document = row.original;

    const handleClickItem: React.MouseEventHandler<HTMLTableRowElement> =  (e) => {
        if (e.detail === 2) {
            processItem(document)
        }
    }

    return (
        <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" {...row.getRowProps()} onClick={handleClickItem}>
            { row.cells.map((cell: any) => (
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap" {...cell.getCellProps()}>
                    {cell.render('Cell')}
                </td>
                )
            )}
        </tr>
    )
}

export default Item;