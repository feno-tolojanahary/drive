

export interface Document {
    id?: number,
    name: string,
    type: string,
    parent?: number | null,
    originalname?: string | null,
    size?: number | null,
    updatedAt?: Date,
    createdAt?: Date
}

export interface DocumentOpt {
    id?: number,
    name?: string,
    type?: string,
    parent?: number | null,
    originalname?: string | null,
    size?: number | null,
    updatedAt?: Date,
    createdAt?: Date
}

export interface DocumentRow {
    id: number,
    name: string,
    type: string,
    parent: number | null,
    originalname?: string,
    size?: number,
    updatedAt?: Date,
    createdAt?: Date
}

export const DocType = {
    FILE: 'FILE',
    FOLDER: 'FOLDER'
};