import React from "react";
import { DocType, DocumentRow } from "../../../../server/src/common/interfaces/document";
import { Row } from "react-table";
import { isImage } from "../../../../server/src/common/helper";
import { getUrlImage } from "../../../helpers";

type propsType = {
    row: Row<DocumentRow>,
    setParentDrillDownView: (folder: DocumentRow) => void,
    previewImage: (url: string) => void
}

const Item = (props: propsType) => {
    const { row, setParentDrillDownView, previewImage } = props;
    const document = row.original;

    const handleClickItem: React.MouseEventHandler<HTMLTableRowElement> =  (e) => {
        if (e.detail === 2) {
            if (document.type === DocType.FOLDER) {
                setParentDrillDownView(document);
            }
            if (document.type === DocType.FILE && isImage(document.key)) {
                previewImage(getUrlImage(document.key));
            }
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