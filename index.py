"""FastAPI backend for the Jarvis resume chatbot, deployed as a Vercel
serverless function.

Reuses the same TF-IDF matching logic (`answer_question`) from
resume_chatbot.py that previously powered the Streamlit app. No API keys,
no external services — the whole thing runs in-process.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from resume_chatbot import answer_question

app = FastAPI()

# Same-origin requests (portfolio calling its own /api/ask) don't need CORS
# at all, but this is left permissive in case the widget is ever embedded
# elsewhere or tested from a different origin during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class Question(BaseModel):
    question: str


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": "Jarvis resume chatbot"}


@app.post("/api/ask")
def ask(payload: Question) -> dict:
    return {"answer": answer_question(payload.question)}
