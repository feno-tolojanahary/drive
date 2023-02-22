import { prisma } from "./db";
import { Prisma } from "@prisma/client";
import { DocumentRow } from "../../common/interfaces/document";

class RecentService {

    public static async getRecent(): Promise<DocumentRow[]> {
        return prisma.$queryRaw<DocumentRow[]>`SELECT * FROM Document d
                                    LEFT JOIN Document p ON p.id = d.parentId AS parent
                                    ORDER BY d.createdAt DESC, d.updatedAt ASC
                                    GROUP BY DATE_TRUNC('month', d.updatedAt)`;
    }
}                

export default RecentService;