import create from "zustand";
import firebase from "firebase/compat/app";
import { SchedMeetEvent, calendarPath, testTimesArray } from "../constants";
import axios from "axios";
import { useMutation } from "react-query";
import { stringOrDate } from "react-big-calendar";

interface CalendarState {
  calendarEvents: SchedMeetEvent[];
  addEvent: (event: SchedMeetEvent) => void;
  moveCalendarEvent: (
    calendarEvent: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate,
    isAllDay: boolean
  ) => SchedMeetEvent | undefined;
  resizeCalendarEvent: (
    calendarEvent: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate
  ) => SchedMeetEvent | undefined;
  setCalendarEvents: (calendarEvents: SchedMeetEvent[]) => void;
}

// locally manages state, to get rid of input delay that appears on inserting events
export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendarEvents: [],
  addEvent: (event: SchedMeetEvent) => {
    set({ calendarEvents: [...get().calendarEvents, event] });
  },
  setCalendarEvents: (calendarEvents: SchedMeetEvent[]) => {
    set({ calendarEvents: calendarEvents });
  },
  moveCalendarEvent: (
    event: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate,
    isAllDay: boolean
  ) => {
    const events = get().calendarEvents;

    let allDay = event.allDay;

    if (!event.allDay && isAllDay) {
      allDay = true;
    } else if (event.allDay && !isAllDay) {
      allDay = false;
    }

    const eventToBeUpdated = events.find((existingEvent) => {
      return existingEvent?.resource?.event_id == event?.resource?.event_id;
    });

    if (eventToBeUpdated) {
      eventToBeUpdated.start = start as Date;
      eventToBeUpdated.end = end as Date;
      eventToBeUpdated.allDay = isAllDay;
    }

    set({ calendarEvents: events });
    return eventToBeUpdated;
  },
  resizeCalendarEvent: (
    event: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate
  ) => {
    const events = get().calendarEvents;

    const eventToBeUpdated = events.find((existingEvent) => {
      return existingEvent?.resource?.event_id == event?.resource?.event_id;
    });

    if (eventToBeUpdated) {
      eventToBeUpdated.start = start as Date;
      eventToBeUpdated.end = end as Date;
    }

    set({ calendarEvents: events });
    return eventToBeUpdated;
  },
}));
