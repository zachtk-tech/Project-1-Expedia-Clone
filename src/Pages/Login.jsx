import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import { auth } from "../01_firebase/config_firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, login_user } from "../Redux/Authantication/auth.action";

const initialState = { number: "", otp: "", verify: false };

export const Login = () => {
  const [check, setCheck] = useState(initialState);
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((store) => ({
    isAuth: store.LoginReducer.isAuth,
    user: store.LoginReducer.user,
  }));

  const { number, otp, verify } = check;
  const exist = user.some(u => u.number === `+91${number}`);
  const userData = user.find(u => u.number === `+91${number}`);  

  useEffect(() => {
    dispatch(fetch_users);
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "invisible" },
        auth
      );
    }
  }, [dispatch]);

  const handleChange = (e) => setCheck({ ...check, [e.target.name]: e.target.value });

  const handleVerifyNumber = () => {
    if (number.length !== 10) {
      document.querySelector("#loginMesageError").innerText = "Mobile Number is Invalid!";
      return;
    }

    if (!exist) {
      document.querySelector("#loginMesageError").innerText = "User does not exist!";
      return;
    }

    const phoneNumber = `+91${number}`;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setCheck({ ...check, verify: true });
        document.querySelector("#loginMesageSuccess").innerText = `OTP sent to ${number}!`;
        document.querySelector("#loginMesageError").innerText = "";
      })
      .catch((err) => {
        console.error("OTP send error:", err);
        document.querySelector("#loginMesageError").innerText = "Failed to send OTP. Try again.";
      });
  };

  const verifyCode = () => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        dispatch(login_user(userData));
        document.querySelector("#loginMesageSuccess").innerText = "Verified Successfully!";
        document.querySelector("#loginMesageError").innerText = "";
      })
      .catch(() => {
        document.querySelector("#loginMesageError").innerText = "Invalid OTP";
      });
  };

  return (
    <div className="mainLogin">
      <div id="recaptcha-container"></div>
      <div className="loginBx">
        <div className="loginHead"><hr /><hr /><hr /><h1>SignIn</h1></div>

        {!verify && (
          <div className="loginInputB">
            <label>Enter Your Number</label>
            <span>
              <input type="number" name="number" value={number} onChange={handleChange} />
              <button onClick={handleVerifyNumber}>Sign In</button>
            </span>
          </div>
        )}

        {verify && (
          <div className="loginInputB">
            <label>Enter OTP</label>
            <span>
              <input type="number" name="otp" value={otp} onChange={handleChange} />
              <button onClick={verifyCode}>Continue</button>
            </span>
          </div>
        )}

        <Link to="/register">Don't have an Account</Link>

        <h3 id="loginMesageError"></h3>
        <h3 id="loginMesageSuccess"></h3>
      </div>
    </div>
  );
};
