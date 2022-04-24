import create from "zustand";
import { devtools } from "zustand/middleware";
import {
  GridMap,
  BookingResponse,
  GridMapMetaDataSlot,
} from "../helpers/gridMap";
import { toggleActions } from "../constants";

// TODO need to write tests for all these functions, because they are dependant on my logic......

interface AvailabilityPageState {
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
  infoPanelSlot: GridMapMetaDataSlot | null;
  setInfoPanelSlot: (xPos: number, yPos: number) => void;
}

export const useAvailabilityPageStore = create<AvailabilityPageState>(
  devtools((set, get) => ({
    eventMetadata: { title: "", description: "" },
    bookableDates: [],
    infoPanelSlot: null,
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
    setInfoPanelSlot: (xPos: number, yPos: number) => {
      const gridMap = get().gridMap;
      set({ infoPanelSlot: gridMap?.gridMap[xPos][yPos] || null });
    },
  }))
);
