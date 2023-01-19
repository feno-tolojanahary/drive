import React, { useCallback, useEffect, useState } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { Document } from "../../server/src/common/interfaces/document";

const DocList = () => {
    const [documents, setDocuments] = useState<Document[]>([])

    const getDocuments = useCallback(() => {
        FileManager.getDocuments()
            .then((res: any) => {
                const data: Document[] = res.data;
                setDocuments(data);
            }).catch(err => {
                console.log("Error getting document: ", err);
            })
    }, [])

    useEffect(() => {
        getDocuments();
    })

    return (
        <>
            <TableView
                documents={documents}
            />
        </>
    )
}

export default DocList;