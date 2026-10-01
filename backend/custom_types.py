from dataclasses import dataclass


@dataclass
class YoutubeMetadata:
    id: str
    title: str
    url: str
    duration: str
    thumbnail_url: str
    uploader: str


@dataclass
class DownloadProgress:
    id: str
    status: str
    percent: str
    eta: str
    speed: str