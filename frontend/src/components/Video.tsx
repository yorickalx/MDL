import {Progress} from "@/components/ui/progress.tsx";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item.tsx";

type VideoProps = {
    id: string,
    title: string,
    uploader: string,
    url: string,
    duration: string,
    progress?: number,
}

export default function Video({id, title, uploader, url, duration, progress = 0}: VideoProps) {
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
                    {duration}
                </ItemDescription>
            </ItemContent>
            <Progress value={progress}/>
        </Item>
    );
}