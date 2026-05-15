import SongDownloader from "@/components/SongDownloader.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export default function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <SongDownloader/>
            </ThemeProvider>
        </>
    );
}