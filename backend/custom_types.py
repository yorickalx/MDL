from dataclasses import dataclass


@dataclass
class YoutubeMetadata:
    id: str
    title: str
    url: str
    duration: int
    thumbnail_url: str
    uploader: str


@dataclass
class DownloadProgress:
    video_id: str
    status: str
    percent: str
    eta: str
    speed: str