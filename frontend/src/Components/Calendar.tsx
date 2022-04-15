import React, { useState, useEffect } from "react";
import "../styles/calendar-overrides.css";
import { useParams } from "react-router-dom";
import { HeatMapGrid } from "react-grid-heatmap";
import format from "date-fns/format";

import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCalendarStore } from "../stores/eventStore";
import { useAuthStore } from "../stores/authStore";
import { getEventInformation } from "../service/query";
import { useAvailableSlotsStore } from "../stores/availabilityStore";
import { useQuery, useQueryClient } from "react-query";

export const MyCalendar = () => {
  const { authToken, retrieveAuthToken } = useAuthStore();
  const { event_id } = useParams();
  const { setEventMetadata, eventMetadata } = useCalendarStore();

  const {
    setBookableDateTimeSlots,
    bookableDates,
    bookableTimeSlots,
    setGridMapMetaData,
    gridMapMetaData,
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
        setBookableDateTimeSlots(response.data.availableTimeSlots);
        setEventMetadata(
          response.data.event_title,
          response.data.event_description
        );
        setGridMapMetaData();
      },

      enabled: !!authToken && event_id !== undefined,
    }
  );

  const xLabels = bookableDates.map(
    (date) => `${format(date, "EEEE MM-dd-yy")}`
  );
  const yLabels = bookableTimeSlots;

  const data = new Array(yLabels.length)
    .fill(0)
    .map(() =>
      new Array(xLabels.length)
        .fill(0)
        .map(() => Math.floor(Math.random() * 10))
    );

  return (
    <>
      <h1>{eventMetadata.title}</h1>
      <p>{eventMetadata.description}</p>
      <div className="meeting-grid">
        <HeatMapGrid
          data={data}
          xLabels={xLabels}
          yLabels={yLabels}
          // Reder cell with tooltip
          cellRender={(x, y, value) => (
            <div
              style={{ outlineStyle: "dashed" }}
              title={`(${x}, ${y}) = ${JSON.stringify(
                gridMapMetaData.get(`(${x},${y})`)
              )}`}
            >
              {value}
            </div>
          )}
          cellStyle={(_x, _y, ratio) => ({
            background: `rgb(12, 160, 44, ${ratio})`,
            fontSize: ".8rem",
            color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
            width: `6rem`,
            flex: `1 1 6rem`,
          })}
          cellHeight="3rem"
          xLabelsPos="top"
          onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
        />
      </div>
    </>
  );
};
