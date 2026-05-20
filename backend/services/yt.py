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

