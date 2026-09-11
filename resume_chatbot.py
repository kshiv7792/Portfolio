

from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from dataclasses import dataclass

from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from sklearn.metrics.pairwise import cosine_similarity


@dataclass(frozen=True)
class ResumeAnswer:
    question: str
    answer: str
    keywords: frozenset[str]


ANSWERS = [
    ResumeAnswer(
        "What is Shiv's current job?",
        "Shiv is an AI Developer at Yokogawa in Bangalore, working on Generative AI, machine learning and enterprise knowledge systems.",
        frozenset({"current", "job", "role", "work", "yokogawa", "developer"}),
    ),
    ResumeAnswer(
        "How much experience does Shiv have?",
        "Shiv has over four years of experience across enterprise AI, fintech, consulting, industrial automation and data analytics.",
        frozenset({"experience", "years", "career", "background"}),
    ),
    ResumeAnswer(
        "What does Shiv do at Yokogawa?",
        "At Yokogawa, Shiv leads AI-powered knowledge systems, including SmartChat, and deploys retrieval-augmented systems across product and support teams.",
        frozenset({"yokogawa", "responsibilities", "doing", "leads", "knowledge", "systems"}),
    ),
    ResumeAnswer(
        "What is SmartChat?",
        "SmartChat is an enterprise LLM assistant using retrieval-augmented generation, Azure Cognitive Search and prompt frameworks to provide citation-backed answers over engineering documentation.",
        frozenset({"smartchat", "llm", "rag", "retrieval", "assistant", "documentation"}),
    ),
    ResumeAnswer(
        "What deployments has Shiv done?",
        "Shiv has deployed retrieval-augmented AI systems across Yokogawa product and support teams. His stack includes Azure, AWS, GCP, Heroku, Docker, Kubernetes and REST APIs.",
        frozenset({"deployment", "deployments", "deployed", "production", "cloud", "infrastructure"}),
    ),
    ResumeAnswer(
        "What is Shiv's technology stack?",
        "His stack includes Python, R, SQL, C++, Advanced Excel, GenAI, NLP, regression, classification, clustering, time series, PySpark, REST APIs, Docker, Kubernetes, Azure, AWS, GCP, Heroku, Power BI and Tableau.",
        frozenset({"skills", "technology", "tech", "stack", "python", "sql", "cloud", "tools", "languages", "framework", "frameworks"}),
    ),
    ResumeAnswer(
        "What did Shiv do at TechPay.AI?",
        "At TechPay.AI, Shiv developed ML models that improved financial data analysis accuracy by 30%, integrated AI solutions that lifted operational efficiency by 20%, and automated Power BI dashboards.",
        frozenset({"techpay", "financial", "finance", "accuracy", "efficiency", "dashboard"}),
    ),
    ResumeAnswer(
        "What did Shiv do at AiSPRY and 360DigiTMG?",
        "At AiSPRY / 360DigiTMG, Shiv led data science projects and built models using Azure, GCP, Heroku, SQL, Python, Power BI and PySpark.",
        frozenset({"aispry", "360digitmg", "consultant", "malaysia", "heroku"}),
    ),
    ResumeAnswer(
        "What did Shiv do at KPMG?",
        "As a Data Analyst Intern at KPMG in Hyderabad, Shiv analyzed datasets with Python, R and Excel and produced Tableau and Power BI reports.",
        frozenset({"kpmg", "intern", "analyst", "hyderabad", "reports"}),
    ),
    ResumeAnswer(
        "What are Shiv's main projects?",
        "Shiv has shipped 9 projects: SmartChat, Vision & Voice GenAI Chatbot, Image-to-Text Processing, Medical Inventory Optimization, Mental Health & Wellbeing Analysis, Pharmacy Credit Scoring, Wind Turbine Failure Prediction, Steel Rod Inventory System and Plant Health Monitoring.",
        frozenset({"projects", "project", "shipped", "portfolio", "built", "build", "made", "created"}),
    ),
    ResumeAnswer(
        "Tell me about the Vision and Voice chatbot.",
        "It is a multimodal chatbot combining image understanding and generated voice responses for conversational, image-aware interactions.",
        frozenset({"vision", "voice", "multimodal", "chatbot"}),
    ),
    ResumeAnswer(
        "Tell me about Image-to-Text Processing.",
        "It converts scanned or photographed documents into structured, searchable text for downstream automation and indexing pipelines.",
        frozenset({"image", "text", "ocr", "processing", "documents"}),
    ),
    ResumeAnswer(
        "Which forecasting projects did Shiv build?",
        "His forecasting work includes Medical Inventory Optimization and the Steel Rod Inventory System. These projects forecast demand and support better stock decisions.",
        frozenset({"forecasting", "forecast", "inventory", "medical", "steel", "demand"}),
    ),
    ResumeAnswer(
        "Tell me about Wind Turbine Failure Prediction.",
        "It is a predictive maintenance model that uses turbine sensor data to flag likely failures early and shift maintenance from reactive to scheduled.",
        frozenset({"wind", "turbine", "failure", "predictive", "maintenance", "sensor"}),
    ),
    ResumeAnswer(
        "What classical ML projects has Shiv done?",
        "His classical ML work includes Pharmacy Credit Scoring using classification and risk scoring, plus Mental Health & Wellbeing Analysis using statistical and survey data.",
        frozenset({"classical", "machine", "ml", "classification", "credit", "risk", "mental", "health"}),
    ),
    ResumeAnswer(
        "What is Shiv's education?",
        "Shiv completed a B.Tech in Computer Science & Engineering at Millia Institute of Technology from 2017 to 2021, with a CGPA of 8.3 and a focus on Data Science & Analysis.",
        frozenset({"education", "degree", "btech", "college", "cgpa", "study"}),
    ),
    ResumeAnswer(
        "What certifications does Shiv have?",
        "His certifications include Data Science using Python and Python 101 for Data Science from IBM, Generative AI from Great Learning Academy, Data Science and Python Fundamentals from NASSCOM FutureSkills, plus Tableau and Power BI visualization certifications from 360DigiTMG.",
        frozenset({"certification", "certifications", "certificate", "certified", "ibm", "nasscom", "learning", "qualification", "qualifications"}),
    ),
    ResumeAnswer(
        "Where is Shiv based?",
        "Shiv is based in Bangalore, India.",
        frozenset({"location", "based", "bangalore", "india", "city", "live", "lives", "stay", "stays", "residing", "residence"}),
    ),
    ResumeAnswer(
        "How can I contact Shiv?",
        "You can contact Shiv at kshiv7792@gmail.com, +91 97711 71907, or through LinkedIn at linkedin.com/in/shiv-k-paswan/.",
        frozenset({"contact", "email", "phone", "linkedin", "reach", "touch", "connect"}),
    ),
    ResumeAnswer(
        "What kind of AI work does Shiv prefer?",
        "Shiv focuses on applied AI that holds up in production: Generative AI assistants, retrieval systems, forecasting, classification, financial analytics and operational decision support.",
        frozenset({"focus", "prefer", "ai", "genai", "applied", "production"}),
    ),
    
]


