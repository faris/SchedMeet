import create from "zustand";
import { startOfDay, parseISO, compareAsc, format, addMinutes } from "date-fns";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
import { devtools } from "zustand/middleware";
import addMilliseconds from "date-fns/addMilliseconds";
// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  availableDateTimeIntervals: Array<Date>;
  availableTimeSlots: Array<string>;

  setAvailableDateTimeSlots: (
    availableDateTimeSlots: Array<string>
  ) => Array<Date>;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    availableDateTimeIntervals: [],
    availableTimeSlots: [],
    setAvailableDateTimeSlots: (availableDateTimeSlots: Array<string>) => {
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
        availableDateTimeIntervals: nonExpiredEvents,
        availableTimeSlots: [...seenTimes],
      });

      return datesAvailableForEvents;
    },
  }))
);
