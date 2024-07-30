import "./search.css";
import { useContext, useRef, useState } from "react";
import MyContext from "./context";
import AddUser from "./addUser";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { useUserStore } from "../lib/store.jsx";
const Search = () => {
  const { currentUser } = useUserStore();
  const [user, setUser] = useState(null);
  const searchedName = useRef();
  const search = useContext(MyContext);
  console.log(search);
  const handleSearch = async () => {
    try {
      const userRef = collection(db, "users");
      const q = query(
        userRef,
        where("userusername", "==", searchedName.current.value)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        console.log(querySnapshot.docs[0].data());
        setUser(querySnapshot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userChats");
    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="searchContainer">
      <div className="searchSection">
        <input
          ref={searchedName}
          type="search"
          className="form-control"
          placeholder="Search..."
          aria-label="Search"
        ></input>
        <button type="button" class="btn btn-primary" onClick={handleSearch}>
          search
        </button>
      </div>
      <div className="searchedListSection">
        {user && (
          <div className="itemSearch">
            <div className="person">
              <img src={user && user.avatar} alt="" />
              <p>{user && user.userusername}</p>
            </div>
            <button type="button" class="btn btn-primary" onClick={handleAdd}>
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Search;
