import { prisma } from "./db";
import { Prisma } from "@prisma/client";


class DocumentManager {

    public static async save(docSelect: Prisma.DocumentCreateInput) {
        const document = await prisma.document.create({
            data: {
                name: docSelect.name,
                parent: docSelect.parent,
                type: docSelect.type,
                originalname: docSelect.originalname,
                size: docSelect.size
            }
        });
        return document;
    }

    public static getAll() {
        return prisma.document.findMany();
    }

    public static updateDocument(input: Prisma.DocumentWhereUniqueInput, doc: Prisma.DocumentUpdateInput) {
        return prisma.document.update({
            where: { id: input.id as number },
            data: doc
        })
    }

    public static removeFile(doc: Prisma.DocumentWhereUniqueInput) {
        return prisma.document.update({
            where: { id: doc.id },
            data: { isArchived: true }
        })
    }

    public static deleteDoc(doc: Prisma.DocumentWhereUniqueInput) {
        return prisma.document.delete({
            where: { id: doc.id }
        })
    }
}

export default DocumentManager;