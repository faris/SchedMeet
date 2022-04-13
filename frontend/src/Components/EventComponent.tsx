import React, { useState } from "react";
import { SchedMeetEvent } from "../constants";
export const WeekEventComponent = ({ event }: { event: SchedMeetEvent }) => {
  return (
    <span>
      <strong>{event.title}</strong>
    </span>
  );
};
