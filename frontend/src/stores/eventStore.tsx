import create from "zustand";
import {
  SchedMeetEvent,
  BookedTimeSlot,
  convertBookedTimeSlotToSchedMeetEvent,
} from "../constants";
import { stringOrDate } from "react-big-calendar";

interface CalendarState {
  userAvailabilitySlots: Map<string, Map<string, Array<string>>>;
  eventTimeSlots: Array<[Date, Date]>;
  eventMetadata: { title: string; description: string };
  setEventMetadata: (title: string, description: string) => void;
  setUserAvailabilitySlots: (title: string, description: string) => void;
}

// locally manages state, to get rid of input delay that appears on inserting events
export const useCalendarStore = create<CalendarState>((set, get) => ({
  eventMetadata: { title: "", description: "" },
  userAvailabilitySlots: new Map(),
  eventTimeSlots: [],
  setUserAvailabilitySlots: (title: string, description: string) => {
    return null;
  },
  setEventMetadata: (title: string, description: string) => {
    set({ eventMetadata: { title: title, description: description } });
  },
}));
