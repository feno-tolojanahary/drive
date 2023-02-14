import { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import TableView from "../components/TableView";
import ArchiveService from "../services/ArchiveService";
import TableViewContext, { ContextTableType } from "../globalState/tableViewContext";
    

export default function Bin() {
    const { updateType } = useContext<ContextTableType>(TableViewContext);
    const [documents, setDocuments] = useState<DocumentRow[]>([]);

    useEffect(() => {
        updateType("archive");
        ArchiveService.getArchives()
            .then((res: AxiosResponse) => {
                if (!res.data) throw new Error("Server error");
                setDocuments(res.data as DocumentRow[]);
            }).catch((err: Error) => {
                console.log("Error get archive: ", err.message);
            })
    }, []); // eslint-disable-line

    return (
        <>
            <TableView 
                documents={documents}
                onClickAction={() => {}}
            />
        </>
    )
}   