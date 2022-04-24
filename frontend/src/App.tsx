import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { CreateNewEventPage } from "./Components/LoggedIn";
import { HomePage } from "./Components/HomePage";
import { useAuthStore } from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "react-query";
import { Routes, Route, Link } from "react-router-dom";
import { MyCalendar } from "./Components/Calendar";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

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
        // Here we give a deterministic pusedo anonymous name, to a user where the seed is the firebase token
        if (user?.isAnonymous && user?.displayName === null) {
          const config: Config = {
            dictionaries: [adjectives, colors, animals],
            separator: "-",
            seed: user.uid,
          };

          const psuedo_anon_name = uniqueNamesGenerator(config);

          user.updateProfile({
            displayName: psuedo_anon_name,
          });

          user.updateEmail(`${psuedo_anon_name}@anonperson.schedmeet.com`);
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
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateNewEventPage />} />
        <Route path="/event/:event_id" element={<MyCalendar />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
