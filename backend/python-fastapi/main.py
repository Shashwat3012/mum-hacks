import os
import time
import json
import typing
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from dotenv import load_dotenv


load_dotenv()

app = FastAPI(title="Deepfake Detection API", version="1.0")

@app.get("/")
async def hello():
    return "hello world"


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") 
genai.configure(api_key=GOOGLE_API_KEY)

# Use gemini-1.5-pro (or gemini-3.0-pro if available to you)
# 1.5 Pro is excellent for video analysis window and reasoning.
MODEL_NAME = os.getenv('MODEL_NAME')

def upload_to_gemini(path, mime_type=None):
    """Uploads the file to Gemini and waits for processing."""
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Upload complete: {file.uri}")
    
    while file.state.name == "PROCESSING":
        print("Processing video...", end='.', flush=True)
        time.sleep(2)
        file = genai.get_file(file.name)
        
    if file.state.name == "FAILED":
        raise ValueError("Video processing failed on Gemini side.")
        
    print(f"\nVideo ready: {file.state.name}")
    return file

# --- SYSTEM PROMPT ---
# We enforce strict JSON output in the prompt logic
ANALYSIS_PROMPT = """
You are an expert video forensics analyst specialized in deepfake detection. 
Analyze the attached video for signs of manipulation, specifically looking for:
1. Facial artifacts (blurring around mouth/jaw, inconsistent skin texture).
2. Lip-sync inconsistencies (mouth shape not matching phonemes).
3. Lighting/Shadow anomalies (face lighting distinct from background).
4. Audio-visual mismatch.

Identify the speaker if they are a public figure.
Transcribe the main message.

RETURN ONLY RAW JSON. Do not use Markdown code blocks (```
The JSON must follow this exact schema:
{
    "deepfake_label": "REAL" or "FAKE",
    "deepfake_score": float between 0.0 and 1.0 (where 1.0 is definitely fake),
    "speaker": "Name of speaker or Unknown",
    "transcript": "Full speech text",
    "evidence": ["List", "of", "specific", "visual/audio", "artifacts", "found"],
    "explanation": "A concise forensic summary of why this conclusion was reached."
}
"""

@app.post("/detect")
async def detect_deepfake(video: UploadFile = File(...)):

    temp_filename = f"temp_{video.filename}"
    
    try:
        # 1. Save uploaded file locally
        with open(temp_filename, "wb") as buffer:
            content = await video.read()
            buffer.write(content)
            
        # 2. Upload to Gemini
        print(f"Uploading {temp_filename} to AI...")
        gemini_file = upload_to_gemini(temp_filename, mime_type=video.content_type)
        
        # 3. Generate Analysis
        model = genai.GenerativeModel(model_name=MODEL_NAME)
        
        # Safety settings to prevent blocking on "harmful" content detection 
        # (Deepfakes can sometimes trigger safety filters)
        safety_settings = {
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
        }

        print("Running forensic analysis...")
        response = model.generate_content(
            [ANALYSIS_PROMPT, gemini_file],
            generation_config={"response_mime_type": "application/json"},
            safety_settings=safety_settings
        )
        
        # 4. Clean up cloud file to save storage
        genai.delete_file(gemini_file.name)
        
        # 5. Parse and Return
        result_json = json.loads(response.text)
        return JSONResponse(content=result_json)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up local file
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
