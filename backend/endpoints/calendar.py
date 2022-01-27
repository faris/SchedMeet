import calendar
from fastapi import APIRouter, Depends, Request,HTTPException
from dependency import authenticated_uid_check
from .models.fast_api_models import CalendarEvent
from .models.dynamo_models import DDBCalendarEvent
from fastapi.logger import logger

router = APIRouter()

@router.get("/events/")
def get_events(user_id: str = Depends(authenticated_uid_check)):
    events = []
    for event in DDBCalendarEvent.event_owner_index.query(user_id):
        e = event.attribute_values
        event_obj = {"title": e["event_title"], 
                        "start": e["event_start_time"],
                        "end": e["event_end_time"],
                        "resource": {"event_id": e["event_id"]}}
        events.append(event_obj)
    return events
    
@router.post("/new")
def create_event(event: CalendarEvent, user_id: str = Depends(authenticated_uid_check)):
    current_event = DDBCalendarEvent(event.event_id,event.event_start_time, event_title=event.event_title, event_end_time=event.event_end_time, event_owner= user_id)
    current_event.save()
    e = current_event
    event_obj = {"title": e.event_title, 
                        "start": e.event_start_time,
                        "end": e.event_end_time,
                        "resource": {"event_id": e.event_id}}
    return event_obj

@router.put("/update")
def create_event(event: CalendarEvent, user_id: str = Depends(authenticated_uid_check)):
    fetchedCalendarEvent = DDBCalendarEvent.query(event.event_id,limit=1)
    
    currentCalendarEvent = next(fetchedCalendarEvent,None)
    print(currentCalendarEvent)

    if (currentCalendarEvent and currentCalendarEvent.event_owner != user_id):
       raise HTTPException(status_code=404, detail="Event not found")
    
    

    currentCalendarEvent.update(
        actions=[
        DDBCalendarEvent.event_start_time.set(event.event_start_time),
        DDBCalendarEvent.event_end_time.set(event.event_end_time),
    ]
    )

    return event

