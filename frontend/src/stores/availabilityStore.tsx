import create from "zustand";
import { startOfDay, parseISO, compareAsc, format, parse } from "date-fns";
import { devtools } from "zustand/middleware";
import { GridMap, BookingResponse } from "../helpers/gridMap";
import { toggleActions } from "../constants";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  bookableDates: Array<Date>;
  gridMap: GridMap | null;
  eventMetadata: { title: string; description: string };
  setEventMetadata: (title: string, description: string) => void;
  generateGridMap: (
    availableDateTimeSlots: Array<string>,
    availableTimeSlots: Array<BookingResponse>,
    userID: string
  ) => void;
  toggleSlot: (xPos: number, yPos: number) => toggleActions;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    eventMetadata: { title: "", description: "" },
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
      const actionDone = gridMap?.gridMap[xPos][yPos].userBooked
        ? "UNTOGGLE"
        : "TOGGLE";
      gridMap?.toggleSlot(xPos, yPos);
      set({ gridMap: gridMap });
      return actionDone;
    },
    setEventMetadata: (title: string, description: string) => {
      set({ eventMetadata: { title: title, description: description } });
    },
  }))
);
