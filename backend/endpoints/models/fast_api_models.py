from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

class CalendarEvent(BaseModel):
    event_id: str
    event_title: str
    event_start_time: str
    event_end_time: str
    description: Optional[str] = None