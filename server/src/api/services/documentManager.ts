import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import { Document } from "@prisma/client";


class DocumentManager {

    public static async save(docSelect: Prisma.DocumentCreateInput) {
        if (!docSelect.parent) return Promise.reject(new Error("No parent given in param"));

        const parent = await prisma.document.findUnique({
                    where: { id: docSelect.parent } 
                });

        const parentKey = parent?.key ? `${parent?.key}/` : "";
        const document = await prisma.document.create({
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
    }

    public static async getTreeChildId(idsWhereInput: number[], arrayIds: number[]) {
        let currentParents: number[] = [];
        
        const currentChilds = await prisma.document.findMany({ 
            where: { parent: { in: idsWhereInput } },
            select: { id: true }
        })
        if (currentChilds.length) {
            currentParents = currentChilds.map(el => el.id);
            arrayIds.concat(currentParents);
            await DocumentManager.getTreeChildId(currentParents, arrayIds);
        }

    }

    public static async getAll(parent: string | null = null): Promise<Document[]> {
        const parentIds: number[] = parent ? [+parent] : [];
        await DocumentManager.getTreeChildId(parentIds, parentIds);

        return prisma.document.findMany({
            where: { 
                parent: { in: parentIds },
                archived: {
                    isSet: false
                } 
            }
        });
    }

    public static updateDocument(input: Prisma.DocumentWhereUniqueInput, doc: Prisma.DocumentUpdateInput): Promise<Document> {
        return prisma.document.update({
            where: { id: input.id as number },
            data: doc
        })
    }

    public static deleteDoc(doc: Prisma.DocumentWhereUniqueInput): Promise<Document> {
        return prisma.document.delete({
            where: { id: doc.id }
        })
    }

    public static findOne(input: Prisma.DocumentWhereUniqueInput): Promise<Document | null> {
        return prisma.document.findUnique({
            where: { id: input.id }
        })
    }

    public static async updateFolder(input: Prisma.DocumentWhereUniqueInput, doc: Prisma.DocumentUpdateInput): Promise<Document | null> {
        const newKey: string = doc.key as string;
        if (!doc.key) return Promise.reject("No new key param given");

        const { key: oldKey } = (await prisma.document.findUnique(
            {
                where: { id: input.id }, 
                select: { key: true }
            }) || {}
        )
        if (!oldKey) return Promise.reject(new Error("No old key found"));

        const childDocs: Document[] = await prisma.document.findMany({
            where: { key: { startsWith: newKey } }
        })
        const updateQuery = [];
        for (const childDoc of childDocs) {
            const update = prisma.document.update({ 
                where: { id: childDoc.id },
                data: { key: childDoc.key?.replace(oldKey, newKey) }
            });
            updateQuery.push(update);
        }

        await Promise.all(updateQuery).catch(err => {
            console.log("Rename Folder. Error updating sub key: ", err)
        });

        return prisma.document.update({ 
            where: { id: input.id },
            data: { 
                name: doc.name,
                key: newKey
             } 
        })
    }   
}

export default DocumentManager;