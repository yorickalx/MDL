import { useDownloads } from "@/stores/useDownloads";
import type {TDownloadProgress, TVideo} from "@/types.ts";
import apiFetch from "./apiFetch";


export type TVideoMetadataResponse = {thumbnail_url: string} & Omit<TVideo, "thumbnailUrl">;


export async function fetchMetadata(url: string): Promise<TVideo[]> {
    //TODO error handling

    const data: TVideoMetadataResponse[] = await apiFetch(`/metadata?url=${encodeURIComponent(url)}`);

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


export async function startDownload(videos: TVideo[]) {
    // Add each video to progress record
    videos.forEach(v => {
        const p: TDownloadProgress = {
            videoId: v.id,
            status: "queued",
            percent: 0,
            eta: null,
            speed: null,
        };

        useDownloads.getState().update(p);
    })


    // Start downloads
    const data = await apiFetch('/downloads', {
        method: "POST",
        body: { "yt_ids": videos.map(v => v.id) }
    });

    const jobId = data['job_id'];
    
    
    // Connect to events to get download progress
    const es = new EventSource(`http://localhost:8000/downloads/${jobId}/events`);
    es.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.status === "all_done") {
            es.close();
            return;
        }

        const p: TDownloadProgress = {
            videoId: data.video_id,
            status: data.status,
            percent: data.percent,
            eta: data.eta,
            speed: data.speed,
        };
        
        useDownloads.getState().update(p);

        es.onerror = () => es.close();
    };
}