import { Event as CalendarEvent } from "react-big-calendar";
import { startOfYesterday, endOfTomorrow, addWeeks, addHours } from "date-fns";
export const baseURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:8000`
    : `https://api.schedmeet.com`;

export const testAuthPath = `${baseURL}/test_auth`;

export const testTimesArray: CalendarEvent[] = [
  {
    title: "Mock Event 1",
    start: startOfYesterday(),
    end: endOfTomorrow(),
    allDay: false,
    // resource?: any,
  },
  {
    title: "Faris New Week",
    start: addWeeks(startOfYesterday(), 1),
    end: addHours(addWeeks(startOfYesterday(), 1), 7),
    allDay: false,
    // resource?: any,
  },
];
