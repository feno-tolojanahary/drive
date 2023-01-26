import { Document } from "../../common/interfaces/document";

class DocHelper {
    
    public static getTreeDocs(docs: Document[], parent: number | null = null): Document[] {
        return docs.filter(item => item.parent === parent)
                .map(item => ({ ...item, children: DocHelper.getTreeDocs(docs, item.parent)} ))
    }

}

export default DocHelper;                   