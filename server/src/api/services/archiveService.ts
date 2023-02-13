
import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import DocumentManager from "./documentManager";

class ArchiveService {

    public static async archiveDoc(input: Prisma.DocumentWhereUniqueInput): Promise<Prisma.BatchPayload> {
        const parentParam: number[] = input.id ? [input.id] : [];

        const parentIds: number[] = await DocumentManager.getTreeChildId(parentParam);

        const archives = parentIds.concat(parentParam).map((id: number) => ({
            hasArchivedParent: id !== input.id ? true : false,
            documentId: id
        }))

        return prisma.archive.createMany({
            data: archives
        })
    }

    public static async getArchive(): Promise<Document> {
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
}

export default ArchiveService;