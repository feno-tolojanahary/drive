import { DOC_URI_BASE } from "./constant";
import { IDocument } from "react-doc-viewer";

export const getNameForKey = (fileName: string) : string => {
    return fileName.replace(/[/\\?%*:|"<>]/g, "-");
}

export function getUrlImage(key: string) {
    return `${DOC_URI_BASE}/${key}`;
}

export function getIDocumentViewer(key: string): IDocument {
    return {
        uri: `${DOC_URI_BASE}/${key}`
    }
}