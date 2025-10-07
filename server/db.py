import os
import sqlite3
from typing import Any, Dict, List, Optional


DB_PATH = os.getenv("CAMPUS_DB_PATH", r"D:\Ethos\UI\Ethos-UI\New folder\campus_er.db")


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _table_exists(conn: sqlite3.Connection, table: str) -> bool:
    cur = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
    )
    return cur.fetchone() is not None


def _rows_to_dicts(rows: List[sqlite3.Row]) -> List[Dict[str, Any]]:
    return [dict(r) for r in rows]


def fetch_alerts(entity_id: Optional[str], hours: int) -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        if _table_exists(conn, "alerts"):
            params: List[Any] = []
            sql = "SELECT * FROM alerts"
            filters: List[str] = []
            if entity_id:
                filters.append("entity_id = ?")
                params.append(entity_id)
            # if alerts has timestamp column, filter by last N hours
            if _has_column(conn, "alerts", "timestamp"):
                filters.append("timestamp >= datetime('now', ?) ")
                params.append(f"-{hours} hours")
            if filters:
                sql += " WHERE " + " AND ".join(filters)
            sql += " ORDER BY timestamp DESC LIMIT 500"
            rows = conn.execute(sql, params).fetchall()
            return _rows_to_dicts(rows)
        return []
    finally:
        conn.close()


def fetch_timeline(entity_id: str, from_ts: Optional[str], to_ts: Optional[str]) -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        # Build a union of known activity tables if present
        parts: List[str] = []
        params: List[Any] = []

        def add_part(table: str, ts_col: str, label: str, cols: List[str]):
            if _table_exists(conn, table) and _has_column(conn, table, ts_col):
                select_cols = ", ".join([c for c in cols if _has_column(conn, table, c)])
                parts.append(
                    f"SELECT '{label}' AS source, {select_cols}, {ts_col} AS timestamp FROM {table} WHERE entity_id = ?"
                )
                params.append(entity_id)

        add_part("swipe_logs", "timestamp", "swipe", ["location_id", "card_id", "entity_id"])  # common
        add_part("wifi_logs", "timestamp", "wifi", ["ap_id", "device_hash", "entity_id"])        # common
        add_part("library_checkouts", "timestamp", "library", ["item_id", "entity_id"])           # common
        add_part("bookings", "timestamp", "booking", ["room_id", "entity_id"])                   # common
        add_part("events", "timestamp", "event", ["description", "entity_id"])                  # fallback

        if not parts:
            return []

        sql = " UNION ALL ".join(parts)
        time_filters: List[str] = []
        if from_ts:
            time_filters.append("timestamp >= ?")
            params.append(from_ts)
        if to_ts:
            time_filters.append("timestamp <= ?")
            params.append(to_ts)
        if time_filters:
            sql = f"SELECT * FROM ( {sql} ) WHERE " + " AND ".join(time_filters)
        sql += " ORDER BY timestamp ASC LIMIT 2000"

        rows = conn.execute(sql, params).fetchall()
        return _rows_to_dicts(rows)
    finally:
        conn.close()


def search_entities(q: str) -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        # Try common identity tables in order
        for table in ["entities", "profiles", "students", "staff"]:
            if _table_exists(conn, table):
                cols = _existing_columns(conn, table, ["entity_id", "name", "email", "card_id", "device_hash"])
                if not cols:
                    continue
                like_cols = [c for c in cols if c != "entity_id"]
                if not like_cols:
                    continue
                where = " OR ".join([f"{c} LIKE ?" for c in like_cols])
                params = [f"%{q}%" for _ in like_cols]
                sql = f"SELECT {', '.join(cols)} FROM {table} WHERE {where} LIMIT 50"
                rows = conn.execute(sql, params).fetchall()
                if rows:
                    return _rows_to_dicts(rows)
        return []
    finally:
        conn.close()


def predict_state(entity_id: str, timestamp: Optional[str]) -> Dict[str, Any]:
    conn = _connect()
    try:
        # Heuristic: last seen activity across known tables becomes predicted state
        candidates: List[str] = []
        params: List[Any] = []
        def add_last_seen(table: str, ts_col: str, state_expr: str):
            if _table_exists(conn, table) and _has_column(conn, table, ts_col):
                candidates.append(
                    f"SELECT {ts_col} AS timestamp, {state_expr} AS state, '{table}' AS source FROM {table} WHERE entity_id = ?"
                )
                params.append(entity_id)

        add_last_seen("swipe_logs", "timestamp", "location_id")
        add_last_seen("wifi_logs", "timestamp", "ap_id")
        add_last_seen("bookings", "timestamp", "room_id")

        if not candidates:
            return {"entity_id": entity_id, "prediction": None, "explanation": "No activity tables found."}

        union_sql = " UNION ALL "+" UNION ALL ".join(candidates)
        if timestamp:
            union_sql = f"SELECT * FROM ({union_sql}) WHERE timestamp <= ?"
            params.append(timestamp)
        union_sql += " ORDER BY timestamp DESC LIMIT 1"

        row = conn.execute(union_sql, params).fetchone()
        if not row:
            return {"entity_id": entity_id, "prediction": None, "explanation": "No prior activity before timestamp."}

        return {
            "entity_id": entity_id,
            "prediction": dict(row)["state"],
            "explanation": f"Predicted from last seen in {dict(row)['source']} at {dict(row)['timestamp']}",
        }
    finally:
        conn.close()


def _existing_columns(conn: sqlite3.Connection, table: str, candidates: List[str]) -> List[str]:
    cur = conn.execute(f"PRAGMA table_info({table})")
    cols = {r[1] for r in cur.fetchall()}
    return [c for c in candidates if c in cols]


def _has_column(conn: sqlite3.Connection, table: str, column: str) -> bool:
    cur = conn.execute(f"PRAGMA table_info({table})")
    return any(r[1] == column for r in cur.fetchall())


def get_schema_summary(sample_rows: int = 3) -> Dict[str, Any]:
    conn = _connect()
    try:
        summary: Dict[str, Any] = {}
        tables_cur = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        tables = [r[0] for r in tables_cur.fetchall()]
        for t in tables:
            cols_cur = conn.execute(f"PRAGMA table_info({t})")
            cols = [r[1] for r in cols_cur.fetchall()]
            try:
                cnt_row = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()
                cnt = int(cnt_row[0]) if cnt_row else 0
            except Exception:
                cnt = 0
            try:
                sample = conn.execute(f"SELECT * FROM {t} LIMIT ?", (sample_rows,)).fetchall()
                sample_dicts = [dict(r) for r in sample]
            except Exception:
                sample_dicts = []
            summary[t] = {"columns": cols, "count": cnt, "sample": sample_dicts}
        return summary
    finally:
        conn.close()


