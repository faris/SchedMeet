import React from "react";
import { GridMapMetaDataSlot } from "../../helpers/gridMap";

export const InfoPanel = (gridMapSlot: GridMapMetaDataSlot | null) => {
  return (
    <div className="info-panel">
      {gridMapSlot == null ? (
        <h1>Hover over an element to see its metadata </h1>
      ) : (
        <>
          <p>
            {gridMapSlot.userBooked
              ? "You have booked yourself as available for this slot"
              : "You are not available for this slot."}
          </p>
          <h3>{`Particpants: ${JSON.stringify([
            ...gridMapSlot.participants,
          ])}`}</h3>
          <p>Hi Mom</p>
        </>
      )}
      ;
    </div>
  );
};
