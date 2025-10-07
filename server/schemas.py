from pydantic import BaseModel, RootModel
from typing import Optional
from typing import Dict, Any


class Alert(BaseModel):
    id: Optional[int] = None
    entity_id: Optional[str] = None
    type: Optional[str] = None
    severity: Optional[str] = None
    message: Optional[str] = None
    timestamp: Optional[str] = None


class TimelineEvent(BaseModel):
    source: str
    timestamp: str
    # Optional contextual fields; present if available
    entity_id: Optional[str] = None
    location_id: Optional[str] = None
    card_id: Optional[str] = None
    ap_id: Optional[str] = None
    device_hash: Optional[str] = None
    item_id: Optional[str] = None
    room_id: Optional[str] = None
    description: Optional[str] = None


class SearchResult(BaseModel):
    entity_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    card_id: Optional[str] = None
    device_hash: Optional[str] = None


class PredictRequest(BaseModel):
    entity_id: str
    timestamp: Optional[str] = None


class PredictResponse(BaseModel):
    entity_id: str
    prediction: Optional[str]
    explanation: str


class SchemaTableSummary(BaseModel):
    columns: list[str]
    count: int
    sample: list[Dict[str, Any]]

class SchemaSummary(RootModel[Dict[str, SchemaTableSummary]]):
    pass


