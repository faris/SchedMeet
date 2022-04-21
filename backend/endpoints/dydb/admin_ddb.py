from fastapi import APIRouter, Depends
from uuid import uuid4
from dependency import authenticated_uid_check
from ..models.fast_api_models import NewEventRequest
from ..models.dynamo_models import CalendarEvent


router = APIRouter()


@router.post("/new")
def create_event(
    new_event: NewEventRequest, user_id: str = Depends(authenticated_uid_check)
):
    # TODO: Check if anything goes wrong here
    event_id = str(uuid4())

    eventMetaDataObj = {
        "event_id": event_id,
        "event_title": new_event.event_title,
        "event_owner": user_id,
        "event_description": new_event.event_description,
    }

    new_event = CalendarEvent(
        event_id,
        event_owner=user_id,
        event_title=new_event.event_title,
        event_description=new_event.event_description,
        event_datetime_slots=new_event.datetime_slots,
        event_availability_slots=dict(),
    )
    new_event.save()
    return eventMetaDataObj
