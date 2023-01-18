import { prisma } from "./db";
import { Prisma } from "@prisma/client";


class DocumentManager {

    static async save(docSelect: any) {
        const document = await prisma.document.create({
            data: {
                name: docSelect.name,
                key: docSelect.key,
                type: Prisma.DocType.FILE,
                originalname: docSelect.originalname,
                size: docSelect.size
            }
        });
        return document;
    }
}

export default DocumentManager;