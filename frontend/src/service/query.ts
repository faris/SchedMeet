import axios from "axios";
import { baseURL, EventsOwnedRow, eventSQLPath } from "../constants";
import { BookingResponse } from "../helpers/gridMap";
export const getEventInformation = async (
  authToken: string,
  event_id: string,
  currentDataStore: string
) => {
  const result = await axios.get<{
    event_title: string;
    event_description: string;
    availableTimeSlots: Array<string>;
    booked_slots: Array<BookingResponse>;
  }>(`${baseURL}/${currentDataStore}/availability/${event_id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return result;
};

export const getUserEvents = async (
  authToken: string,
  currentDataStore: string
) => {
  const result = await axios.get<{
    events_owned: Array<EventsOwnedRow>;
  }>(`${baseURL}/${currentDataStore}/event/list`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  return result;
};
