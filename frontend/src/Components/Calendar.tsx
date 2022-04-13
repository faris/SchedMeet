import React, { useState, useEffect } from "react";
import "../styles/calendar-overrides.css";
import { Routes, Route, useParams } from "react-router-dom";
import { Calendar, dateFnsLocalizer, SlotInfo } from "react-big-calendar";
import { WeekEventComponent } from "../Components/EventComponent";
import { HeatMapGrid } from "react-grid-heatmap";
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
import HeatMap from "@uiw/react-heat-map";
import { useCalendarStore } from "../stores/eventStore";
import { useAuthStore } from "../stores/authStore";

import { getEventInformation } from "../service/query";

import { useAvailableSlotsStore } from "../stores/availabilityStore";

import { useQuery, useQueryClient } from "react-query";
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
  const { authToken, retrieveAuthToken } = useAuthStore();
  const { event_id } = useParams();
  const { setEventMetadata, eventMetadata } = useCalendarStore();

  const {
    setAvailableDateTimeIntervals,
    availableDateTimeIntervals,
    availableTimeSlots,
  } = useAvailableSlotsStore();

  useEffect(() => {
    retrieveAuthToken();
  }, []);

  const queryClient = useQueryClient();

  // background cache on failure of operation or after 5 mins and a remount.

  const fetchCalendarEvents = useQuery(
    ["fetchCalendarEvents", authToken],
    () => getEventInformation(authToken, event_id || ""),
    {
      onSuccess: (response) => {
        setAvailableDateTimeIntervals(response.data.availableDateTimeIntervals);
        setEventMetadata(
          response.data.event_title,
          response.data.event_description
        );
      },

      enabled: !!authToken && event_id !== undefined,
    }
  );

  const xLabels = availableDateTimeIntervals.map(
    (date) => `${format(date, "EEEE MM-dd-yy")}`
  );
  const yLabels = availableTimeSlots;

  console.log(xLabels, yLabels);

  const data = new Array(yLabels.length)
    .fill(0)
    .map(() =>
      new Array(xLabels.length)
        .fill(0)
        .map(() => Math.floor(Math.random() * 50 + 50))
    );

  return (
    <>
      <h1>{eventMetadata.title}</h1>
      <p>{eventMetadata.description}</p>
      <HeatMapGrid
        data={data}
        xLabels={xLabels}
        yLabels={yLabels}
        // Reder cell with tooltip
        cellRender={(x, y, value) => (
          <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
        )}
        cellStyle={(_x, _y, ratio) => ({
          background: `rgb(12, 160, 44, ${ratio})`,
          fontSize: ".8rem",
          color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
          width: `6rem`,
          flex: `0 0 6rem`,
        })}
        cellHeight="3rem"
        xLabelsPos="top"
        onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
        square={false}
      />
    </>
  );
};
