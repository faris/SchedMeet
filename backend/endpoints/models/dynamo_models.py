from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, ListAttribute, MapAttribute

# from pynamodb_attributes import UUIDAttribute


class CalendarEvent(Model):
    class Meta:
        table_name = "CalendarEvents"
        region = "us-east-2"
        read_capacity_units = 5
        write_capacity_units = 5


    event_id = UnicodeAttribute(hash_key=True)
    event_owner = UnicodeAttribute()
    event_title = UnicodeAttribute()
    event_description = UnicodeAttribute()
    event_datetime_slots = ListAttribute(default=list)
    event_availability_slots = MapAttribute(default=dict)
