import axios from "axios";
import { Event as CalendarEvent } from "react-big-calendar";

import {
  calendarPath,
  SchedMeetEvent,
  eventPath,
  SchedMeetNewEventRequest,
  SchedMeetNewEventResponse,
  availabilityPath,
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

export const addEventMutationFunction = ({
  newEvent,
  authToken,
}: {
  newEvent: CalendarEvent;
  authToken: string;
}) => {
  return axios.post<SchedMeetEvent>(
    `${availabilityPath}/new`,
    {
      event_id: newEvent.resource?.event_id,
      event_availability_slot: [newEvent.start, newEvent.end],
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};

export const updateEventMutationFunction = ({
  movedEvent,
  authToken,
}: {
  movedEvent: SchedMeetEvent;
  authToken: string;
}) => {
  return axios.put<SchedMeetEvent>(
    `${calendarPath}/update`,
    {
      event_title: movedEvent.title,
      event_start_time: movedEvent.start,
      event_end_time: movedEvent.end,
    },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
};
