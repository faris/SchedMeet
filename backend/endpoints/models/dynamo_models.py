from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute, ListAttribute, UnicodeSetAttribute
from pynamodb_attributes import UUIDAttribute

class CalendarEvent(Model):
    class Meta:
        table_name = "CalendarEvents"
        region = "us-west-2"

    event_id = UUIDAttribute(hash_key=True)
    event_owner = UnicodeAttribute()
    event_title = UnicodeAttribute()
    event_description = UnicodeAttribute()
    event_datetime_slots = ListAttribute(default=list)
    event_availability_slots = UnicodeSetAttribute(default=dict)
