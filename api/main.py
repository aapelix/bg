import io
from typing import Union

import numpy as np
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from rembg import remove

app = FastAPI()
app.add_middleware(
    CORSMiddleware,  # ty:ignore[invalid-argument-type]
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/remove-bg")
async def remove_bg(file: UploadFile):
    input_bytes = await file.read()
    img = Image.open(io.BytesIO(input_bytes))

    output: Union[Image.Image, np.ndarray, bytes] = remove(img)

    if isinstance(output, np.ndarray):
        output = Image.fromarray(output)
    elif isinstance(output, bytes):
        output = Image.open(io.BytesIO(output))

    buf = io.BytesIO()
    output.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
