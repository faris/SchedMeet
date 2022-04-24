import React from "react";
import { GridMap } from "../../helpers/gridMap";

export const RenderDivCell = (
  x: number,
  y: number,
  value: number,
  gridMap: GridMap
) => {
  return (
    <div title={`(${x}, ${y}) = ${JSON.stringify(gridMap.gridMap[x][y])}`}>
      {gridMap.gridMap[x][y].bookableTime ? value : "unbookable"}
    </div>
  );
};

export const RenderCellStyle = (
  x: number,
  y: number,
  ratio: number,
  gridMap: GridMap
) => {
  return gridMap.gridMap[x][y].bookableTime
    ? {
        background: gridMap.gridMap[x][y].userBooked
          ? `rgb(12, 160, 44)`
          : `rgb(12, 200, 44, ${ratio / 1.2 + 0.1})`,
        fontSize: ".8rem",
        color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
        width: `6rem`,
        flex: `1 1 6rem`,
        borderColor: gridMap.gridMap[x][y].userBooked ? `black` : `grey`,
        borderWidth: gridMap.gridMap[x][y].userBooked ? `thick` : `thin`,
      }
    : {
        background: `rgba(255,0,0,0.75)`,
        pointerEvents: `none`,
        fontSize: ".8rem",
        width: `6rem`,
        flex: `1 1 6rem`,
      };
};
