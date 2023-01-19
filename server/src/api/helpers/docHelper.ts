type Document = {
    name: string,
    parent?: number | null,
    type?: string,
    originalname: string,
    size: number
}

class DocHelper {
    
    public static getTreeDocs(docs: Document[], parent: number | null = null): Document[] {
        return docs.filter(item => item.parent === parent)
                .map(item => ({ ...item, children: DocHelper.getTreeDocs(docs, item.parent)} ))
    }

}

export default DocHelper;