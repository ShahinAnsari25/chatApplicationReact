import chatImage from "./user01.avif";
import "bootstrap/dist/css/bootstrap.css";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useState } from "react";
import userDefaultImage from "./userDefaultImage.png";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/store.jsx";
import upload from "../lib/fileUpload.js";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState();
  const [img, setImg] = useState({
    file: null,
    url: null,
  });
  const { chatId } = useChatStore();
  const { currentUser } = useUserStore();
  const { user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  useEffect(() => {}, [open]);
  useEffect(() => {
    console.log(text);
  }, [text]);
  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (response) => {
      setChat(response.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);
  console.log(chat);

  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatSnapshot = await getDoc(userChatRef);
        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          console.log(chatId);
          console.log(chatIndex);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          console.log(userChatRef);
          await updateDoc(userChatRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
    setImg({
      file: null,
      url: null,
    });
    setText("");
  };
  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
  return (
    <div className="chatContainer">
      <div className="top">
        <div className="chatUserInfo">
          <img
            className="profilePictureI"
            src={
              isReceiverBlocked
                ? userDefaultImage
                : isCurrentUserBlocked
                ? userDefaultImage
                : user?.avatar
            }
            alt=""
          />
          <div className="chatUserName">
            <p className="name">{user?.userusername}</p>
          </div>
        </div>
        <div className="icons">
          <span className="callIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
          </span>
          <span className="videoCallIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
            </svg>
          </span>
          <span className="infoIcon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512">
              <path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z" />
            </svg>
          </span>
        </div>
      </div>
      <div className="middle">
        {chat?.messages?.map((item) => (
          <div
            className={item.senderId === currentUser.id ? "sent" : "received"}
          >
            {item.img && <img src={item.img} alt="" />}
            <p>{item.text}</p>
            <span></span>
          </div>
        ))}
        {img.url && (
          <div className="sent">
            <img src={img.url} alt="" />
            <span></span>
          </div>
        )}
        {/* <div className="sent">
          <p>
            hey how you doing i am fine what about you are you doing good in
            coding
          </p>
        </div>
        <div className="received">
          <p>thats nice i am also doing good.</p>
        </div>
        <div className="receivedImage">
          <img src={chatImage} alt="" />
        </div>
        <div className="received">
          <p>
            and yes i am learning coding more and more right now i am learning
            react
          </p>
        </div>
        <div className="sentImage">
          <img src={chatImage} alt="" />
        </div> */}
      </div>

      <div className="bottom">
        <span className="galleryIcon">
          <label htmlFor="file">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
            </svg>
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
        </span>
        <span className="cameraIcon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
          </svg>
        </span>
        <span className="micIcon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
          </svg>
        </span>
        <div className="chatTypeSection">
          <input
            type="search"
            className="form-control searchInputChat"
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You can't send  a message"
                : "type a message here..."
            }
            aria-label="Search"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          ></input>
        </div>
        <span
          className="imoji"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
          <div className="EmojiContainer">
            {open && (
              <EmojiPicker
                className="abc"
                onEmojiClick={handleEmojiClick}
              ></EmojiPicker>
            )}
          </div>
        </span>

        <div className="sendBtn">
          <button
            type="button"
            class="btn btn-primary"
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
