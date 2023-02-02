"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
class DocumentManager {
    static save(docSelect) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!docSelect.parent)
                return Promise.reject(new Error("No parent given in param"));
            const parent = yield db_1.prisma.document.findUnique({
                where: { id: docSelect.parent }
            });
            const parentKey = (parent === null || parent === void 0 ? void 0 : parent.key) ? `${parent === null || parent === void 0 ? void 0 : parent.key}/` : "";
            const document = yield db_1.prisma.document.create({
                data: {
                    name: docSelect.name,
                    parent: docSelect.parent,
                    type: docSelect.type,
                    key: `${parentKey}${docSelect.name}`,
                    originalname: docSelect.originalname,
                    size: docSelect.size
                }
            });
            return document;
        });
    }
    static getAll() {
        return db_1.prisma.document.findMany();
    }
    static updateDocument(input, doc) {
        return db_1.prisma.document.update({
            where: { id: input.id },
            data: doc
        });
    }
    static removeFile(doc) {
        return db_1.prisma.document.update({
            where: { id: doc.id },
            data: { isArchived: true }
        });
    }
    static deleteDoc(doc) {
        return db_1.prisma.document.delete({
            where: { id: doc.id }
        });
    }
    static findOne(input) {
        return db_1.prisma.document.findUnique({
            where: { id: input.id }
        });
    }
    static updateFolder(input, doc) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = doc.key;
            if (!doc.key)
                return Promise.reject("No new key param given");
            const { key: oldKey } = ((yield db_1.prisma.document.findUnique({
                where: { id: input.id },
                select: { key: true }
            })) || {});
            if (!oldKey)
                return Promise.reject(new Error("No old key found"));
            const childDocs = yield db_1.prisma.document.findMany({
                where: { key: { startsWith: newKey } }
            });
            const updateQuery = [];
            for (const childDoc of childDocs) {
                const update = db_1.prisma.document.update({
                    where: { id: childDoc.id },
                    data: { key: (_a = childDoc.key) === null || _a === void 0 ? void 0 : _a.replace(oldKey, newKey) }
                });
                updateQuery.push(update);
            }
            yield Promise.all(updateQuery).catch(err => {
                console.log("Rename Folder. Error updating sub key: ", err);
            });
            return db_1.prisma.document.update({
                where: { id: input.id },
                data: {
                    name: doc.name,
                    key: newKey
                }
            });
        });
    }
}
exports.default = DocumentManager;
