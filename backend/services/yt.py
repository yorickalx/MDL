import yt_dlp

from backend.config import YDL_OPTIONS
from backend.types import DownloadMetadata


def get_metadata(url: str) -> DownloadMetadata | None:
    with yt_dlp.YoutubeDL() as ydl:
        info = ydl.extract_info(url, download=False)
        info = ydl.sanitize_info(info)

        return DownloadMetadata(
            id=info['id'],
            title=info['title'],
            url=info['original_url'],
            duration=info['duration_string'],
            thumbnail_url=info['thumbnail'],
            uploader=info['uploader'],
        )


def download_audio(url: str):
    with yt_dlp.YoutubeDL(YDL_OPTIONS) as ydl:
        #TODO: send status and percent as response (and ETA/speed?)
        ydl.add_progress_hook(lambda x: print(x['status'], x['_percent']))
        ydl.download([url])
