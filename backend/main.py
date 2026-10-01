import json
import queue
from threading import Thread
from dataclasses import asdict

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

from config import ORIGINS
from custom_types import DownloadProgress, YoutubeMetadata
from services.yt import get_metadata, download_audio

app = FastAPI()
# /docs or /redoc for api documentation and testing



app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: error catching

@app.get('/metadata')
async def metadata(url: str) -> list[dict]:
    """
    Get metadata from video or playlist
    """
    metadata = get_metadata(url)

    return [asdict(i) for i in metadata]



@app.get('/download')
def download(url: str):
    """
    Downloads video or playlist
    """

    q = queue.Queue()

    def hook(data: DownloadProgress):
        q.put(asdict(data))


    def run():
        try:
            download_audio(url, hook)
            q.put({"status": "done"})

        except Exception as e:
            q.put({"status": "error", "error": str(e)})


    def stream():
        Thread(target=run, daemon=True).start()
        while True:
            msg = q.get()
            yield f"data: {json.dumps(msg)}\n\n"
            if msg["status"] in ("done", "error"):
                break

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )
