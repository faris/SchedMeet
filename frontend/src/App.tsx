import React, { useEffect, useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { LoggedIn } from "./Components/LoggedIn";
import { useAuthStore } from "./stores/authStore";
import { QueryClient, QueryClientProvider } from "react-query";

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
      <LoggedIn />
    </QueryClientProvider>
  );
}

export default App;
