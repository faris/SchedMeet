import React from "react";
import { useAvailableSlotsStore } from "../stores/availabilityStore";
import { act, renderHook } from "@testing-library/react-hooks";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
import { Action } from "history";
import addMilliseconds from "date-fns/addMilliseconds";

const DateEarlierThenFirstDate = new Date(2008, 5, 7);
const DateInTheMiddle = new Date(2009, 0, 10);
const DateSameAsLastOne = new Date(2012, 1, 3);
const DateAfterLastOne = new Date(2017, 3, 4);

const mockDatesInStore = [
  new Date(2009, 0, 1),
  new Date(2009, 0, 2),
  new Date(2009, 1, 3),
  new Date(2009, 1, 4),
  new Date(2009, 1, 5),
  new Date(2012, 1, 3),
];

test.each([
  { date: DateEarlierThenFirstDate, expected: 0 },
  { date: DateInTheMiddle, expected: 2 },
  { date: DateAfterLastOne, expected: -1 },
])(
  `retrieveCurrentDateTimeIntervalIndex($date) on the mockDates should result in $expected`,
  ({ date, expected }) => {
    const { result } = renderHook(() => useAvailableSlotsStore());

    result.current.availableDateTimeIntervals = mockDatesInStore;

    expect(result.current.retrieveCurrentDateTimeIntervalIndex(date)).toBe(
      expected
    );
  }
);

test.each([
  {
    date: DateEarlierThenFirstDate,
    action: Navigate.PREVIOUS,
    expected: mockDatesInStore[0],
  },
  {
    date: DateInTheMiddle,
    action: Navigate.PREVIOUS,
    expected: mockDatesInStore[1],
  },
  {
    date: DateAfterLastOne,
    action: Navigate.PREVIOUS,
    expected: mockDatesInStore[mockDatesInStore.length - 1],
  },
  {
    date: DateSameAsLastOne,
    action: Navigate.PREVIOUS,
    expected: mockDatesInStore[mockDatesInStore.length - 1],
  },
  {
    date: DateEarlierThenFirstDate,
    action: Navigate.NEXT,
    expected: mockDatesInStore[0],
  },
  {
    date: DateInTheMiddle,
    action: Navigate.NEXT,
    expected: mockDatesInStore[2],
  },
  {
    date: DateSameAsLastOne,
    action: Navigate.NEXT,
    expected: mockDatesInStore[0],
  },
  {
    date: DateAfterLastOne,
    action: Navigate.NEXT,
    expected: mockDatesInStore[0],
  },
])(
  `retrieveNavigatedActionDate($date, $action) on the mockDates should result in $expected`,
  ({ date, action, expected }) => {
    const { result } = renderHook(() => useAvailableSlotsStore());

    result.current.availableDateTimeIntervals = mockDatesInStore;

    expect(result.current.retrieveNavigatedActionDate(date, action)).toEqual(
      addMilliseconds(expected, action == Navigate.PREVIOUS ? -1 : 1)
    );
  }
);
