import calendar
from uuid import uuid4
import datetime
from fastapi import APIRouter, Depends, HTTPException
from dependency import authenticated_uid_check
from ..models.fast_api_models import AvailabilitySlotRequest
from ..models.relational_models import (
    eventsPDB,
    eventToDateTable,
    availabilityPDB,
    engine,
)
from sqlalchemy.sql import select, update, delete
from psycopg2.extras import DateTimeTZRange
from ..models.dynamo_models import CalendarEvent
import logging

router = APIRouter()

# Gets all info specific to an event_id, (what times a user can book, what times users put on the calendar)
@router.get("/{event_id}")
def get_events(event_id: str, user_id: str = Depends(authenticated_uid_check)):

    calendar_event = CalendarEvent.get(event_id)
    
    if calendar_event:
        return {
            "event_id": event_id,
            "event_title": calendar_event.event_title,
            "event_description": calendar_event.event_description,
            "availableTimeSlots": calendar_event.event_datetime_slots,
            "booked_slots": [],
        }
    else:
        raise HTTPException(status_code=404, detail="Event not found")


# Adds a new availability slot..
@router.post("/update")
def update_availability(
    availabilitySlot: AvailabilitySlotRequest,
    user_id: str = Depends(authenticated_uid_check),
):
    event_obj = {
        "event_id": availabilitySlot.event_id,
        "availability_owner": user_id,
        "availability_slot": availabilitySlot.event_availability_slot,
    }

    with engine.connect() as connection:
        if availabilitySlot.event_action == "TOGGLE":
            ins = availabilityPDB.insert()
            connection.execute(ins, event_obj)
        elif availabilitySlot.event_action == "UNTOGGLE":
            untoggle_sql_operation = (
                delete(availabilityPDB)
                .where(availabilityPDB.c.event_id == availabilitySlot.event_id)
                .where(availabilityPDB.c.availability_owner == user_id)
                .where(
                    availabilityPDB.c.availability_slot
                    == availabilitySlot.event_availability_slot
                )
            )
            result = connection.execute(untoggle_sql_operation, event_obj)
            if not result:
                raise HTTPException(status_code=404, detail="Event not found")

    return event_obj


# TODO: Get all events a user owns or is admin of.
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
