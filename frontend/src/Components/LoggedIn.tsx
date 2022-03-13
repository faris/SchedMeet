import React, { useEffect } from "react";
import firebase from "firebase/compat/app";
import { useAuthStore } from "../stores/authStore";
import { MyCalendar } from "./Calendar";
import { SignupForm } from "./CreateEvent";

export const CreateNewEventPage = () => {
  const { retrieveAuthToken, authToken, firebaseUser } = useAuthStore();

  useEffect(() => {
    retrieveAuthToken();
  }, []);

  if (authToken === "") {
    return <span> Loading.....</span>;
  }

  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebaseUser?.displayName}! You are now signed-in!</p>
      {/* <p>Current Token: {authToken}</p> */}
      <p>Unique ID: {firebaseUser?.uid}</p>
      <SignupForm></SignupForm>
      <button onClick={() => firebase.auth().signOut()}>Sign-out</button>
    </div>
  );
};
