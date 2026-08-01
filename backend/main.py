import asyncio
import json

from fastapi import FastAPI, Request
from pytubefix import Playlist, YouTube
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from starlette.websockets import WebSocket, WebSocketDisconnect

from backend.config import DOWNLOAD_PATH, ORIGINS
from backend.services.youtube import download_video_audio, get_video_metadata, \
    create_progress_callback
from backend.services.yt import get_metadata, download_audio

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

@app.get('/metadata/video')
async def get_metadata_video(url):
    return get_metadata(url)


async def stream_playlist_metadata(playlist: Playlist):

    tasks = [asyncio.to_thread(get_metadata, video.watch_url) for video in playlist.videos]

    yield json.dumps({'length': playlist.length }) + '\n'

    for coro in asyncio.as_completed(tasks):
        metadata = await coro

        yield json.dumps(metadata.__dict__) + '\n'


@app.get('/metadata/playlist')
async def get_metadata_playlist(url):
    playlist = Playlist(url)

    return StreamingResponse(
        stream_playlist_metadata(playlist),
        media_type="application/x-ndjson",
    )


@app.post('/download/video')
async def download_video(request: Request):
    try:
        req = await request.json()
        url = req['url']

        download_audio(url)

        return {"success": True}

    except Exception as e:
        return {"error": str(e)}


@app.websocket('/ws/download/video')
async def ws_download_video(websocket: WebSocket):
    await websocket.accept()

    try:
        url = await websocket.receive_text()

        yt = YouTube(url)
        metadata = get_video_metadata(yt)

        on_progress = create_progress_callback(metadata['id'], websocket)
        await download_video_audio(url, on_progress)

        await websocket.send_json({
            'type': 'progress',
            'data': {
                'value': 100,
                'id': metadata['id'],
            }
        })

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"error": str(e)})


@app.websocket('/ws/download/playlist')
async def download(websocket: WebSocket):
    await websocket.accept()

    try:
        url = await websocket.receive_text()

        playlist = Playlist(url)
        print(f"Playlist : {playlist.title} ({playlist.length} videos)")

        # Start download
        downloaded_files = []
        for index, video in enumerate(playlist.videos):
            try:
                print(f"[{index + 1}/{playlist.length}]")

                on_progress = create_progress_callback(video.video_id, websocket)
                path = await download_video_audio(video.watch_url, on_progress)

                await websocket.send_json({
                    'type': 'progress',
                    'data': {
                        'value': 100,
                        'id': video.video_id,
                    }
                })

                downloaded_files.append(path)
            except Exception as e:
                print(f"    Skipped '{video.title}' ({video.watch_url}): {e}")
                # TODO: send error through websocket

        print(f"\nDone — {len(downloaded_files)} file(s) saved to: {DOWNLOAD_PATH}")


    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"error": str(e)})


