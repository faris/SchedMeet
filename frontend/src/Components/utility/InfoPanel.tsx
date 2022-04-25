import React from "react";
import { GridMapMetaDataSlot } from "../../helpers/gridMap";
import Switch from "@mui/material/Switch";

export const InfoPanel = (gridMapSlot: GridMapMetaDataSlot | null) => {
  return (
    <div className="info-panel">
      {gridMapSlot == null ? (
        <h1>Hover over an element to see its metadata </h1>
      ) : (
        <>
          <p>
            {gridMapSlot.userBooked
              ? "You have booked yourself as available for this slot " +
                `There are ${gridMapSlot.participants.size} users who are free at this time.`
              : "You are not available for this slot."}
          </p>
          <div style={{ marginTop: "16px" }}>
            {[...gridMapSlot.participants].map(
              ({ user_id, user_email, user_name }) => (
                <>
                  <hr />
                  <div style={{ margin: "16px 0px" }} key={user_id}>
                    <label className="info-label">Email</label>
                    <p>{user_email}</p>
                    <label className="info-label">Username</label>
                    <p>{user_name}</p>
                  </div>
                </>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};
