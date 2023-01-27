import { VIDEOS_EXTENSIONS } from "./constant"

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