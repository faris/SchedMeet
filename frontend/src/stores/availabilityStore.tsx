import create from "zustand";
import { startOfDay, parseISO, compareAsc, format, parse } from "date-fns";
import { devtools } from "zustand/middleware";
import { GridMap } from "../helpers/gridMap";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityState {
  bookableDates: Array<Date>;
  gridMap: GridMap | null;
  generateGridMap: (availableDateTimeSlots: Array<string>) => void;
  toggleSlot: (xPos: number, yPos: number) => void;
}

export const useAvailableSlotsStore = create<AvailabilityState>(
  devtools((set, get) => ({
    bookableDates: [],
    gridMap: null,
    generateGridMap: (availableDateTimeSlots: Array<string>) => {
      set({ gridMap: new GridMap(availableDateTimeSlots) });
    },
    toggleSlot: (xPos: number, yPos: number) => {
      const gridMap = get().gridMap;
      gridMap?.toggleSlot(yPos, xPos);
      set({ gridMap: gridMap });
    },
  }))
);
