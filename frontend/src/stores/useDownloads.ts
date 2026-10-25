import type { TDownloadProgress } from "@/types";
import { create } from "zustand";

type DownloadsState = {
    progress: Record<string, TDownloadProgress>; // key is video id
    update: (p: TDownloadProgress) => void;
    remove: (videoId: string) => void;
}

export const useDownloads = create<DownloadsState>(set => ({
    progress: {},

    update: p =>
        set(state => ({
            progress: { ...state.progress, [p.videoId]: p },
        })),

    remove: videoId => 
        set(state => {
            const { [videoId]: _, ...rest } = state.progress; // unpack
            return {progress: rest};
        }),
}));