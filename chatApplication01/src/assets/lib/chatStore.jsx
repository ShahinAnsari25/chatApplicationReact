import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { useUserStore } from "./store.jsx";
export const useChatStore = create((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  changeChat: (chatId, user) => {
    console.log(chatId);
    console.log(user);
    const currentUser = useUserStore.getState().currentUser;
    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      console.log("chatStore is being called");
      return set({
        chatId,
        user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    console.log("chnage state is being called");
    set((state) => ({
      ...state,
      isReceiverBlocked: !state.isReceiverBlocked,
    }));
  },
  handleLogOut:()=>{
    set({
      chatId: null,
      user: null,
    })
  }
}));
