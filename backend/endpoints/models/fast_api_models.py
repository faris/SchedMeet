from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CalendarEvent(BaseModel):
    event_id: str
    event_title: str
    event_start_time: str
    event_end_time: str
    description: Optional[str] = None


class TimeRestrictionModel(BaseModel):
    noEarlierThenTime: datetime
    noLaterThenTime: datetime

class NewEventRequest(BaseModel):
    event_title: str
    event_description: str
    availableDates: List[datetime]
    timeRestrictions: TimeRestrictionModel | None