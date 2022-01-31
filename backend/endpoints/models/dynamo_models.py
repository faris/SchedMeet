from pynamodb.models import Model
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection
from pynamodb.attributes import UnicodeAttribute


class EventOwnerIndex(GlobalSecondaryIndex):
    """
    This class represents a global secondary index
    """

    class Meta:
        # index_name is optional, but can be provided to override the default name
        index_name = "foo-index"
        read_capacity_units = 2
        write_capacity_units = 1
        # All attributes are projected
        projection = AllProjection()

    # This attribute is the hash key for the index
    # Note that this attribute must also exist
    # in the model
    event_owner = UnicodeAttribute(hash_key=True)


class DDBCalendarEvent(Model):
    class Meta:
        table_name = "CalendarEvents"
        region = "us-west-2"

    event_id = UnicodeAttribute(hash_key=True)
    event_start_time = UnicodeAttribute(range_key=True)
    event_end_time = UnicodeAttribute()
    event_title = UnicodeAttribute()
    event_owner_index = EventOwnerIndex()
    event_owner = UnicodeAttribute()
