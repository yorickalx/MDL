import type {TVideo} from "@/types.ts";


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