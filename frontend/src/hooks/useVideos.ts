import {useState} from "react";
import type {TVideo} from "@/types.ts";

export default function useVideos() {
    const [videos, setVideos] = useState<TVideo[]>([]);

    // Only add unique videos
    function addVideo(newVideo: TVideo): void {
        setVideos(v => v.some(x => x.id === newVideo.id) ? v : [...v, newVideo]);
    }

    // Only add unique videos
    function addVideos(newVideos: TVideo[]): void {
        setVideos(v => {
            const existing = new Set(v.map(x => x.id));
            const fresh = newVideos.filter(x => !existing.has(x.id));
            return fresh.length ? [...v, ...fresh] : v;
        });
    }

    // function updateVideoProgress(videoId: string, progress: number) {
    //     setVideos(prev => prev.map(v => v.id === videoId ? {...v, progress: progress} : v));
    // }

    return {videos, addVideo, addVideos};
}