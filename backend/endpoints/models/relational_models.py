import os
from sqlalchemy import (
    create_engine,
    Table,
    Column,
    Integer,
    String,
    MetaData,
    DateTime,
    ForeignKey,
)

POSTGRES_CONNECTION_URL = os.environ.get("POSTGRES_CONN_STRING", None)


metadata_object = MetaData()

"""Event set up table

The event is set up by the admin with the following data:

event_id : ID generated when creating the event data  
event_owner : firebase_user who created the event
event_title : The name of the proposed meeting
description: The description for the event.
"""
eventsPDB = Table(
    "events",
    metadata_object,
    Column("event_id", String, primary_key=True),
    Column("event_owner", String),
    Column("event_title", String),
    Column("event_description", String),
)

eventToDateTable = Table(
    "event_time_slots",
    metadata_object,
    Column("event_id", String, ForeignKey("events.event_id"), primary_key=True),
    Column("event_datetime_slot", String, primary_key=True),
)

"""Invitee set up table

Stores who can come to an event.

invite_id = firebase_user
event_id = the event id

"""

inviteePDB = Table(
    "invitee",
    metadata_object,
    Column("event_id", String, ForeignKey("events.event_id"), primary_key=True),
    Column("invitee_id", String, primary_key=True),
)


"""Availability set up table

Stores availability data for users who are coming to an event they are invited to:

event_id : ID generated when creating the event data  
event_owner : firebase_user who created the event
event_title : The name of the proposed meeting
event_start_time: The earliest possible time-frame that availability can be selected for.
event_end_time: The latest possible time-frame that availability can be selected for.
description: The description for the event.
"""

availabilityPDB = Table(
    "availability",
    metadata_object,
    Column("event_id", String, ForeignKey("events.event_id"), primary_key=True),
    Column("availability_slot", String, primary_key=True),
    Column("availability_owner", String, primary_key=True),
)

engine = create_engine(POSTGRES_CONNECTION_URL)
