from fastapi import APIRouter, Depends, Request
from dependency import authenticated_uid_check
from .models.fast_api_models import CalendarEvent
from .models.dynamo_models import DDBCalendarEvent

router = APIRouter()

@router.get("/events/{user_id}")
def get_events(user_id: int, key: str = Depends(authenticated_uid_check)):
    pass
    
@router.post("/new")
def create_event(event: CalendarEvent, key: str = Depends(authenticated_uid_check)):
    DDBCalendarEvent(event.event_id,event.event_time, event.title).save()

@router.get("/event/{event_id}")
def read_item(item_id: int, key: str = Depends(authenticated_uid_check)):
    pass