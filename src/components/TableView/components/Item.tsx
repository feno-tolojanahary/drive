import React from "react";

type propsType = {
    row: any
}

const Item = (props: propsType) => {
    const { row } = props;

    return (
        <tr className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100" {...row.getRowProps()}>
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