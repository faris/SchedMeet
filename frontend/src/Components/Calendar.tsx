import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { SchedMeetEvent, testTimesArray } from "../constants";
import { v4 as uuidv4 } from "uuid";
import { stringOrDate } from "react-big-calendar";
import { useCalendarStore } from "../stores/eventStore";
import { useAuthStore } from "../stores/authStore";
import {
  addEventMutationFunction,
  updateEventMutationFunction,
} from "../service/mutation";
import { getEvents } from "../service/query";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
  const { authToken } = useAuthStore();
  const { setCalendarEvents, calendarEvents, addEvent, moveCalendarEvent } =
    useCalendarStore();
  const queryClient = useQueryClient();

  console.log(calendarEvents);

  // background cache on failure of operation or after 5 mins and a remount.
  const fetchCalendarEvents = useQuery(
    ["fetchCalendarEvents", authToken],
    () => getEvents(authToken),
    {
      onSuccess: (data) => {
        setCalendarEvents(data);
      },
      staleTime: 300000,
    }
  );

  const addEventMutation = useMutation(addEventMutationFunction, {
    mutationKey: "addNewEvent",
  });

  const updateEventMutation = useMutation(updateEventMutationFunction, {
    mutationKey: "addNewEvent",
  });

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
    const movedEvent = moveCalendarEvent(event, start, end, isAllDay);
    console.log(movedEvent);

    if (movedEvent) {
      updateEventMutation.mutate(
        { movedEvent, authToken },
        {
          onError: () => {
            queryClient.invalidateQueries(["fetchCalendarEvents"]);
            alert(
              `ERROR: Moving of event ${movedEvent.title} did not go through, please try again`
            );
          },
        }
      );
    }
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
    console.log("resizing........");
  };

  const onSelectSlot = (slotInfo: SlotInfo) => {
    const title = window.prompt("New Event Name");

    if (title) {
      const newEvent = {
        start: slotInfo.start as Date,
        end: slotInfo.end as Date,
        resource: { event_id: uuidv4() },
        title: title,
      };
      addEventMutation.mutate(
        { newEvent, authToken },
        {
          onError: () => {
            queryClient.invalidateQueries(["fetchCalendarEvents"]);
            alert(
              `ERROR: Event ${newEvent.title} did not go through, please try again`
            );
          },
        }
      );
      addEvent(newEvent);
    }
  };

  if (fetchCalendarEvents.isLoading) {
    return <span>Loading...</span>;
  }

  if (fetchCalendarEvents.isError) {
    return <span>Error: {fetchCalendarEvents.error}</span>;
  }

  return (
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
  );
};