OUT_OF_SCOPE_RESPONSE = "That's not related to Shiv's work."

# Similarity below this is treated as "no good match" -> out-of-scope response.
# Tune this: raise it if irrelevant questions get answered, lower it if valid
# questions get rejected.
SIMILARITY_THRESHOLD = 0.10

# sklearn's built-in English stopword list is missing a few words that are
# very common across our questions ("tell", "shiv") and would otherwise leak
# through as false-positive matching signal, so we extend it.
_STOP_WORDS = list(ENGLISH_STOP_WORDS.union({"tell", "shiv"}))

# Build a searchable text per answer: question (x2) + keywords (x2) + answer.
# Question/keywords are repeated to weight them higher than the answer body,
# since the answer body can contain incidental words (e.g. "Institute of
# Technology" in the education answer) that would otherwise cause false
# matches on unrelated queries like "what tech does he use".
_CORPUS = [
    f"{item.question} {item.question} "
    f"{' '.join(item.keywords)} {' '.join(item.keywords)} "
    f"{item.answer}"
    for item in ANSWERS
]

_VECTORIZER = TfidfVectorizer(
    lowercase=True,
    stop_words=_STOP_WORDS,
    ngram_range=(1, 2),  # unigrams + bigrams for better phrase-level matching
)
_ANSWER_VECTORS = _VECTORIZER.fit_transform(_CORPUS)


def answer_question(question: str) -> str:
    """Return the best resume answer using TF-IDF cosine similarity."""
    question = question.strip()
    if not question:
        return OUT_OF_SCOPE_RESPONSE

    if question.casefold().rstrip("?") in {"what do you do", "what does shiv do"}:
        return ANSWERS[0].answer

    query_vector = _VECTORIZER.transform([question])
    similarities = cosine_similarity(query_vector, _ANSWER_VECTORS)[0]

    best_index = similarities.argmax()
    best_score = similarities[best_index]

    if best_score < SIMILARITY_THRESHOLD:
        return OUT_OF_SCOPE_RESPONSE

    return ANSWERS[best_index].answer


def run_chat() -> None:
    """Run the chatbot in the terminal until the user exits."""
    print("Jarvis resume chatbot. Ask about Shiv's work or type 'exit' to quit.")
    while True:
        question = input("\nYou: ").strip()
        if question.lower() in {"exit", "quit", "q"}:
            print("Jarvis: Goodbye.")
            break
        print(f"Jarvis: {answer_question(question)}")


class ChatRequestHandler(BaseHTTPRequestHandler):
    """Small local API used by the portfolio Jarvis widget."""

    def _send_json(self, payload: dict[str, str], status: int = 200) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self) -> None:
        if self.path in {"/", "/health"}:
            self._send_json({"status": "ok", "service": "Jarvis resume chatbot", "endpoint": "/ask"})
            return
        self._send_json({"error": "Not found"}, 404)

    def do_POST(self) -> None:
        if self.path != "/ask":
            self._send_json({"error": "Not found"}, 404)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            data = json.loads(self.rfile.read(length).decode("utf-8"))
            question = str(data.get("question", "")).strip()
        except (ValueError, json.JSONDecodeError):
            self._send_json({"error": "Invalid JSON"}, 400)
            return
        self._send_json({"answer": answer_question(question)})

    def log_message(self, format: str, *args: object) -> None:
        return


def run_api() -> None:
    """Serve the semantic (TF-IDF) chatbot to the portfolio UI."""
    server = ThreadingHTTPServer(("127.0.0.1", 8765), ChatRequestHandler)
    print("Jarvis API running at http://127.0.0.1:8765")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nJarvis API stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    if "--server" in sys.argv:
        run_api()
    else:
        run_chat()