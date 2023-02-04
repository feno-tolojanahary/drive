import { VIDEOS_EXTENSIONS } from "./constant"
import { join } from "node:path";

export function bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export function isVideoFile(key: string): boolean {
    const ext: string = key.split('.').pop() || ""
    return VIDEOS_EXTENSIONS.includes(ext);
}

export function convertKeyForSystem(key: string): string {
    const arrPaths = key.split('/');
    return join(...arrPaths);
}

export function isImage(key: string) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(key);
}