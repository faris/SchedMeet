import calendar
from fastapi import APIRouter, Depends, Request, HTTPException
from dependency import authenticated_uid_check
from .models.fast_api_models import CalendarEvent
from .models.relational_models import eventsPDB, engine
from sqlalchemy.sql import select, update

router = APIRouter()


@router.get("/events/")
def get_events(user_id: str = Depends(authenticated_uid_check)):
    events = []

    with engine.connect() as connection:
        query = select(eventsPDB).where(eventsPDB.c.event_owner == user_id)
        result = connection.execute(query).fetchall()

        for row in result:
            event_obj = {
                "title": row.event_title,
                "start": row.event_start_time,
                "end": row.event_end_time,
                "resource": {"event_id": row.event_id},
            }
            events.append(event_obj)

    return events


@router.post("/new")
def create_event(event: CalendarEvent, user_id: str = Depends(authenticated_uid_check)):
    event_db_obj = {
        "event_id": event.event_id,
        "event_title": event.event_title,
        "event_owner": user_id,
        "event_start_time": event.event_start_time,
        "event_end_time": event.event_end_time,
        "event_description": event.description,
    }

    with engine.connect() as connection:
        ins = eventsPDB.insert()
        connection.execute(ins, event_db_obj)

    event_obj = {
        "title": event.event_title,
        "start": event.event_start_time,
        "end": event.event_end_time,
        "resource": {"event_id": event.event_id},
    }
    return event_obj


@router.put("/update")
def update_event(event: CalendarEvent, user_id: str = Depends(authenticated_uid_check)):

    event_db_obj = {
        "event_id": event.event_id,
        "event_title": event.event_title,
        "event_owner": user_id,
        "event_start_time": event.event_start_time,
        "event_end_time": event.event_end_time,
        "event_description": event.description,
    }

    with engine.connect() as connection:
        update_operation = (
            update(eventsPDB)
            .where(eventsPDB.c.event_owner == user_id)
            .where(eventsPDB.c.event_id == event.event_id)
        )
        result = connection.execute(update_operation, event_db_obj)

        if result:
            event_obj = {
                "title": event.event_title,
                "start": event.event_start_time,
                "end": event.event_end_time,
                "resource": {"event_id": event.event_id},
            }
            return event_obj
        else:
            raise HTTPException(status_code=404, detail="Event not found")
