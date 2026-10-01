import {Progress} from "@/components/ui/progress.tsx";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";
import type { TDownloadProgress } from "@/types";

type VideoProps = {
    id: string,
    title: string,
    uploader: string,
    url: string,
    duration: number,
    progress?: TDownloadProgress
}

export default function Video({id, title, uploader, url, duration, progress }: VideoProps) {
    
    console.log("in vid ", progress);
    
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
             {/* TODO: show ETA and speed */}
            { progress && <Progress value={progress.percent}/>}
        </Item>
    );
}

function formatDuration(duration: number): string {
     
    return `${(duration / 60).toFixed(0)}:${duration % 60}`;
} 