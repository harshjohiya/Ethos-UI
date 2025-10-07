"""
FastAPI app that exposes a timeline endpoint backed by PostgreSQL.

Requirements implemented:
1) Connect to PostgreSQL using psycopg2 (via a simple connection factory).
2) Query the unified view `unified_events` joined with `entity_resolution_map`.
3) Exposes GET /timeline/{canonical_id}.
4) Returns JSON with canonical_entity_id and an ordered list of events, each with
   source, original_id, location_id, timestamp (ISO 8601), provenance (parsed JSON).
5) Returns 404 if canonical_id does not exist in the join results.
6) Includes comments explaining each part.
7) Includes instructions to run using uvicorn (see bottom of file).
"""

from __future__ import annotations

import json
import os
from typing import Any, Dict, List, Optional

import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from fastapi import FastAPI, HTTPException


app = FastAPI(title="Entity Timeline API")

# Global connection pool (initialized on startup)
CONNECTION_POOL: Optional[SimpleConnectionPool] = None


def init_connection_pool() -> None:
    """
    Initialize a global psycopg2 SimpleConnectionPool.

    Supports either a DSN string via PG_DSN or discrete env vars.
    Configure pool sizes via POOL_MINCONN and POOL_MAXCONN.
    """
    global CONNECTION_POOL
    if CONNECTION_POOL is not None:
        return

    dsn = os.getenv("PG_DSN")
    minconn = int(os.getenv("POOL_MINCONN", "1"))
    maxconn = int(os.getenv("POOL_MAXCONN", "5"))

    if dsn:
        CONNECTION_POOL = SimpleConnectionPool(minconn, maxconn, dsn=dsn)
        return

    host = os.getenv("PGHOST", "localhost")
    port = int(os.getenv("PGPORT", "5432"))
    dbname = os.getenv("PGDATABASE", "postgres")
    user = os.getenv("PGUSER", "postgres")
    password = os.getenv("PGPASSWORD", "")

    CONNECTION_POOL = SimpleConnectionPool(
        minconn,
        maxconn,
        host=host,
        port=port,
        dbname=dbname,
        user=user,
        password=password,
    )


@app.on_event("startup")
def _on_startup() -> None:
    """Create the connection pool on startup."""
    init_connection_pool()


@app.on_event("shutdown")
def _on_shutdown() -> None:
    """Close the connection pool on shutdown."""
    global CONNECTION_POOL
    if CONNECTION_POOL is not None:
        CONNECTION_POOL.closeall()
        CONNECTION_POOL = None


@app.get("/timeline/{canonical_id}")
def get_timeline(canonical_id: str) -> Dict[str, Any]:
    """
    Return a chronological timeline for a canonical entity.

    The query joins `unified_events` (event stream) with `entity_resolution_map`
    to map original source IDs to the canonical entity. Results are ordered by
    event timestamp ascending.
    """
    # Open a short-lived connection per request. For higher throughput, consider
    # a connection pool (e.g., psycopg2.pool.SimpleConnectionPool).
    try:
        if CONNECTION_POOL is None:
            init_connection_pool()
        if CONNECTION_POOL is None:
            raise RuntimeError("Database connection pool is not initialized")
        conn = CONNECTION_POOL.getconn()
    except Exception as exc:
        # Surface connection issues as 500 errors
        raise HTTPException(status_code=500, detail=f"Database connection error: {exc}")

    try:
        with conn.cursor() as cur:
            query = """
                SELECT
                    ue.source,
                    ue.id AS original_id,
                    ue.location_id,
                    ue.timestamp,
                    erm.provenance
                FROM unified_events ue
                JOIN entity_resolution_map erm
                    ON ue.entity_key = erm.source_id
                WHERE erm.canonical_entity_id = %s
                ORDER BY ue.timestamp ASC
            """
            cur.execute(query, (canonical_id,))
            rows = cur.fetchall()

            if not rows:
                # No events found for this canonical_id
                raise HTTPException(status_code=404, detail="Canonical entity not found")

            timeline: List[Dict[str, Any]] = []
            for source, original_id, location_id, ts, provenance in rows:
                # Ensure ISO 8601 format for timestamp; psycopg2 returns datetime
                # objects which have .isoformat()
                timeline.append(
                    {
                        "source": source,
                        "original_id": original_id,
                        "location_id": location_id,
                        "timestamp": ts.isoformat() if ts else None,
                        # Parse JSON provenance if present, otherwise None
                        "provenance": json.loads(provenance) if provenance else None,
                    }
                )

            return {"canonical_entity_id": canonical_id, "timeline": timeline}
    finally:
        # Always return the connection to the pool
        try:
            if CONNECTION_POOL is not None:
                CONNECTION_POOL.putconn(conn)
            else:
                conn.close()
        except Exception:
            pass


"""
How to run (Windows PowerShell):

1) Create and activate a virtual environment, then install dependencies:

   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   python -m pip install --upgrade pip
   pip install fastapi uvicorn psycopg2-binary

2) Set your PostgreSQL environment variables (example):

   $Env:PGHOST = "localhost"
   $Env:PGPORT = "5432"
   $Env:PGDATABASE = "your_db"
   $Env:PGUSER = "your_user"
   $Env:PGPASSWORD = "your_password"

   # OR provide a full DSN instead of the discrete vars:
   # $Env:PG_DSN = "host=localhost port=5432 dbname=your_db user=your_user password=your_password"

   # Optional pool sizing (defaults: 1..5)
   # $Env:POOL_MINCONN = "1"
   # $Env:POOL_MAXCONN = "5"

3) Start the server:

   uvicorn timeline_api:app --reload --host 0.0.0.0 --port 8000

Then open http://localhost:8000/timeline/{canonical_id}
"""

