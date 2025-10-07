from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from . import db
from .schemas import Alert, TimelineEvent, SearchResult, PredictRequest, PredictResponse, SchemaSummary


app = FastAPI(title="Campus ER & Security API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.get("/alerts", response_model=List[Alert])
def get_alerts(entity_id: Optional[str] = Query(None), hours: int = Query(12, ge=1, le=168)):
    try:
        return db.fetch_alerts(entity_id=entity_id, hours=hours)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/timeline", response_model=List[TimelineEvent])
def get_timeline(
    entity_id: str = Query(...),
    from_ts: Optional[str] = Query(None, alias="from"),
    to_ts: Optional[str] = Query(None, alias="to"),
):
    try:
        return db.fetch_timeline(entity_id=entity_id, from_ts=from_ts, to_ts=to_ts)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/search", response_model=List[SearchResult])
def search(q: str = Query(..., min_length=1, max_length=128)):
    try:
        return db.search_entities(q)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/predict", response_model=PredictResponse)
def predict(body: PredictRequest):
    try:
        return db.predict_state(entity_id=body.entity_id, timestamp=body.timestamp)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/schema", response_model=SchemaSummary)
def schema(sample_rows: int = 3):
    try:
        return db.get_schema_summary(sample_rows=sample_rows)
    except Exception as exc:  # pragma: no cover
        raise HTTPException(status_code=500, detail=str(exc))


