import "bootstrap/dist/css/bootstrap.css";
import "./chatList.css";
import userImage from "./user01.avif";
import { useContext, useEffect, useState } from "react";
import MyContext from "./context";
import Search from "./search";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { useUserStore } from "../lib/store";
import { useChatStore } from "../lib/chatStore";
import userDefaultImage from "./userDefaultImage.png";

const ChatList = () => {
  const [mode, setMode] = useState(false);
  const { currentUser } = useUserStore();
  const { changeChat, isReceiverBlocked } = useChatStore();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    console.log(currentUser.id);
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        // setChats(doc.data());
        // console.log(chats);
        console.log(res.data().chats);
        // const items = res.data().chats;
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );
    return () => {
      unSub();
    };
  }, [currentUser.id]);
  const handleSelect = async (selectedUser) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === selectedUser.chatId
    );
    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userChats", currentUser.id);
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(selectedUser.chatId, selectedUser.user);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chatListContainer">
      <div className="searchBarContainer">
        <div className="addBtn" onClick={() => setMode((prev) => !prev)}>
          {!mode ? (
            <svg
              className="addBtnIcon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          ) : (
            <svg
              className="addBtnIcon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
            </svg>
          )}
        </div>
      </div>
      <div className="chatItemContainer">
        {chats.map((currentItem) => (
          <div
            className="item"
            key={currentItem.id}
            onClick={() => {
              handleSelect(currentItem);
            }}
            style={{
              backgroundColor: currentItem?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <div className="profilePic">
              <img
                src={
                  currentItem.user.blocked.includes(currentUser.id)
                    ? userDefaultImage
                    : isReceiverBlocked
                    ? userDefaultImage
                    : currentItem.user.avatar
                }
                alt=""
              />
            </div>
            <div className="nameChat">
              <p className="name">
                {currentItem.user.blocked.includes(currentUser.id)
                  ? "User"
                  : isReceiverBlocked
                  ? "User"
                  : currentItem.user.userusername}
              </p>
              <p className="latestChat">{currentItem.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {mode && <Search className="searchComponent"></Search>}
    </div>
  );
};
export default ChatList;
