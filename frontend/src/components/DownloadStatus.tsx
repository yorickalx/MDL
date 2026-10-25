import type { TDownloadProgress } from "@/types";
import {Progress} from "@/components/ui/progress.tsx";
import { ItemFooter } from "@/components/ui/item";
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, Download02Icon, LoaderIcon } from "@hugeicons/core-free-icons";

export default function DownloadStatus({ progress }: { progress: TDownloadProgress }) {

    switch (progress.status) {
        case "queued":
            return (
                <div className="border-l p-2 pl-4">
                    <HugeiconsIcon icon={Clock01Icon} />
                </div>
            );

        case "downloading":
            return (
                <>
                    <div className="border-l p-2 pl-4">
                        <HugeiconsIcon icon={LoaderIcon} className="animate-spin" />
                    </div>

                    <ItemFooter>
                        <Progress value={progress.percent}/>
                        <p className="text-muted-foreground">
                            {/* { progress?.speed && formatDownloadSpeed(progress.speed)}  */}
                            { progress?.eta && progress.eta + "s left"}
                        </p>
                    </ItemFooter>
                </>
            );
        
        case "finished":
            return (
                <div className="border-l p-2 pl-4">
                    <HugeiconsIcon icon={Download02Icon}/>
                </div>
            );
    
        default:
            return null;
    }
}


// function formatDownloadSpeed(speed: number): string { // bytes/second -> KB/s or MB/s
//     const formatted = speed.toFixed(0) // remove decimals

//     if (formatted.length > 6) {
//         return (Number(formatted) / 1000000).toFixed(2) + "MB/s";
//     }

//     // default to kb
//     return (Number(formatted) / 1000).toFixed(2) + "KB/s";
// }