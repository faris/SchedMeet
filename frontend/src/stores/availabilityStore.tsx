import create from "zustand";
import firebase from "firebase/compat/app";
import { SchedMeetEvent, calendarPath, testTimesArray } from "../constants";
import axios from "axios";
import { useMutation } from "react-query";
import { stringOrDate } from "react-big-calendar";

interface AvailabilityState {
  availableDateTimeIntervals: Array<[Date, Date]>;
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => Array<[Date, Date]>;
}

export const useAvailableSlotsStore = create<AvailabilityState>((set, get) => ({
  availableDateTimeIntervals: [],
  setAvailableDateTimeIntervals: (
    availableDateTimeIntervals: Array<[string, string]>
  ) => {
    const arr = [];

    for (const date of availableDateTimeIntervals) {
      arr.push([new Date(date[0]), new Date(date[1])]);
    }

    // set({
    //   availableDateTimeIntervals: availableDateTimeIntervals,
    // });

    return availableDateTimeIntervals;
  },
}));
