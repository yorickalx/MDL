import { useDownloads } from "@/stores/useDownloads";
import type {TDownloadProgress, TVideo} from "@/types.ts";


export type TVideoMetadataResponse = {thumbnail_url: string} & Omit<TVideo, "thumbnailUrl">;


export async function fetchMetadata(url: string): Promise<TVideo[]> {
    //TODO error handling

    const data: TVideoMetadataResponse[] =
        await fetch(`http://localhost:8000/metadata?url=${encodeURIComponent(url)}`)
        .then(res => res.json());

    return data.map(element => {
        return {
            id: element.id,
            title: element.title,
            url: element.url,
            duration: element.duration,
            thumbnailUrl: element.thumbnail_url,
            uploader: element.uploader,
        }
    });
}

export async function startDownload(url: string) {
    const es = new EventSource(`http://localhost:8000/download?url=${encodeURIComponent(url)}`);
    es.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const p: TDownloadProgress = {
            videoId: data.video_id,
            status: data.status,
            percent: data.percent,
            eta: data.eta,
            speed: data.speed,
        };
        
        useDownloads.getState().update(p);

        if (p.status === "done" || p.status === "error") es.close();
    };
}