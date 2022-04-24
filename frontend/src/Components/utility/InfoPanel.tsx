import React from "react";
import { GridMapMetaDataSlot } from "../../helpers/gridMap";

export const InfoPanel = (gridMapSlot: GridMapMetaDataSlot | null) => {
  return (
    <div className="info-panel">
      {/* https://stackoverflow.com/questions/31190885/json-stringify-a-set */}
      <h1 className="info-panel-title">{`${JSON.stringify(
        gridMapSlot,
        (_key, value) => (value instanceof Set ? [...value] : value)
      )}`}</h1>
    </div>
  );
};
