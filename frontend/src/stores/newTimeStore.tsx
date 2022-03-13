import create from "zustand";
import startOfToday from "date-fns/startOfToday";
import {
  addDays,
  differenceInDays,
  addHours,
  getHours,
  getMinutes,
} from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { addMinutes } from "date-fns/esm";
// todo: add timezone
// strip hour and minute from restrictedTimeInterval (timepicker)
// strip year, month, day from selectedDates (datepicker)
// get timezone from dropdown
// create actual date objects range objects to send to db for storage.

interface EventStore {
  selectedDates: Map<string, Date>;
  deleteEventDate: (eventDay: Date) => Array<Date>;
  addEventDate: (startDate: Date, endDate: Date) => Array<Date>;

  restrictedTimeInterval: [Date, Date];
  updateRestrictedInterval: (start: Date, end: Date) => [Date, Date];

  timeZone: string;
  updateTimeZone: (timezone: string) => string;

  prepareInterval: () => Array<[Date, Date]>;
}

// locally manages state, to get rid of input delay that appears on inserting events
export const useEventStore = create<EventStore>((set, get) => ({
  selectedDates: new Map<string, Date>(),
  deleteEventDate: (eventDay: Date) => {
    const selectedDates = get().selectedDates;
    selectedDates.delete(eventDay.toISOString());
    set({
      selectedDates,
    });
    return [...selectedDates.values()];
  },
  addEventDate: (startDate: Date, endDate: Date) => {
    const daysDifference = differenceInDays(endDate, startDate);
    const selectedDates = get().selectedDates;

    for (let dayNumber = 0; dayNumber <= daysDifference; dayNumber++) {
      const currentDate = addDays(startDate, dayNumber);
      selectedDates.set(currentDate.toISOString(), currentDate);
    }
    set({
      selectedDates,
    });

    return [...selectedDates.values()];
  },

  restrictedTimeInterval: [
    addHours(startOfToday(), 9),
    addHours(startOfToday(), 17),
  ],
  updateRestrictedInterval: (start: Date, end: Date) => {
    set({ restrictedTimeInterval: [start, end] });
    return [start, end];
  },

  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  // TODO: Implement and remove granularity
  updateTimeZone: (timezone: string) => {
    set({
      timeZone: timezone,
    });
    return "";
  },
  // TODO using date-fns-tz
  prepareInterval: () => {
    const { timeZone, restrictedTimeInterval, selectedDates } = get();

    const arr = [];

    const getHoursAndMinutes = (date: Date) => {
      return [getHours(date), getMinutes(date)];
    };

    const upgradeDateToDateTime = (time: Date, dateTime: Date) => {
      const [hours, minutes] = getHoursAndMinutes(dateTime);
      return addHours(addMinutes(time, minutes), hours);
    };

    const convertDateToDateTimeInterval = (
      date: Date,
      interval: [Date, Date],
      timezone: string
    ) => {
      const startTime = zonedTimeToUtc(
        upgradeDateToDateTime(date, interval[0]),
        timezone
      );
      const endTime = zonedTimeToUtc(
        upgradeDateToDateTime(date, interval[1]),
        timezone
      );

      return [startTime, endTime] as [Date, Date];
    };

    for (const date of selectedDates.values()) {
      arr.push(
        convertDateToDateTimeInterval(date, restrictedTimeInterval, timeZone)
      );
    }

    return arr;
  },
}));
