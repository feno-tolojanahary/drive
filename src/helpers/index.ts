import { DOC_URI_BASE } from "./constant";

export const getNameForKey = (fileName: string) : string => {
    return fileName.replace(/[/\\?%*:|"<>]/g, "-");
}

export function getUrlImage(key: string) {
    return `${DOC_URI_BASE}/${key}`;
}