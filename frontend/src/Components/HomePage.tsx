import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useAuthStore } from "../stores/authStore";
import { useQuery } from "react-query";
import { getUserEvents } from "../service/query";
import { EventsOwnedRow } from "../constants";
import { Link } from "react-router-dom";

export const HomePage = () => {
  const { retrieveAuthToken, authToken, firebaseUser } = useAuthStore();

  const [eventIDs, setEventIDs] = React.useState<Array<EventsOwnedRow>>([]);

  useEffect(() => {
    retrieveAuthToken();
  }, []);

  useQuery(
    ["fetchEventsOwnedByUser", authToken],
    () => getUserEvents(authToken),
    {
      onSuccess: (response) => {
        setEventIDs(response.data.events_owned);
      },

      enabled: !!authToken,
    }
  );

  if (authToken === "") {
    return <span> Loading.....</span>;
  }

  return (
    <div>
      <h1>Welcome {firebaseUser?.displayName}! You are now signed-in!</h1>
      <p>Unique ID: {firebaseUser?.uid}</p>
      <p>Unique Email: {firebaseUser?.email}</p>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Event Title</TableCell>
              <TableCell>Event ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventIDs.map((row) => (
              <TableRow
                key={row.event_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.event_title}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link to={`/event/${row.event_id}`}>{row.event_id}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
    </div>
  );
};
