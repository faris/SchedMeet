import React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export const TextFieldCopy = () => {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <InputBase sx={{ ml: 1, flex: 1 }} value="Share" readOnly />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        sx={{ p: "8px" }}
        onClick={() => {
          alert("clicked");
        }}
      >
        <ContentCopyIcon />
      </IconButton>
    </Paper>
  );
};
