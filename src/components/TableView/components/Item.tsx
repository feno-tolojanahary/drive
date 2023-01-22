import React from "react";
import { Document } from "../../../../server/src/common/interfaces/document";
import { Row } from "react-table";

type propsType = {
    row: Row<Document>,
    setParentView: React.Dispatch<React.SetStateAction<number | null>>
}

const Item = (props: propsType) => {
    const { row, setParentView } = props;
    const document = row.values;

    return (
        <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" {...row.getRowProps()} onClick={() => setParentView(document.id)}>
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