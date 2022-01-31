from sqlalchemy import (
    create_engine,
    Table,
    Column,
    Integer,
    String,
    MetaData,
    ForeignKey,
)
import os


POSTGRES_CONNECTION_URL = os.environ.get("POSTGRES_CONN_STRING", None)


metadata_object = MetaData()

eventsPDB = Table(
    "events",
    metadata_object,
    Column("event_id", String, primary_key=True),
    Column("event_owner", String, primary_key=True),
    Column("event_title", String),
    Column("event_start_time", String),
    Column("event_end_time", String),
    Column("description", String),
)

engine = create_engine(POSTGRES_CONNECTION_URL)
