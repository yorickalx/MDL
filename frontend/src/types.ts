
export type TVideo = {
    id: string;
    title: string;
    url: string;
    duration: number;
    thumbnailUrl: string;
    uploader: string;
}

type TDownloadStatus = "downloading" | "finished" | "done" | "error";

export type TDownloadProgress = {
    videoId: string;
    status: TDownloadStatus;
    percent: number;
    eta: number; // seconds
    speed: number; // bytes/second
    error?: string;
}