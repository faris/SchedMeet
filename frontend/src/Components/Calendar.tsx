import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { testTimesArray } from "../constants";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { SchedMeetEvent } from "../constants";
import { v4 as uuidv4 } from "uuid";
import { stringOrDate } from "react-big-calendar";

// https://github.com/jquense/react-big-calendar/issues/1842
// TODO: Investigate fix later
const DragAndDropCalendar = withDragAndDrop(Calendar as any);

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const MyCalendar = () => {
  const [calendarEvents, setCalendarEvents] = useState(testTimesArray);

  const moveEvent: withDragAndDropProps["onEventResize"] = ({
    event,
    start,
    end,
    isAllDay,
  }: {
    event: SchedMeetEvent;
    start: stringOrDate;
    end: stringOrDate;
    isAllDay: boolean;
  }) => {
    const events = calendarEvents;

    let allDay = event.allDay;

    if (!event.allDay && isAllDay) {
      allDay = true;
    } else if (event.allDay && !isAllDay) {
      allDay = false;
    }

    const nextEvents = events.map((existingEvent) => {
      return existingEvent?.resource?.event_id == event?.resource?.event_id
        ? ({ ...existingEvent, start, end, allDay } as SchedMeetEvent)
        : existingEvent;
    });

    setCalendarEvents(nextEvents);
  };

  const resizeEvent = ({
    event,
    start,
    end,
  }: {
    event: SchedMeetEvent;
    start: stringOrDate;
    end: stringOrDate;
  }) => {
    const events = calendarEvents;

    const nextEvents = events.map((existingEvent) => {
      return existingEvent?.resource?.event_id == event?.resource?.event_id
        ? ({ ...existingEvent, start, end } as SchedMeetEvent)
        : existingEvent;
    });

    setCalendarEvents(nextEvents);

    //alert(`${event.title} was resized to ${start}-${end}`)
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    const title = window.prompt("New Event Name");

    if (title) {
      // TODO: State Management Tool needed now.
      const newEvent = {
        start: slotInfo.start as Date,
        end: slotInfo.end as Date,
        resource: { event_id: uuidv4() },
        title: title,
      };

      setCalendarEvents([...calendarEvents, newEvent]);
    }

    console.log(slotInfo, calendarEvents.length);
  };

  return (
    <div>
      <DragAndDropCalendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        resizable
        onEventResize={resizeEvent}
        defaultView={"week"}
        onSelectSlot={onSelectSlot}
        onSelectEvent={(event) => alert(event.title)}
        style={{ height: "60vh" }}
        onEventDrop={moveEvent}
        views={["week", "day", "agenda"]}
        scrollToTime={new Date()}
      />
    </div>
  );
};
