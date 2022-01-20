from pynamodb.models import Model
from pynamodb.attributes import (
    UnicodeAttribute, NumberAttribute, UnicodeSetAttribute, UTCDateTimeAttribute
)


class DDBCalendarEvent(Model):
    class Meta:
        table_name = 'CalendarEvents'
    event_id = UnicodeAttribute(hash_key=True)
    event_time = UnicodeAttribute(range_key=True)
    event_title = UnicodeAttribute()