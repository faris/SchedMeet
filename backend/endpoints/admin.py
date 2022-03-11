import calendar
from fastapi import APIRouter, Depends, Request, HTTPException
from dependency import authenticated_uid_check
from .models.fast_api_models import NewEventRequest
from .models.relational_models import eventsPDB, engine
from sqlalchemy.sql import select, update
from uuid import uuid4
import logging

router = APIRouter()

@router.post("/new")
def create_event(new_event: NewEventRequest, user_id: str = Depends(authenticated_uid_check)):
    log = logging.getLogger("uvicorn.access")
    
    event_db_obj = {
        "event_id": uuid4(),
        "event_title": new_event.event_title,
        "event_owner": user_id,
        "event_description": new_event.event_description,   
    } if new_event.availableDates == None else {
        "event_id": uuid4(),
        "event_title": new_event.event_title,
        "event_owner": user_id,
        "event_description": new_event.event_description,
    }

    log.info(new_event)

    with engine.connect() as connection:
        ins = eventsPDB.insert()
        connection.execute(ins, event_db_obj)

    # event_obj = {
    #     "title": event.event_title,
    #     "start": event.event_start_time,
    #     "end": event.event_end_time,
    #     "resource": {"event_id": event.event_id},
    # }
    # return event_obj

    return event_db_obj
