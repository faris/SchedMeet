import { startOfDay, parseISO, compareAsc, format, parse } from "date-fns";

interface GridAxis {
  datesAxis: Array<Date>;
  timesAxis: Array<string>;
}

export interface BookingResponse {
  availability_slot: string;
  availability_owner: string;
}

export interface GridMapMetaDataSlot {
  position: [number, number];
  participants: Set<string>;
  timeSlot: Date;
  userBooked: boolean;
  bookableTime: boolean;
}

export class GridMap {
  xAxis: Array<Date>;
  yAxis: Array<string>;
  availableTimeSlots: Set<string>;
  dateLocation: Map<string, [number, number]>;
  gridMap: Array<Array<GridMapMetaDataSlot>>;
  availableParticipantsMatrix: Array<Array<number>>;
  bookedAvailability: Array<BookingResponse>;
  userID: string;

  constructor(
    timeSlots: Array<string>,
    bookedAvailability: Array<BookingResponse>,
    userID: string
  ) {
    const axises = this.generateAxises(timeSlots);
    this.xAxis = axises.datesAxis;
    this.yAxis = axises.timesAxis;
    this.dateLocation = new Map();
    this.userID = userID;
    this.availableTimeSlots = new Set(timeSlots);
    this.bookedAvailability = bookedAvailability;
    this.gridMap = new Array(this.yAxis.length)
      .fill([])
      .map(() => new Array(this.xAxis.length).fill(0));
    this.availableParticipantsMatrix = new Array(this.yAxis.length)
      .fill([])
      .map(() => new Array(this.xAxis.length).fill(0));
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
          bookableTime: this.availableTimeSlots.has(timeSlot.toISOString()),
          participants: new Set(),
        };
        this.dateLocation.set(timeSlot.toISOString(), [
          bookableTimeSlotIndex,
          bookableDateIndex,
        ]);
        this.gridMap[bookableTimeSlotIndex][bookableDateIndex] = GridBlockObj;
      }
    }

    for (const bookedAvailability of this.bookedAvailability) {
      const [timeIndex, dateIndex] = this.dateLocation.get(
        bookedAvailability.availability_slot
      )!;

      this.gridMap[timeIndex][dateIndex].participants.add(
        bookedAvailability.availability_owner
      );

      this.availableParticipantsMatrix[timeIndex][dateIndex] =
        this.availableParticipantsMatrix[timeIndex][dateIndex] + 1;

      if (bookedAvailability.availability_owner == this.userID) {
        this.gridMap[timeIndex][dateIndex].userBooked = true;
      }
    }

    return this.gridMap;
  }

  toggleSlot(xPos: number, yPos: number): Array<Array<GridMapMetaDataSlot>> {
    this.gridMap[xPos][yPos].userBooked = !this.gridMap[xPos][yPos].userBooked;
    return this.gridMap;
  }
}
