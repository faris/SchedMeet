import React, { useState, useEffect, useCallback } from "react";
import "../styles/calendar-overrides.css";
import { useParams, useNavigate } from "react-router-dom";
import { HeatMapGrid } from "react-grid-heatmap";
import format from "date-fns/format";
import { InfoPanel } from "../Components/utility/InfoPanel";
import Container from "@mui/material/Container";

import { useAuthStore } from "../stores/authStore";
import { getEventInformation } from "../service/query";
import { useAvailabilityPageStore } from "../stores/availabilityStore";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { updateEventMutationFunction } from "../service/mutation";
import { AvailabilityBookingAction } from "../constants";
import { RenderDivCell, RenderCellStyle } from "./utility/cellUtilities";

export const MyCalendar = () => {
  const { authToken, retrieveAuthToken, firebaseUser, currentDataStore } =
    useAuthStore();
  const { event_id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    generateGridMap,
    gridMap,
    toggleSlot,
    setEventMetadata,
    eventMetadata,
    infoPanelSlot,
    setInfoPanelSlot,
  } = useAvailabilityPageStore();

  const updateAvailablitySlotMutation = useMutation(
    updateEventMutationFunction,
    {
      mutationKey: "updateAvailablitySlot",
      onSuccess: () => {
        queryClient.invalidateQueries("fetchCalendarEvents");
      },
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
          time_slot: gridMap!.gridMap[x][y].timeSlot!,
        };

        updateAvailablitySlotMutation.mutate({
          newAvailabilityBooking,
          authToken,
          currentDataStore,
        });
      }
    },
    [event_id, gridMap]
  );

  useQuery(
    ["fetchCalendarEvents", authToken, currentDataStore],
    () => getEventInformation(authToken, event_id || "", currentDataStore),
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
      onError: (response) => {
        navigate("/error");
      },
      retry: 1,
      enabled: !!authToken && event_id !== undefined,
    }
  );

  if (gridMap) {
    const xLabels = gridMap.xAxis.map(
      (date: Date) => `${format(date, "EEEE MM-dd-yy")}`
    );
    const yLabels = gridMap.yAxis;

    return (
      <Container>
        <h1>{eventMetadata.title}</h1>
        <p>{eventMetadata.description}</p>
        <div className="availability-booking-page">
          <div className="meeting-grid">
            <HeatMapGrid
              data={gridMap.availableParticipantsMatrix}
              xLabels={xLabels}
              yLabels={yLabels}
              // Reder cell with tooltip
              cellRender={(x, y, value) =>
                RenderDivCell(x, y, value, gridMap, setInfoPanelSlot)
              }
              cellStyle={(x, y, ratio) => RenderCellStyle(x, y, ratio, gridMap)}
              cellHeight="3rem"
              xLabelsPos="top"
              onClick={setGridToggle}
            />
          </div>
          {InfoPanel(infoPanelSlot)}
        </div>
      </Container>
    );
  }
  return <></>;
};
