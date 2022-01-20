import create from "zustand";
import firebase from "firebase/compat/app";

interface AuthState {
  authToken: string;
  firebaseUser: firebase.User | null;
  retrieveAuthToken: () => void;
  setFireBaseUser: (firebaseUser: firebase.User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authToken: "",
  firebaseUser: null,
  retrieveAuthToken: async () => {
    const token =
      (await firebase?.auth()?.currentUser?.getIdToken(false)) || "";
    set({ authToken: token });
  },
  setFireBaseUser: (firebaseUser: firebase.User) => {
    set({ firebaseUser: firebaseUser });
  },
}));
