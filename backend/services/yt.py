import yt_dlp

from config import YDL_OPTIONS
from custom_types import YoutubeMetadata, DownloadProgress

def get_metadata(url: str) -> list[YoutubeMetadata]:
    """
    Returns metadata of single video or video's inside a playlist
    """
    with yt_dlp.YoutubeDL({"skip_download": True, "extract_flat": True}) as ydl:
        info = ydl.extract_info(url, download=False)
        info = ydl.sanitize_info(info)

        # If it's a playlist
        if info.get('entries'):
            entries = info.get('entries')
            result = []
            for entry in entries:
                result.append(
                    format_metadata(entry)
                )

            return result

        # Single video
        return [ format_metadata(info) ]
            


def format_metadata(ydl_data) -> YoutubeMetadata:
    return YoutubeMetadata(
        id=ydl_data['id'],
        title=ydl_data['title'],
        url=ydl_data['url'],
        duration=ydl_data['duration'],
        thumbnail_url=ydl_data['thumbnails'][-1]['url'], # highest resolution
        uploader=ydl_data['uploader'],
    )


def download_audio(url: str, hook: function):
    """
    Downloads audio and embeds the title and artist in metadata
    """
    with yt_dlp.YoutubeDL(YDL_OPTIONS) as ydl:
        ydl.add_progress_hook(lambda x: hook(format_download_progress(x)))
        ydl.download([url])


def format_download_progress(ydl_data) -> DownloadProgress:

    return DownloadProgress(
        id = ydl_data['info_dict']['id'],
        status = ydl_data['status'],
        percent = ydl_data['_percent'],
        eta = ydl_data.get('eta'),
        speed = ydl_data.get('speed'),
    )

