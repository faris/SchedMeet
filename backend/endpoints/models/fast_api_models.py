from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List, Tuple
from datetime import datetime


class AvailabilitySlotRequest(BaseModel):
    event_id: str
    availability_interval: Tuple[datetime, datetime]


class NewEventRequest(BaseModel):
    event_title: str
    event_description: str
    datetime_intervals: List[Tuple[datetime, datetime]]
