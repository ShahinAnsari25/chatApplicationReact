import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";
export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("user exists");
        console.log(docSnap.data());
        set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("user does not exists");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));
