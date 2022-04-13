import axios from "axios";
import { availabilityPath, BookedTimeSlot } from "../constants";

export const getEventInformation = async (
  authToken: string,
  event_id: string
) => {
  const result = await axios.get<{
    event_title: string;
    event_description: string;
    availableDateTimeIntervals: Array<[string, string]>;
    booked_slots: Array<BookedTimeSlot>;
  }>(`${availabilityPath}/${event_id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return result;
};
