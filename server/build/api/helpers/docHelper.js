"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocHelper {
    static getTreeDocs(docs, parent = null) {
        return docs.filter(item => item.parent === parent)
            .map(item => (Object.assign(Object.assign({}, item), { children: DocHelper.getTreeDocs(docs, item.parent) })));
    }
}
exports.default = DocHelper;
