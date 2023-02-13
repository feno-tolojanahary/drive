import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { DocumentRow } from "../../server/src/common/interfaces/document";
import TableView from "../components/TableView";
import ArchiveService from "../services/ArchiveService";


export default function Bin() {
    
    const [documents, setDocuments] = useState<DocumentRow[]>([]);

    useEffect(() => {
        ArchiveService.getArchives()
            .then((res: AxiosResponse) => {
                if (!res.data) throw new Error("Server error");
                setDocuments(res.data as DocumentRow[]);
            }).catch((err: Error) => {
                console.log("Error get archive: ", err.message);
            })
    }, []);

    return (
        <>
            <TableView 
                documents={documents}
                onClickAction={() => {}}
            />
        </>
    )
}   