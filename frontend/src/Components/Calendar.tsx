import React, { useState, useEffect } from "react";
import "../styles/calendar-overrides.css";
import { useParams } from "react-router-dom";
import { HeatMapGrid } from "react-grid-heatmap";
import format from "date-fns/format";
import ToggleButton from "@mui/material/ToggleButton";
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

  const { generateGridMap, gridMap, toggleSlot } = useAvailableSlotsStore();

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
        generateGridMap(response.data.availableTimeSlots);
        setEventMetadata(
          response.data.event_title,
          response.data.event_description
        );
      },

      enabled: !!authToken && event_id !== undefined,
    }
  );

  if (gridMap) {
    const xLabels = gridMap.xAxis.map(
      (date) => `${format(date, "EEEE MM-dd-yy")}`
    );
    const yLabels = gridMap.yAxis;

    const data = new Array(yLabels.length)
      .fill(0)
      .map(() =>
        new Array(xLabels.length)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10))
      );

    console.log(gridMap);
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
                  gridMap.gridMap[y][x]
                )}`}
              >
                {gridMap.gridMap[y][x].bookableTime ? value : "unbookable"}
              </div>
            )}
            cellStyle={(x, y, ratio) =>
              gridMap.gridMap[y][x].bookableTime
                ? {
                    background: gridMap.gridMap[y][x].userBooked
                      ? `rgb(12, 160, 44)`
                      : `rgb(180, 180, 180)`,
                    fontSize: ".8rem",
                    color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
                    width: `6rem`,
                    flex: `1 1 6rem`,
                  }
                : {
                    background: `rgba(255,0,0,0.5)`,
                    pointerEvents: `none`,
                    fontSize: ".8rem",
                    width: `6rem`,
                    flex: `1 1 6rem`,
                  }
            }
            cellHeight="3rem"
            xLabelsPos="top"
            onClick={(x, y) => toggleSlot(x, y)}
          />
        </div>
      </>
    );
  }
  return <></>;
};
