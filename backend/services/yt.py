import yt_dlp

from config import YDL_OPTIONS
from custom_types import YoutubeMetadata, DownloadProgress

def get_metadata(url: str) -> YoutubeMetadata | None:
    with yt_dlp.YoutubeDL() as ydl:
        info = ydl.extract_info(url, download=False)
        info = ydl.sanitize_info(info)

        return YoutubeMetadata(
            id=info['id'],
            title=info['title'],
            url=info['original_url'],
            duration=info['duration_string'],
            thumbnail_url=info['thumbnail'],
            uploader=info['uploader'],
        )


def download_audio(url: str, hook: function):
    ### Downloads audio and embeds the title and artist in metadata
    with yt_dlp.YoutubeDL(YDL_OPTIONS) as ydl:
        #TODO: send status and percent as response (and ETA/speed?)
        ydl.add_progress_hook(lambda x: hook(format_download_progress(x)))
        ydl.download([url])


def format_download_progress(ydl_data):

    return DownloadProgress(
        id = ydl_data['info_dict']['id'],
        status = ydl_data['status'],
        percent = ydl_data['_percent'],
        eta = ydl_data.get('eta'),
        speed = ydl_data.get('speed'),
    )

