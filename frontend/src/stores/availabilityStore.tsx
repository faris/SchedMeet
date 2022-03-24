import create from "zustand";
import { startOfDay, parseISO, compareAsc } from "date-fns";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
import { devtools } from "zustand/middleware";
import addMilliseconds from "date-fns/addMilliseconds";
// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  availableDateTimeIntervals: Array<Date>;
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => Array<Date>;
  retrieveCurrentDateTimeIntervalIndex: (date: Date) => number;
  retrieveNavigatedActionDate: (date: Date, action: NavigateAction) => Date;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    availableDateTimeIntervals: [],
    setAvailableDateTimeIntervals: (
      availableDateTimeIntervals: Array<[string, string]>
    ) => {
      const datesAvailableForEvents = [];
      const seenDates = new Set();
      const currentTime = new Date();

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

      const nonExpiredEvents = [...datesAvailableForEvents]
        .sort(compareAsc)
        .filter((date) => {
          return compareAsc(date, currentTime) > -1;
        });

      set({
        availableDateTimeIntervals: nonExpiredEvents,
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
      const currentIndex = retrieveCurrentDateTimeIntervalIndex(date);
      let navIndex = 0;

      switch (action) {
        case Navigate.PREVIOUS:
          navIndex = Math.max(
            0,
            currentIndex == -1 ? currentDates.length - 1 : currentIndex - 1
          );
          return addMilliseconds(currentDates[navIndex], -1);

        case Navigate.NEXT:
          navIndex = Math.min(
            currentDates.length - 1,
            currentIndex == -1 ? 0 : currentIndex
          );

          return addMilliseconds(currentDates[navIndex], 1);

        default:
          return date;
      }
    },
  }))
);
