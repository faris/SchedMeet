import create from "zustand";
import { startOfDay, parseISO } from "date-fns";

interface AvailabilityState {
  availableDateTimeIntervals: Array<Date>;
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => Array<Date>;
}

export const useAvailableSlotsStore = create<AvailabilityState>((set, get) => ({
  availableDateTimeIntervals: [],
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => {
    const datesAvailableForEvents = [];
    const seenDates = new Set();

    for (const date of availableDateTimeIntervals) {
      const startTime = parseISO(date[0]);
      const endTime = parseISO(date[1]);

      const startTimeBeginningOfDayISO = startOfDay(startTime).toISOString();
      const endTimeBeginningOfDayISO = startOfDay(endTime).toISOString();

      if (!seenDates.has(startTimeBeginningOfDayISO)) {
        datesAvailableForEvents.push(startTime);
        seenDates.add(startTimeBeginningOfDayISO);
      }
      if (!seenDates.has(endTimeBeginningOfDayISO)) {
        datesAvailableForEvents.push(endTime);
        seenDates.add(endTimeBeginningOfDayISO);
      }
    }

    set({
      availableDateTimeIntervals: datesAvailableForEvents,
    });

    return datesAvailableForEvents;
  },
}));
