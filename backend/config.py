from pathlib import Path

from dotenv import load_dotenv
from os import getenv

load_dotenv(dotenv_path=Path(__file__).parent / ".env")
# CORS
ORIGINS = [o for o in getenv("CORS_ORIGINS", "").split(",") if o]

# PATHS
DATA_FOLDER = Path(__file__).parent / "data"
DATA_FOLDER.mkdir(parents=True, exist_ok=True)

DOWNLOAD_PATH = DATA_FOLDER / "downloads"
DOWNLOAD_PATH.mkdir(parents=True, exist_ok=True)

DOWNLOAD_ARCHIVE_PATH = DATA_FOLDER / "download_archive.txt"
DOWNLOAD_ARCHIVE_PATH.touch(exist_ok=True)

SKIP_ALREADY_DOWNLOADED = True if getenv("SKIP_ALREADY_DOWNLOADED") == "true" else False

YDL_OPTIONS = {
    "format": "bestaudio/best",
    "postprocessors": [{
        "key": "FFmpegExtractAudio",
    }],
    "outtmpl": "%(uploader)s - %(title)s.%(ext)s",
    "download_archive": DOWNLOAD_ARCHIVE_PATH if SKIP_ALREADY_DOWNLOADED else None,
    "sleep_interval": 2,        # seconds between requests
    "max_sleep_interval": 5,
    "paths": {
        "home":str(DOWNLOAD_PATH)
    },

    "embed_metadata": True,
    # "no_embed_chapters": True,
    # "embed_thumbnail": True,
}