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
}

export default DocumentManager;