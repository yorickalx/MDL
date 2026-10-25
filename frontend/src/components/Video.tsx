
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";
import type { TDownloadProgress } from "@/types";
import { useDownloads } from "@/stores/useDownloads";
import DownloadStatus from "./DownloadStatus";

type VideoProps = {
    id: string,
    title: string,
    uploader: string,
    url: string,
    duration: number,
}

export default function Video({id, title, uploader, url, duration }: VideoProps) {
    
    const progress: TDownloadProgress = useDownloads(s => s.progress[id]);
   
    
    return (
        <Item variant="outline" role="listitem">
                <a href={url} target="_blank">
                    <ItemMedia variant="image">
                        <img
                            src={`https://i.ytimg.com/vi/${id}/sddefault.jpg`}
                            alt={title}
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    </ItemMedia>
                </a>

                <ItemContent>
                    <ItemTitle className="line-clamp-1">
                        {title}
                    </ItemTitle>
                    <ItemDescription>
                        {uploader}
                    </ItemDescription>
                </ItemContent>
                <ItemContent className="flex-none text-center">
                    <ItemDescription>
                        {formatDuration(duration)}
                    </ItemDescription>


                </ItemContent>

                <DownloadStatus progress={progress}/>
                
        </Item>
    );
}

function formatDuration(duration: number): string {
     
    return `${(duration / 60).toFixed(0)}:${duration % 60}`;
} 
