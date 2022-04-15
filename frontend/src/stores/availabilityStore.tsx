import create from "zustand";
import { startOfDay, parseISO, compareAsc, format, parse } from "date-fns";
import { devtools } from "zustand/middleware";
import { GridMapMetaData } from "../constants";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  bookableDates: Array<Date>;
  bookableTimeSlots: Array<string>;
  setBookableDateTimeSlots: (
    availableDateTimeSlots: Array<string>
  ) => Array<Date>;

  gridMapMetaData: Map<string, GridMapMetaData>;
  toggleGridPosition: (position: string) => void;
  setGridMapMetaData: () => void;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    bookableDates: [],
    gridMapMetaData: new Map(),
    bookableTimeSlots: [],
    setBookableDateTimeSlots: (availableDateTimeSlots: Array<string>) => {
      const datesAvailableForEvents = [];
      const seenDates = new Set();
      const seenTimes = new Set<string>();
      const currentTime = new Date();

      for (const timeSlot of availableDateTimeSlots) {
        const timeSlotObj = parseISO(timeSlot);
        const beginningOfDayforTimeSlot = startOfDay(timeSlotObj).toISOString();
        // TODO: investigate why a space breaks things...
        seenTimes.add(format(timeSlotObj, `h:mmaa`));

        if (!seenDates.has(beginningOfDayforTimeSlot)) {
          datesAvailableForEvents.push(timeSlotObj);
          seenDates.add(beginningOfDayforTimeSlot);
        }
      }

      const nonExpiredEvents = [...datesAvailableForEvents]
        .sort(compareAsc)
        .filter((date) => {
          return compareAsc(date, currentTime) > -1;
        });

      set({
        bookableDates: nonExpiredEvents,
        bookableTimeSlots: [...seenTimes],
      });

      return datesAvailableForEvents;
    },

    setGridMapMetaData: () => {
      for (const [
        bookableDateIndex,
        bookableDate,
      ] of get().bookableDates.entries()) {
        for (const [
          bookableTimeSlotIndex,
          bookableTimeSlot,
        ] of get().bookableTimeSlots.entries()) {
          const GridBlockObj = {
            position: `(${bookableTimeSlotIndex},${bookableDateIndex})`,
            timeSlot: parse(bookableTimeSlot, `h:mmaa`, bookableDate),
            userBooked: false,
          };
          get().gridMapMetaData.set(GridBlockObj.position, GridBlockObj);
        }
      }
    },
    toggleGridPosition: (position) => {
      const _ = get().gridMapMetaData;
    },
  }))
);
