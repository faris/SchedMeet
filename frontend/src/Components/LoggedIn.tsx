import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { testAuthPath } from "../constants";
import axios from "axios";

export const LoggedIn = () => {
  const [authToken, setAuthToken] = useState("");
  const [name, setName] = useState("");
  const [uid, setUID] = useState("");

  const setUpAuthToken = async () => {
    const newAuthToken = await firebase?.auth()?.currentUser?.getIdToken(true);
    const displayName = firebase?.auth()?.currentUser?.displayName;
    setAuthToken(newAuthToken || authToken);
    setName(displayName || name);
  };

  const testAuthenticatedRequest = async () => {
    const resp = await axios.post(
      testAuthPath,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    setUID(resp.data.user_id);
    return resp;
  };

  useEffect(() => {
    setUpAuthToken();
  });

  // TODO: do this in  a less hacky way
  useEffect(() => {
    console.log("authToken set");
    if (authToken !== "") {
      testAuthenticatedRequest();
    }
  }, [authToken]);

  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {name}! You are now signed-in!</p>
      <p>Current Token: {authToken}</p>
      <p>Unique ID: {uid}</p>
      <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
    </div>
  );
};
