from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, IncludeProjection
from pynamodb.attributes import UnicodeAttribute, ListAttribute, MapAttribute

# from pynamodb_attributes import UUIDAttribute


class EventOwnerIndex(GlobalSecondaryIndex):
    """
    This class represents a global secondary index
    """
    class Meta:
        read_capacity_units = 2
        write_capacity_units = 1
        projection = IncludeProjection(non_attr_keys=["event_owner", "event_title"])

    # This attribute is the hash key for the index
    # Note that this attribute must also exist
    # in the model
    event_owner = UnicodeAttribute(hash_key=True)


class CalendarEvent(Model):
    class Meta:
        table_name = "CalendarEvents"
        region = "us-east-2"
        read_capacity_units = 5
        write_capacity_units = 5

    event_id = UnicodeAttribute(hash_key=True)
    event_owner = UnicodeAttribute()
    event_owner_index = EventOwnerIndex()
    event_title = UnicodeAttribute()
    event_description = UnicodeAttribute()
    event_datetime_slots = ListAttribute(default=list)
    event_availability_slots = MapAttribute(default=dict)
