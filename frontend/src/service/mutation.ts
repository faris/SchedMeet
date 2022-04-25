import axios from "axios";

import {
  baseURL,
  eventSQLPath,
  SchedMeetNewEventRequest,
  SchedMeetNewEventResponse,
  availabilitySQLPath,
  AvailabilityBookingAction,
} from "../constants";

export const createNewEventMutation = ({
  newEvent,
  authToken,
  currentDataStore,
}: {
  newEvent: SchedMeetNewEventRequest;
  authToken: string;
  currentDataStore: string;
}) => {
  return axios.post<SchedMeetNewEventResponse>(
    `${baseURL}/${currentDataStore}/event/new`,
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
  currentDataStore,
}: {
  newAvailabilityBooking: AvailabilityBookingAction;
  authToken: string;
  currentDataStore: string;
}) => {
  return axios.post<AvailabilityBookingAction>(
    `${baseURL}/${currentDataStore}/availability/update`,
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
