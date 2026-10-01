import {URLInput} from "@/components/URLInput.tsx";
import {ItemGroup} from "@/components/ui/item.tsx";
import Video from "./Video.tsx";
import {useRef, useState} from "react";
import VideoSkeleton from "./VideoSkeleton.tsx";
import type {TDownloadProgress} from "@/types.ts";
import {fetchMetadata} from "@/utils/youtube.ts";
import useVideos from "@/hooks/useVideos.ts";

export default function SongDownloader() {
    const urlInputRef = useRef<HTMLInputElement>(null);

    // const {videos, addVideo} = useVideos();
    const [showSkeleton, setShowSkeleton] = useState(false);

    const {videos, addVideo, addVideos} = useVideos();
    const [progress, setProgress] = useState<Record<string, TDownloadProgress>>({}); // key is video id


    async function handleSubmit() {
        if (!urlInputRef.current?.value) return;
        const url: string = urlInputRef.current.value;

        setShowSkeleton(true);

        // Get metadata
        const metadata = await fetchMetadata(url);

        if (metadata.length > 1) { addVideos(metadata) } else { addVideo(metadata[0]) }
        setShowSkeleton(false);

        // Download audio
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
            
            setProgress(prev => ({ ...prev, [p.videoId]: p }));

            if (p.status === "done" || p.status === "error") es.close();
        };
    }

    return (
        <>
            <URLInput ref={urlInputRef} onSubmit={handleSubmit}/>
            <ItemGroup>
                {
                    videos.map(video => (
                        <Video key={video.id} progress={progress[video.id]} {...video}/>
                    ))
                }

                { showSkeleton && <VideoSkeleton/> }
            </ItemGroup>
        </>
    );
}