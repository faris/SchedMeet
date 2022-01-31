import axios from "axios";
import { calendarPath, SchedMeetEvent } from "../constants";

export const addEventMutationFunction = ({
  newEvent,
  authToken,
}: {
  newEvent: SchedMeetEvent;
  authToken: string;
}) => {
  return axios.post<SchedMeetEvent>(
    `${calendarPath}/new`,
    {
      event_id: newEvent.resource?.event_id,
      event_title: newEvent.title,
      event_start_time: newEvent.start,
      event_end_time: newEvent.end,
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
      event_id: movedEvent.resource?.event_id,
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
