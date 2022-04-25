import create from "zustand";
import firebase from "firebase/compat/app";

interface AuthState {
  authToken: string;
  firebaseUser: firebase.User | null;
  currentDataStore: string;
  retrieveAuthToken: () => void;
  setFireBaseUser: (firebaseUser: firebase.User) => void;
  setCurrentDataStore: (dataStore: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authToken: "",
  firebaseUser: null,
  currentDataStore: "dydb",
  retrieveAuthToken: async () => {
    const token =
      (await firebase?.auth()?.currentUser?.getIdToken(false)) || "";
    set({ authToken: token });
  },
  setFireBaseUser: (firebaseUser: firebase.User) => {
    set({ firebaseUser: firebaseUser });
  },
  setCurrentDataStore: (dataStore: string) => {
    set({ currentDataStore: dataStore });
  },
}));
