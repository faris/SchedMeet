import React from "react";
import { useAvailableSlotsStore } from "../stores/availabilityStore";
import { act, renderHook } from "@testing-library/react-hooks";

const availableDates = [];

test("", () => {
  const { result } = renderHook(() => useAvailableSlotsStore());

  const x = result.current.availableDateTimeIntervals;

  expect(result.current.availableDateTimeIntervals).toEqual([]);
});
