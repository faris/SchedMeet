import calendar
from fastapi import APIRouter, Depends, Request, HTTPException
from dependency import authenticated_uid_check
from .models.fast_api_models import NewEventRequest
from .models.relational_models import eventsPDB, eventToDateTable, engine
from sqlalchemy.sql import select, update
from psycopg2.extras import DateTimeTZRange
from uuid import uuid4
import logging

router = APIRouter()


@router.post("/new")
def create_event(
    new_event: NewEventRequest, user_id: str = Depends(authenticated_uid_check)
):

    event_id = uuid4()

    event_date_time_slots = []

    eventMetaDataObj = {
        "event_id": event_id,
        "event_title": new_event.event_title,
        "event_owner": user_id,
        "event_description": new_event.event_description,
    }

    for timeslot in new_event.datetime_slots:
        event_date_time_slots.append(
            {
                "event_id": event_id,
                "event_datetime_slot": timeslot,
            }
        )

    with engine.connect() as connection:
        connection.execute(eventsPDB.insert(), eventMetaDataObj)
        connection.execute(eventToDateTable.insert(), event_date_time_slots)

    return eventMetaDataObj
