

export interface Document {
    id?: number,
    name: string,
    parent?: number | null,
    type?: string,
    originalname: string,
    size: number,
    updatedAt?: Date,
    createdAt?: Date
}