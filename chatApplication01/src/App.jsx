import User from "./assets/components/user";
import Chat from "./assets/components/chat";
import ContactDetails from "./assets/components/contactDetails";
import "./App.css";
import SignUp from "./assets/components/signup";
import Login from "./assets/components/login";
import { useEffect, useState } from "react";
import Notification from "./assets/components/notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./assets/lib/firebase";
import { useUserStore } from "./assets/lib/store";
import { useChatStore } from "./assets/lib/chatStore";

function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  useEffect(() => {
    const onSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      onSub();
    };
  }, []);
  const { chatId } = useChatStore();
  // const myContext = UseMyContext();
  return (
    <div className="container">
      {currentUser && <User></User>}
      {currentUser && chatId && <Chat></Chat>}
      {currentUser && chatId && <ContactDetails></ContactDetails>}
      {!currentUser && <SignUp></SignUp>}
      {!currentUser && <Login />}
      <Notification></Notification>
    </div>
  );
}

export default App;
