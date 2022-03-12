import { Event as CalendarEvent } from "react-big-calendar";
import { startOfYesterday, endOfTomorrow, addWeeks, addHours } from "date-fns";
export const baseURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? `http://localhost:8000`
    : `https://api.schedmeet.com`;

export const testAuthPath = `${baseURL}/auth/test`;
export const calendarPath = `${baseURL}/calendar`;
export const eventPath = `${baseURL}/event`;

interface SchedMeetMetadata {
  event_id: string;
  description?: string;
}

export interface EventTimeRestrictions {
  noEarlierThenTime: string;
  noLaterThenTime: string;
}

export interface SchedMeetNewEvent {
  title: string;
  description: string;
  availableDateTimeIntervals: Date[];
  timeRestrictions?: EventTimeRestrictions | null;
}

export interface SchedMeetEvent extends CalendarEvent {
  resource?: SchedMeetMetadata;
}

export interface SchedMeetEvent extends CalendarEvent {
  resource?: SchedMeetMetadata;
}

export const testTimesArray: SchedMeetEvent[] = [
  {
    title: "Mock Event 1",
    start: startOfYesterday(),
    end: endOfTomorrow(),
    allDay: true,
    resource: { event_id: "1" },
  },
  {
    title: "Mock Event 2",
    start: addWeeks(startOfYesterday(), 1),
    end: addHours(addWeeks(startOfYesterday(), 1), 7),
    allDay: false,
    resource: { event_id: "2" },
  },
];
