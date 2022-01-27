import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from endpoints import hello, calendar
from endpoints.models.dynamo_models import DDBCalendarEvent

app = FastAPI()

app.include_router(
    hello.router,
    prefix="/auth",
)

app.include_router(
    calendar.router,
    prefix="/calendar",
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

if not DDBCalendarEvent.exists():
        DDBCalendarEvent.create_table(read_capacity_units=5, write_capacity_units=1, wait=True)