import "bootstrap/dist/css/bootstrap.css";

import image from "./user02.avif";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/store";
import { db } from "../lib/firebase.js";
import userDefaultImage from "./userDefaultImage.png";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import "./contactDetails.css";
const ContactDetails = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    handleLogOut,
  } = useChatStore();
  const { currentUser } = useUserStore();
  const handleBlock = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);
    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="contactDetails">
      <div className="contactNameDp">
        <img
          src={
            isReceiverBlocked
              ? userDefaultImage
              : isCurrentUserBlocked
              ? userDefaultImage
              : user?.avatar
          }
          alt=""
        />
        <p className="contactName">{user.userusername}</p>
      </div>
      <div className="listContainer">
        <div className="chatSettingsContainer">
          <p>Chat Settings</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z" />
          </svg>
        </div>
        <div className="privacyAndHelpContainer">
          <p>Privacy & help</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z" />
          </svg>
        </div>
        <div className="SharedPhotosContainer">
          <p>Shared photos</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM377 271c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-87-87-87 87c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 167c9.4-9.4 24.6-9.4 33.9 0L377 271z" />
          </svg>
        </div>
        <div className="sharedPhotosData">
          <div className="imageContainer">
            <span className="imgNameContainer">
              <img src={image} alt="" />
              <p className="imageName">photo_2024.png</p>
            </span>
            <span className="downloadIcon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z" />
              </svg>
            </span>
          </div>
          <div className="imageContainer">
            <span className="imgNameContainer">
              <img src={image} alt="" />
              <p className="imageName">photo_2024.png</p>
            </span>
            <span className="downloadIcon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6L269.8 394.5c-3.8 3.5-8.7 5.5-13.8 5.5s-10.1-2-13.8-5.5L135.1 294.6c-4.5-4.2-7.1-10.1-7.1-16.3c0-12.3 10-22.3 22.3-22.3l57.7 0 0-96c0-17.7 14.3-32 32-32l32 0c17.7 0 32 14.3 32 32l0 96 57.7 0c12.3 0 22.3 10 22.3 22.3c0 6.2-2.6 12.1-7.1 16.3z" />
              </svg>
            </span>
          </div>
        </div>
        <div className="sharedFilesContainer">
          <p>Shared files</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM135 241c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l87 87 87-87c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L273 345c-9.4 9.4-24.6 9.4-33.9 0L135 241z" />
          </svg>
        </div>
      </div>
      <div className="btnSectionContactPage">
        <button
          type="button"
          class="btn btn-danger blockBtn"
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? "You are blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block user"}
        </button>
        <button
          type="button"
          class="btn btn-info logOutBtn"
          onClick={() => {
            handleLogOut();
            auth.signOut();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default ContactDetails;
