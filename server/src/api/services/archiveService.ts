
import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import DocumentManager from "./documentManager";
import { DocType } from "../../common/interfaces/document";
import { Document } from "@prisma/client";
import moment from "moment";

class ArchiveService {

    public static async archiveDoc(input: Prisma.DocumentWhereUniqueInput): Promise<Prisma.BatchPayload> {
        const parentIds: number[] = input.id ? [input.id] : [];

        await DocumentManager.getTreeChildId(parentIds, parentIds);

        const archives = parentIds.map((id: number) => ({
            hasArchivedParent: id !== input.id ? true : false,
            documentId: id,
            expireOn: moment().add(30, "days").toDate()
        }))

        return prisma.archive.createMany({
            data: archives
        })
    }

    public static async getArchive(): Promise<Document[]> {
        return prisma.document.findMany({
            where: {
                archive: {
                    is: {
                        hasArchivedParent: false
                    }
                }
            }
        })
    }

    public static async restoreDoc(input: Prisma.DocumentWhereUniqueInput): Promise<Document> {
        const doc: Document | null = await prisma.document.findUnique({
            where: { id: input.id }
        })
        
        if (!doc) return Promise.reject(new Error("Specified document not found"));

        if (doc.type === DocType.FILE) {
            await prisma.archive.delete({ where: { documentId: doc.id } })
        } else {
            const docIds: number[] = [doc.id];
            await DocumentManager.getTreeChildId(docIds, docIds)
            await prisma.archive.deleteMany({
                where: { documentId: { in: docIds } }
            })
        }
        return doc;
    }

    public static async deleteDoc(input: Prisma.DocumentWhereUniqueInput): Promise<any> {
        const doc: Document | null = await prisma.document.findUnique({
            where: { id: input.id }
        })
        
        if (!doc) return Promise.reject(new Error("Specified document not found"));
        if (doc.type === DocType.FILE) { 
            await prisma.archive.delete({ where: { documentId: doc.id } })
            await prisma.document.delete({ where: { id: doc.id } })
        } else {
            const docIds: number[] = [doc.id];
            await DocumentManager.getTreeChildId(docIds, docIds)
            await prisma.archive.deleteMany({
                where: { documentId: { in: docIds } }
            })
            await prisma.document.deleteMany({
                where: { id: { in: docIds } }
            })
        }
        
    }

    public static async deleteExpiredArchive() : Promise<any> {
        
        await prisma.document.deleteMany({
            where: { expireOn: { lte: new Date() } }
        })
    }
}

export default ArchiveService;