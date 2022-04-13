import create from "zustand";
import {
  SchedMeetEvent,
  BookedTimeSlot,
  convertBookedTimeSlotToSchedMeetEvent,
} from "../constants";
import { stringOrDate } from "react-big-calendar";

interface CalendarState {
  userAvailabilitySlots: SchedMeetEvent[];
  eventTimeSlots: Array<[Date, Date]>;
  eventMetadata: { title: string; description: string };
  addAvailabilitySlot: (booked_time_slot: BookedTimeSlot) => void;
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
  setAvailabilitySlots: (calendarEvents: BookedTimeSlot[]) => SchedMeetEvent[];
  setEventMetadata: (title: string, description: string) => void;
}

// locally manages state, to get rid of input delay that appears on inserting events
export const useCalendarStore = create<CalendarState>((set, get) => ({
  eventMetadata: { title: "", description: "" },
  userAvailabilitySlots: [],
  eventTimeSlots: [],
  addAvailabilitySlot: (booked_time_slot: BookedTimeSlot) => {
    const convertedEvent =
      convertBookedTimeSlotToSchedMeetEvent(booked_time_slot);
    set({
      userAvailabilitySlots: [...get().userAvailabilitySlots, convertedEvent],
    });
  },
  setEventMetadata: (title: string, description: string) => {
    set({ eventMetadata: { title: title, description: description } });
  },
  setAvailabilitySlots: (calendarEvents: BookedTimeSlot[]) => {
    const bookedSlots = [];

    for (const bookedSlot of calendarEvents) {
      const convertedEvent = convertBookedTimeSlotToSchedMeetEvent(bookedSlot);
      bookedSlots.push(convertedEvent);
    }

    set({ userAvailabilitySlots: bookedSlots });
    return bookedSlots;
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
