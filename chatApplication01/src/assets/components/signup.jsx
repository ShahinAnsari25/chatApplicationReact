import { useRef, useState } from "react";
import "./signup.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../lib/firebase.js";
import upload from "../lib/fileUpload.js";
import { doc, setDoc } from "firebase/firestore";
import userImage from "./user01.avif";
import userDefaultImage from "./userDefaultImage.png";
const SignUp = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const [avatar, setavatar] = useState({ file: null, url: "" });
  const [loading, setLoading] = useState(false);
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setavatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      console.log(avatar);
    }
  };
  const handleSubmit = async () => {
    setLoading(true);
    const imgUrl = await upload(avatar.file);
    const userusername = username.current.value;
    const useremail = email.current.value;
    const userpassword = password.current.value;
    console.log(useremail);
    console.log(userpassword);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        useremail,
        userpassword
      );
      await setDoc(doc(db, "users", res.user.uid), {
        userusername,
        useremail,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });

      toast.success("account created successfully.");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="signupContainer">
      <h1>Create an Account</h1>
      <form
        action="
      "
      >
        <div className="profileAvatar">
          <div className="avatar">
            <label htmlFor="file">
              <img src={avatar.url || userDefaultImage} alt="" />

              <b className="uploadText">Upload an avatar</b>
            </label>
          </div>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={handleAvatar}
          />
        </div>
        <div className="username">
          <div class="input-group mb-3 inputFiled">
            <span class="input-group-text" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
              </svg>
            </span>
            <input
              ref={username}
              type="text"
              class="form-control userNameInput"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              name="username"
            />
          </div>
        </div>
        <div className="email">
          <div class="input-group mb-3 inputFiled">
            <span class="input-group-text" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </span>
            <input
              ref={email}
              type="text"
              class="form-control emailInput"
              placeholder="Email"
              aria-label="Email"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="password">
          <div class="input-group mb-3 inputFiled">
            <span class="input-group-text" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z" />
              </svg>
            </span>
            <input
              ref={password}
              type="password"
              class="form-control passwordInput"
              placeholder="Password"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div className="btnSection">
          <button
            disabled={loading}
            type="button"
            class="btn btn-primary"
            onClick={handleSubmit}
          >
            {loading ? "loading..." : "SignUp"}
          </button>
        </div>
      </form>
    </div>
  );
};
export default SignUp;
