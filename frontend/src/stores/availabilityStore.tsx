import create from "zustand";
import { startOfDay, parseISO, compareAsc } from "date-fns";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  availableDateTimeIntervals: Array<Date>;
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => Array<Date>;
  retrieveCurrentDateTimeIntervalIndex: (date: Date) => number;
  retrieveNavigatedActionDate: (date: Date, action: NavigateAction) => Date;
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

    datesAvailableForEvents.sort(compareAsc);

    set({
      availableDateTimeIntervals: datesAvailableForEvents,
    });

    return datesAvailableForEvents;
  },
  retrieveCurrentDateTimeIntervalIndex: (date: Date) => {
    const currentDates = get().availableDateTimeIntervals;

    const currentIndex = currentDates.findIndex((element) => element > date);

    return currentIndex;
  },

  retrieveNavigatedActionDate: (date: Date, action: NavigateAction) => {
    const retrieveCurrentDateTimeIntervalIndex =
      get().retrieveCurrentDateTimeIntervalIndex;

    const currentDates = get().availableDateTimeIntervals;
    let navIndex = 0;

    switch (action) {
      case Navigate.PREVIOUS:
        navIndex = Math.max(0, retrieveCurrentDateTimeIntervalIndex(date) - 1);
        return currentDates[navIndex];

      case Navigate.NEXT:
        navIndex = Math.min(
          currentDates.length - 1,
          retrieveCurrentDateTimeIntervalIndex(date) + 1
        );
        return currentDates[navIndex];

      default:
        return date;
    }
  },
}));
