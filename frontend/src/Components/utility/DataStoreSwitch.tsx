import React from "react";

import Switch from "@mui/material/Switch";
export const DataStoreSwitch = (
  data_store: string,
  setCurrentDataStore: (dataStore: string) => void
) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentDataStore(event.target.checked ? "psql" : "dydb");
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p>Currently using {`${data_store}`}</p>
      {<Switch onChange={handleChange}></Switch>}
    </div>
  );
};
