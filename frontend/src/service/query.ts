import axios from "axios";
import { availabilitySQLPath, BookedTimeSlot } from "../constants";
import { BookingResponse } from "../helpers/gridMap";
export const getEventInformation = async (
  authToken: string,
  event_id: string
) => {
  const result = await axios.get<{
    event_title: string;
    event_description: string;
    availableTimeSlots: Array<string>;
    booked_slots: Array<BookingResponse>;
  }>(`${availabilitySQLPath}/${event_id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return result;
};
