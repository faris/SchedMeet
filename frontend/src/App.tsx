import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { LoggedIn } from "./Components/LoggedIn";
import { useAuthStore } from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route, Link } from "react-router-dom";
import { MyCalendar } from "./Components/Calendar";
import { enableMapSet } from "immer";

enableMapSet();

const queryClient = new QueryClient();

const firebaseConfig = {
  apiKey: "AIzaSyBGo3J39Lyfai2wjVi_5MsTGDFmCcE7v34",

  authDomain: "schedmeet.firebaseapp.com",

  projectId: "schedmeet",

  storageBucket: "schedmeet.appspot.com",

  messagingSenderId: "395404504769",

  appId: "1:395404504769:web:37f04cf38bd19772c36e40",
};

firebase.initializeApp(firebaseConfig);

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: "popup",

  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    "anonymous",
  ],

  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const { setFireBaseUser } = useAuthStore();
  // Listen to the Firebase Auth state and set the local state.
  // Make sure we un-register Firebase observers when the component unmounts.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        // TODO: maybe give identifiers to anonymous accounts.
        if (user?.isAnonymous && user?.displayName === null) {
          user.updateProfile({
            displayName: "Jane Q. User",
          });
        }

        setIsSignedIn(!!user);
        if (user !== null) {
          setFireBaseUser(user);
        }
      });
    return () => unregisterAuthObserver();
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LoggedIn />} />
        <Route path="/event" element={<LoggedIn />} />
        <Route path="/calendar" element={<MyCalendar />} />
        {/* <Route path="about" element={<About />} /> */}
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
