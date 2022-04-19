import React, { useState, useEffect, useCallback } from "react";
import "../styles/calendar-overrides.css";
import { useParams } from "react-router-dom";
import { HeatMapGrid } from "react-grid-heatmap";
import format from "date-fns/format";
import ToggleButton from "@mui/material/ToggleButton";
import enUS from "date-fns/locale/en-US";

import { useCalendarStore } from "../stores/eventStore";
import { useAuthStore } from "../stores/authStore";
import { getEventInformation } from "../service/query";
import { useAvailableSlotsStore } from "../stores/availabilityStore";
import { useQuery, useMutation } from "react-query";
import { updateEventMutationFunction } from "../service/mutation";
import { AvailabilityBookingAction } from "../constants";

export const MyCalendar = () => {
  const { authToken, retrieveAuthToken, firebaseUser } = useAuthStore();
  const { event_id } = useParams();
  const { setEventMetadata, eventMetadata } = useCalendarStore();

  const { generateGridMap, gridMap, toggleSlot } = useAvailableSlotsStore();

  const updateAvailablitySlotMutation = useMutation(
    updateEventMutationFunction,
    {
      mutationKey: "updateAvailablitySlot",
    }
  );

  useEffect(() => {
    retrieveAuthToken();
  }, []);

  const setGridToggle = useCallback(
    (x: number, y: number) => {
      if (event_id && gridMap) {
        const actionDone = toggleSlot(x, y);
        const newAvailabilityBooking: AvailabilityBookingAction = {
          event_id: event_id,
          action: actionDone,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          time_slot: gridMap!.gridMap[y][x].timeSlot!,
        };

        updateAvailablitySlotMutation.mutate({
          newAvailabilityBooking,
          authToken,
        });
      }
    },
    [event_id, gridMap]
  );

  useQuery(
    ["fetchCalendarEvents", authToken],
    () => getEventInformation(authToken, event_id || ""),
    {
      onSuccess: (response) => {
        generateGridMap(
          response.data.availableTimeSlots,
          response.data.booked_slots,
          firebaseUser!.uid
        );
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
      (date: Date) => `${format(date, "EEEE MM-dd-yy")}`
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
            onClick={setGridToggle}
          />
        </div>
      </>
    );
  }
  return <></>;
};
