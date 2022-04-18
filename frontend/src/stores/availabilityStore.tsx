import create from "zustand";
import { startOfDay, parseISO, compareAsc, format, parse } from "date-fns";
import { devtools } from "zustand/middleware";
import { GridMap, BookingResponse } from "../helpers/gridMap";
import { toggleActions } from "../constants";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  bookableDates: Array<Date>;
  gridMap: GridMap | null;
  generateGridMap: (
    availableDateTimeSlots: Array<string>,
    availableTimeSlots: Array<BookingResponse>,
    userID: string
  ) => void;
  toggleSlot: (xPos: number, yPos: number) => toggleActions;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    bookableDates: [],
    gridMap: null,
    generateGridMap: (
      availableDateTimeSlots: Array<string>,
      availableTimeSlots: Array<BookingResponse>,
      userID: string
    ) => {
      set({
        gridMap: new GridMap(
          availableDateTimeSlots,
          availableTimeSlots,
          userID
        ),
      });
    },
    toggleSlot: (xPos: number, yPos: number) => {
      const gridMap = get().gridMap;
      const actionDone = gridMap?.gridMap[yPos][xPos].userBooked
        ? "UNTOGGLE"
        : "TOGGLE";
      gridMap?.toggleSlot(yPos, xPos);
      set({ gridMap: gridMap });
      return actionDone;
    },
  }))
);
