import {Progress} from "@/components/ui/progress.tsx";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle, ItemFooter} from "@/components/ui/item.tsx";
import type { TDownloadProgress } from "@/types";
import { useDownloads } from "@/stores/useDownloads";

type VideoProps = {
    id: string,
    title: string,
    uploader: string,
    url: string,
    duration: number,
}

export default function Video({id, title, uploader, url, duration }: VideoProps) {
    
    const progress: TDownloadProgress = useDownloads(s => s.progress[id]);

    console.log(progress);
    
    
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
                <ItemFooter>
                    { progress && <Progress value={progress.percent}/> }
                    <span className="">
                        { progress?.speed && formatDownloadSpeed(progress.speed)}
                    </span>
                </ItemFooter>
             {/* TODO: show ETA and speed */}
             
        </Item>
    );
}

function formatDuration(duration: number): string {
     
    return `${(duration / 60).toFixed(0)}:${duration % 60}`;
} 

function formatDownloadSpeed(speed: number): string { // bytes/second -> KB/s or MB/s
    const formatted = speed.toFixed(0) // remove decimals

    if (formatted.length > 6) {
        return (Number(formatted) / 1000000).toFixed(2) + "MB/s";
    }

    // default to kb
    return (Number(formatted) / 1000).toFixed(2) + "KB/s";


}