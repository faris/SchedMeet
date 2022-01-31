import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from endpoints import hello, calendar
from endpoints.models.relational_models import metadata_object, engine

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


metadata_object.create_all(engine)
