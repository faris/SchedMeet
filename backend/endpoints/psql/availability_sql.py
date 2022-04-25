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

from ..helper.retreive_user_info import get_users_info

router = APIRouter()

# Gets all info specific to an event_id, (what times a user can book, what times users put on the calendar)
@router.get("/{event_id}")
def get_events(event_id: str, user_id: str = Depends(authenticated_uid_check)):

    title, description, availableTimeSlots, bookedSlots, listOfUsers = (
        None,
        None,
        [],
        [],
        [],
    )

    with engine.connect() as connection:
        availableTimeSlotsJoinedTable = eventsPDB.join(
            eventToDateTable, eventToDateTable.c.event_id == eventsPDB.c.event_id
        )
        availableTimeSlotsQuery = (
            select(
                [
                    eventsPDB.c.event_title,
                    eventsPDB.c.event_description,
                    eventToDateTable.c.event_datetime_slot,
                ]
            )
            .select_from(availableTimeSlotsJoinedTable)
            .where(eventsPDB.c.event_id == event_id)
        )
        availableTimeSlotsResult = connection.execute(
            availableTimeSlotsQuery
        ).fetchall()

    for row in availableTimeSlotsResult:
        availableTimeSlots.append(row[2])
        title, description = row[0], row[1]

    with engine.connect() as connection:
        bookedTimeSlotsJoinedTable = eventsPDB.join(
            availabilityPDB, availabilityPDB.c.event_id == eventsPDB.c.event_id
        )
        bookedTimeSlotsQuery = (
            select(
                [
                    availabilityPDB.c.availability_owner,
                    availabilityPDB.c.availability_slot,
                ]
            )
            .select_from(bookedTimeSlotsJoinedTable)
            .where(eventsPDB.c.event_id == event_id)
        )
        bookedTimeSlotsResult = connection.execute(bookedTimeSlotsQuery).fetchall()

    for row in bookedTimeSlotsResult:
        listOfUsers.append(row[0])

    users_info = get_users_info(listOfUsers)

    for row in bookedTimeSlotsResult:
        user = row[0]
        bookedEvent = {
            "availability_slot": row[1],
            "availability_owner": {
                "user_id": user,
                "user_name": users_info[user]["user_name"],
                "user_email": users_info[user]["user_email"],
            },
        }
        bookedSlots.append(bookedEvent)

    if availableTimeSlotsResult:
        return {
            "event_id": event_id,
            "event_title": title,
            "event_description": description,
            "availableTimeSlots": availableTimeSlots,
            "booked_slots": bookedSlots,
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
