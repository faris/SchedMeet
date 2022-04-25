import React, { useState, useEffect, useCallback } from "react";
import Container from "@mui/material/Container";
import Switch from "@mui/material/Switch";
import { DataStoreSwitch } from "./utility/DataStoreSwitch";

export const NavBar = (
  data_store: string,
  setCurrentDatasStore: (dataStore: string) => void,
  user_display_name: string
) => {
  return (
    <div
      style={{
        backgroundColor: "lightgreen",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Container>
        <div className="contents">
          <p>{`Welcome ${user_display_name}`}</p>
          {DataStoreSwitch(data_store, setCurrentDatasStore)}
        </div>
      </Container>
    </div>
  );
};
