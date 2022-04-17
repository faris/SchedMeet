import calendar
from uuid import uuid4
import datetime
from fastapi import APIRouter, Depends, HTTPException
from dependency import authenticated_uid_check
from .models.fast_api_models import AvailabilitySlotRequest
from .models.relational_models import eventsPDB,eventToDateTable, availabilityPDB, engine
from sqlalchemy.sql import select, update
from psycopg2.extras import DateTimeTZRange


router = APIRouter()

# Gets all info specific to an event_id, (what times a user can book, what times users put on the calendar)
@router.get("/{event_id}")
def get_events(event_id: str, user_id: str = Depends(authenticated_uid_check)):
    
    
    title, description, availableTimeSlots, reservedSlots = None, None, [], []

    with engine.connect() as connection:
        availableTimeSlotsJoinedTable = eventsPDB.join(eventToDateTable, eventToDateTable.c.event_id == eventsPDB.c.event_id )
        availableTimeSlotsQuery = select([eventsPDB.c.event_title, eventsPDB.c.event_description,eventToDateTable.c.event_datetime_slot]).select_from(availableTimeSlotsJoinedTable).where(eventsPDB.c.event_id == event_id)
        availableTimeSlotsResult = connection.execute(availableTimeSlotsQuery).fetchall()
        
    for row in availableTimeSlotsResult:
        availableTimeSlots.append(row[2])
        title, description = row[0], row[1]


    with engine.connect() as connection:
        bookedTimeSlotsJoinedTable = eventsPDB.join(availabilityPDB, availabilityPDB.c.event_id == eventsPDB.c.event_id )
        bookedTimeSlotsQuery = select([availabilityPDB.c.availability_id,availabilityPDB.c.availability_slot, availabilityPDB.c.availability_slot ]).select_from(bookedTimeSlotsJoinedTable).where(eventsPDB.c.event_id == event_id)
        bookedTimeSlotsResult = connection.execute(bookedTimeSlotsQuery).fetchall()
        
    for row in bookedTimeSlotsResult:
        bookedEvent = {
            "availability_id": row[0],
            "availability_owner": row[1],
            "availability_slot": row[2]
        }
        reservedSlots.append(bookedEvent)

    if availableTimeSlotsResult:
        return {
        "event_id": event_id,
        "event_title": title,
        "event_description": description,
        "availableTimeSlots" : availableTimeSlots,
        "booked_slots": reservedSlots
    }
    else:
        raise HTTPException(status_code=404, detail="Event not found")


# Adds a new availability slot..
@router.post("/new")
def add_availability(availabilitySlot: AvailabilitySlotRequest, user_id: str = Depends(authenticated_uid_check)):
    event_obj = {
        "event_id": availabilitySlot.event_id,
        "availability_id":  uuid4(),
        "availability_owner": user_id,
        "availability_interval": DateTimeTZRange(availabilitySlot.event_availability_interval[0], availabilitySlot.event_availability_interval[1]), 
    }

    with engine.connect() as connection:
        ins = availabilityPDB.insert()
        connection.execute(ins, event_obj)

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





@router.put("/update")
def update_event(event: AvailabilitySlotRequest, user_id: str = Depends(authenticated_uid_check)):

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
