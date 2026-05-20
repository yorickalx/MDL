from dataclasses import dataclass


@dataclass
class DownloadMetadata:
    id: str
    title: str
    url: str
    duration: str
    thumbnail_url: str
    uploader: str