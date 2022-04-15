import React from "react";
import { useAvailableSlotsStore } from "../stores/availabilityStore";
import { act, renderHook } from "@testing-library/react-hooks";
import { Navigate, NavigateAction, TitleOptions } from "react-big-calendar";
import { Action } from "history";
import addMilliseconds from "date-fns/addMilliseconds";
import { parseISO } from "date-fns";
import { generateDateTimeArrayFromDateTimeInterval } from "../helpers/timeUtils";

const startOfWorkDayExample = parseISO("2022-04-18T19:00:00.000Z");
const lunchTimeExample = parseISO("2022-04-18T21:00:00.000Z");

const results = [
  parseISO("2022-04-18T19:00:00.000Z"),
  parseISO("2022-04-18T19:30:00.000Z"),
  parseISO("2022-04-18T20:00:00.000Z"),
  parseISO("2022-04-18T20:30:00.000Z"),
  parseISO("2022-04-18T21:00:00.000Z"),
];

describe("Time based helper functions", () => {
  test("Generate an array of timeslots based off a range (inclusive)", () => {
    expect(
      generateDateTimeArrayFromDateTimeInterval(
        startOfWorkDayExample,
        lunchTimeExample
      )
    ).toEqual(results);
  });
});
