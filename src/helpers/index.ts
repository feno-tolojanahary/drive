
export const getNameForKey = (fileName: string) : string => {
    return fileName.replace(/[/\\?%*:|"<>]/g, "-");
}