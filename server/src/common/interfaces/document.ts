

export interface Document {
    id?: number,
    name: string,
    type: string,
    key?: string,
    parentId?: number | null,
    parent?: Document,
    childs?: Document[],
    mimeType?: string | null,
    originalname?: string | null,
    size?: number | null,
    updatedAt?: Date,
    createdAt?: Date
}

export interface DocumentOpt {
    id?: number,
    name?: string,
    type?: string,
    key?: string,
    parentId?: number | null,
    parent?: Document,
    childs?: Document[],
    originalname?: string | null,
    size?: number | null,
    mimeType?: string | null,
    updatedAt?: Date,
    createdAt?: Date
}

export interface DocumentRow {
    id: number,
    name: string,
    type: string,
    parentId?: number | null,
    parent?: Document,
    childs?: Document[],
    key: string,
    originalname?: string,
    size?: number,
    mimeType?: string | null,
    updatedAt?: Date,
    createdAt?: Date
}

export const DocType = {
    FILE: 'FILE',
    FOLDER: 'FOLDER'
};