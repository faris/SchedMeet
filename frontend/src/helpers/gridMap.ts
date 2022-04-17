import {
  startOfDay,
  parseISO,
  compareAsc,
  format,
  parse,
  formatISO,
} from "date-fns";

interface GridAxis {
  datesAxis: Array<Date>;
  timesAxis: Array<string>;
}

export interface GridMapMetaDataSlot {
  position: [number, number];
  timeSlot: Date;
  userBooked: boolean;
  bookableTime: boolean;
}

export class GridMap {
  xAxis: Array<Date>;
  yAxis: Array<string>;
  availableTimeSlots: Set<string>;
  dateLocation: Map<Date, [number, number]>;
  gridMap: Array<Array<GridMapMetaDataSlot>>;

  constructor(timeSlots: Array<string>) {
    const axises = this.generateAxises(timeSlots);
    this.xAxis = axises.datesAxis;
    this.yAxis = axises.timesAxis;
    this.dateLocation = new Map();
    this.availableTimeSlots = new Set(timeSlots);
    this.gridMap = new Array(this.xAxis.length)
      .fill([])
      .map(() => new Array(this.yAxis.length).fill(0));
    this.generateBoard();
  }

  generateAxises(availableDateTimeSlots: Array<string>): GridAxis {
    const seenTimes = new Set<string>();
    const seenDates = new Set<string>();
    const datesAvailableForEvents = [];

    for (const timeSlot of availableDateTimeSlots) {
      const timeSlotObj = parseISO(timeSlot);
      const beginningOfDayforTimeSlot = startOfDay(timeSlotObj).toISOString();
      // TODO: investigate why a space breaks things...
      seenTimes.add(format(timeSlotObj, `h:mmaa`));

      if (!seenDates.has(beginningOfDayforTimeSlot)) {
        datesAvailableForEvents.push(timeSlotObj);
        seenDates.add(beginningOfDayforTimeSlot);
      }
    }

    return {
      datesAxis: datesAvailableForEvents,
      timesAxis: [...seenTimes],
    };
  }

  generateBoard(): Array<Array<GridMapMetaDataSlot>> {
    for (const [bookableDateIndex, bookableDate] of this.xAxis.entries()) {
      for (const [
        bookableTimeSlotIndex,
        bookableTimeSlot,
      ] of this.yAxis.entries()) {
        const timeSlot = parse(bookableTimeSlot, `h:mmaa`, bookableDate);

        const GridBlockObj: GridMapMetaDataSlot = {
          position: [bookableTimeSlotIndex, bookableDateIndex],
          timeSlot: timeSlot,
          userBooked: false,
          bookableTime: this.availableTimeSlots.has(formatISO(timeSlot)),
        };

        this.gridMap[bookableDateIndex][bookableTimeSlotIndex] = GridBlockObj;
      }
    }
    return this.gridMap;
  }

  toggleSlot(xPos: number, yPos: number): Array<Array<GridMapMetaDataSlot>> {
    this.gridMap[xPos][yPos].userBooked = !this.gridMap[xPos][yPos].userBooked;
    console.log(this.gridMap[xPos][yPos]);
    return this.gridMap;
  }
}
