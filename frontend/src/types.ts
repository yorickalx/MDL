
export type TVideo = {
    id: string;
    title: string;
    url: string;
    duration: number;
    thumbnailUrl: string;
    uploader: string;
}

type TDownloadStatus = "queued" | "downloading" | "finished" | "done" | "error";

export type TDownloadProgress = {
    videoId: string;
    status: TDownloadStatus;
    percent: number;
    eta: number | null; // seconds
    speed: number | null; // bytes/second
    error?: string;
}