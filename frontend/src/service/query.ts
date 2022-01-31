import axios from "axios";
import { calendarPath, SchedMeetEvent } from "../constants";

export const getEvents = async (authToken: string) => {
  const result = await axios.get<
    {
      title: string;
      start: string | Date;
      end: string | Date;
      resource: { event_id: string };
    }[]
  >(`${calendarPath}/events/`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  for (const event of result.data) {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
  }

  return result.data as SchedMeetEvent[];
};
