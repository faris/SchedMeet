import {
  compareAsc,
  addMinutes,
  addHours,
  getHours,
  getMinutes,
  formatISO,
} from "date-fns";

import { zonedTimeToUtc } from "date-fns-tz";

// Generates an array of Date objects within an interval (inclusive of both ends)
export const generateDateTimeArrayFromDateTimeInterval = (
  startTime: Date,
  endTime: Date
) => {
  const timeSlots = [];
  let tempTime = startTime;

  while (compareAsc(endTime, tempTime) > -1) {
    timeSlots.push(tempTime);
    tempTime = addMinutes(tempTime, 30);
  }

  return timeSlots;
};

// Given a date pull the minutes and hours out.
const getHoursAndMinutes = (date: Date) => {
  return [getHours(date), getMinutes(date)];
};

/* 
The datetime given has the actual time interval (but wrong date), 
meanwhile the date has the correct date but wrong time (it is midnight)
this fixes both of these issues for us.
*/
const upgradeDateToDateTime = (time: Date, dateTime: Date) => {
  const [hours, minutes] = getHoursAndMinutes(dateTime);
  return addHours(addMinutes(time, minutes), hours);
};

// TODO: unit test
export const generateAllTimeSlots = (
  date: Date,
  interval: [Date, Date],
  timezone: string
) => {
  const timeSlots = generateDateTimeArrayFromDateTimeInterval(
    interval[0],
    interval[1]
  );

  const timeSlotsWithTimeSpecifiedTimeZone = timeSlots.map((time) =>
    formatISO(zonedTimeToUtc(upgradeDateToDateTime(date, time), timezone))
  );

  return timeSlotsWithTimeSpecifiedTimeZone;
};
