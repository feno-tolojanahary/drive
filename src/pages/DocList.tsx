import React, { useCallback, useEffect, useState } from "react";
import TableView from "../components/TableView";
import FileManager from "../services/FileManager";
import { Document } from "../../server/src/common/interfaces/document";

const DocList = () => {
    const [documents, setDocuments] = useState<Document[]>([])
    const [parent, setParent] = useState<number | null>(null);
   
    const getDocuments = useCallback((_parent: number | null) => {
        if (documents.length === 0) {
            FileManager.getDocuments()
            .then((res: any) => {
                const data: Document[] = res.data;
                setDocuments(getByParent(_parent, data));
            }).catch(err => {
                console.log("Error getting document: ", err);
            })
        } else {
            const parentDoc: Document | undefined = documents.find((item: Document) => item.id === _parent);
            if (parentDoc?.type === "FOLDER") setDocuments(getByParent(_parent, documents))
        }
    }, [documents])

    useEffect(() => {
        getDocuments(parent);
    }, [parent, getDocuments])

    const getByParent = (parent: number | null, docs: Document[]): Document[] => {
        return docs.filter((item: Document) => item.parent === parent)
    }

    return (
        <>
            <TableView
                documents={documents}
                setView={setParent}
            />
        </>
    )
}

export default DocList;