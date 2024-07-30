import "./login.css";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRef, useState } from "react";
import { auth } from "../lib/firebase";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const password = useRef();
  const email = useRef();
  const handleLogin = async () => {
    setLoading(true);
    const userEmail = email.current.value;
    const userPassword = password.current.value;
    console.log(userEmail);
    console.log(userPassword);
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      toast.success("Login sucessful");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="outerContainerLogin">
      <div className="loginContainer">
        <h1>Welcome back !</h1>
        <div className="username">
          <div class="input-group mb-3 inputFiled">
            <span class="input-group-text" id="basic-addon1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
            </span>
            <input
              ref={email}
              type="text"
              class="form-control userNameInput"
              placeholder="Email"
              aria-label="Username"
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
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
