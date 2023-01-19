

export interface Document {
    name: string,
    parent?: number | null,
    type?: string,
    originalname: string,
    size: number,
    updatedAt?: Date,
    createdAt?: Date
}