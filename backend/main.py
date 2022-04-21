import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from endpoints.psql import admin_sql, availability_sql
from endpoints.dydb import admin_ddb
from endpoints import hello
from endpoints.models.relational_models import metadata_object, engine
from endpoints.models.dynamo_models import CalendarEvent
import logging
import uvicorn

app = FastAPI()

app.include_router(
    hello.router,
    prefix="/psql/auth",
)

app.include_router(
    availability_sql.router,
    prefix="/psql/availability",
)

app.include_router(
    admin_sql.router,
    prefix="/psql/event",
)

app.include_router(
    admin_ddb.router,
    prefix="/dydb/event",
)

ENVIRONMENT = os.environ.get("ENVIRONMENT", "dev")

origins = (
    ["http://localhost:3000"] if ENVIRONMENT == "dev" else ["https://www.schedmeet.com"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


metadata_object.create_all(engine, checkfirst=True)
if not CalendarEvent.exists():
    CalendarEvent.create_table(read_capacity_units=5, write_capacity_units=5, wait=True)
