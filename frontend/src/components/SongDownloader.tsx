import {URLInput} from "@/components/URLInput.tsx";
import {ItemGroup} from "@/components/ui/item.tsx";
import Video from "./Video.tsx";
import {useRef, useState} from "react";
import VideoSkeleton from "./VideoSkeleton.tsx";
import {fetchMetadata, startDownload} from "@/utils/youtube.ts";
import useVideos from "@/hooks/useVideos.ts";

export default function SongDownloader() {
    const urlInputRef = useRef<HTMLInputElement>(null);

    // const {videos, addVideo} = useVideos();
    const [showSkeleton, setShowSkeleton] = useState(false);

    const {videos, addVideo, addVideos} = useVideos();


    async function handleSubmit() {
        if (!urlInputRef.current?.value) return;
        const url: string = urlInputRef.current.value;

        setShowSkeleton(true);

        // Get metadata
        const metadata = await fetchMetadata(url);
       

        if (metadata.length > 1) { addVideos(metadata) } else { addVideo(metadata[0]) }
        setShowSkeleton(false);


        startDownload(metadata);
    }

    return (
        <>
            <URLInput ref={urlInputRef} onSubmit={handleSubmit}/>
            <ItemGroup>
                {
                    videos.map(video => (
                        <Video key={video.id} {...video}/>
                    ))
                }

                { showSkeleton && <VideoSkeleton/> }
            </ItemGroup>
        </>
    );
}