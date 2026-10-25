import json
import queue
import uuid
from threading import Thread
from dataclasses import asdict

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse

from config import ORIGINS
from custom_types import DownloadProgress, YoutubeMetadata
from services import yt

app = FastAPI()
# /docs or /redoc for api documentation and testing

jobs: dict[str, queue.Queue] = {} # job_id -> queue of messages


class DownloadRequest(BaseModel):
    yt_ids: list[str]



app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# TODO: error catching

@app.get('/metadata')
async def metadata(url: str) -> list[dict]:
    """
    Get metadata from video or playlist
    """
    metadata = yt.get_metadata(url)

    return [asdict(i) for i in metadata]


@app.post('/downloads')
def start_downloads(body: DownloadRequest):
    """
    Start download of a video
    """

    job_id = str(uuid.uuid4())
    q = queue.Queue()
    jobs[job_id] = q # Store this queue with job id


    # progress hook for ytdlp
    def hook(progress: DownloadProgress):
        q.put(asdict(progress))


    def run():
        for vid in body.yt_ids:
            try:
                yt.download_audio(f"https://www.youtube.com/watch?v={vid}", hook)
                q.put({
                    "video_id": vid, 
                    "status": "done", 
                    "percent": 100,
                })
            except Exception as e:
                q.put({
                    "video_id": vid,
                    "status": "error",
                })
                print(f"Error downloading video with id {vid}: ", e)

        q.put({"status": "all_done"})  # no video_id: signals the end of the stream

    # Start download
    Thread(target=run, daemon=True).start()
    return {"job_id": job_id}


@app.get("/downloads/{job_id}/events")
def events(job_id: str):
    """
    Connect to event stream by job id
    """
    q = jobs.get(job_id)
    if q is None:
        raise HTTPException(404, "Unknown job")

    def stream():
            try:
                while True:
                    msg = q.get()
                    yield f"data: {json.dumps(msg)}\n\n"
                    if msg["status"] == "all_done":
                        break
            finally:
                jobs.pop(job_id, None)
    
    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )