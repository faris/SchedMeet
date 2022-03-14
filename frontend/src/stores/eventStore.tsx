import create from "zustand";
import firebase from "firebase/compat/app";
import { SchedMeetEvent, calendarPath, testTimesArray } from "../constants";
import axios from "axios";
import { useMutation } from "react-query";
import { stringOrDate } from "react-big-calendar";

interface CalendarState {
  userAvailabilitySlots: SchedMeetEvent[];
  eventTimeSlots: Array<[Date, Date]>;
  eventMetadata: { title: string; description: string };
  addAvailabilitySlot: (event: SchedMeetEvent) => void;
  moveAvailabilitySlot: (
    calendarEvent: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate,
    isAllDay: boolean
  ) => SchedMeetEvent | undefined;
  resizeAvailabilitySlot: (
    calendarEvent: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate
  ) => SchedMeetEvent | undefined;
  setAvailabilitySlots: (calendarEvents: SchedMeetEvent[]) => void;
  setEventMetadata: (title: string, description: string) => void;
}

// locally manages state, to get rid of input delay that appears on inserting events
export const useCalendarStore = create<CalendarState>((set, get) => ({
  eventMetadata: { title: "", description: "" },
  userAvailabilitySlots: [],
  eventTimeSlots: [],
  setEventMetadata: (title: string, description: string) => {
    set({ eventMetadata: { title: title, description: description } });
  },
  addAvailabilitySlot: (event: SchedMeetEvent) => {
    set({ userAvailabilitySlots: [...get().userAvailabilitySlots, event] });
  },
  setAvailabilitySlots: (calendarEvents: SchedMeetEvent[]) => {
    set({ userAvailabilitySlots: calendarEvents });
  },
  moveAvailabilitySlot: (
    event: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate,
    isAllDay: boolean
  ) => {
    const events = get().userAvailabilitySlots;

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

    set({ userAvailabilitySlots: events });
    return eventToBeUpdated;
  },
  resizeAvailabilitySlot: (
    event: SchedMeetEvent,
    start: stringOrDate,
    end: stringOrDate
  ) => {
    const events = get().userAvailabilitySlots;

    const eventToBeUpdated = events.find((existingEvent) => {
      return existingEvent?.resource?.event_id == event?.resource?.event_id;
    });

    if (eventToBeUpdated) {
      eventToBeUpdated.start = start as Date;
      eventToBeUpdated.end = end as Date;
    }

    set({ userAvailabilitySlots: events });
    return eventToBeUpdated;
  },
}));
