import axios from "axios";
import { availabilityPath, SchedMeetNewEventRequest } from "../constants";

export const getEventInformation = async (
  authToken: string,
  event_id: string
) => {
  const result = await axios.get<{
    event_title: string;
    event_description: string;
    availableDateTimeIntervals: Array<[string, string]>;
  }>(`${availabilityPath}/${event_id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return result;
};
