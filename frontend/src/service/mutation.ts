import axios from "axios";

import {
  calendarPath,
  eventPath,
  SchedMeetNewEventRequest,
  SchedMeetNewEventResponse,
  availabilityPath,
  AvailabilityBookingAction,
} from "../constants";

export const createNewEventMutation = ({
  newEvent,
  authToken,
}: {
  newEvent: SchedMeetNewEventRequest;
  authToken: string;
}) => {
  // TODO: timeRestrictions
  return axios.post<SchedMeetNewEventResponse>(
    `${eventPath}/new`,
    {
      event_title: newEvent.title,
      event_description: newEvent.description,
      datetime_slots: newEvent.availableDateTimeIntervals,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const updateEventMutationFunction = ({
  newAvailabilityBooking,
  authToken,
}: {
  newAvailabilityBooking: AvailabilityBookingAction;
  authToken: string;
}) => {
  return axios.post<AvailabilityBookingAction>(
    `${availabilityPath}/update`,
    {
      event_id: newAvailabilityBooking.event_id,
      event_availability_slot: newAvailabilityBooking.time_slot,
      event_action: newAvailabilityBooking.action,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
