from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional, List, Tuple
from datetime import datetime


class AvailabilitySlotRequest(BaseModel):
    event_id: str
    event_availability_slot: str
    event_action: str


class NewEventRequest(BaseModel):
    event_title: str
    event_description: str
    datetime_slots: List[str]
