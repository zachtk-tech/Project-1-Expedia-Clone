import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { auth } from "../01_firebase/config_firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, login_user } from "../Redux/Authantication/auth.action";

const initialState = { number: "", otp: "", verify: false };

export const Login = () => {
  const [check, setCheck] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { number, otp, verify } = check;
  const { isAuth, user } = useSelector(store => ({
    isAuth: store.LoginReducer.isAuth,
    user: store.LoginReducer.user,
  }));

  const cleanedNumber = number.replace(/\D/g, "");
  const exist = user.some(u => u.number === `+91${cleanedNumber}`);
  const userData = user.find(u => u.number === `+91${cleanedNumber}`);

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

  useEffect(() => {
    if (isAuth) {
      navigate("/"); // redirect after successful login
    }
  }, [isAuth, navigate]);

  const handleChange = (e) => setCheck({ ...check, [e.target.name]: e.target.value });

  const handleVerifyNumber = () => {
    if (cleanedNumber.length !== 10) {
      document.querySelector("#loginMesageError").innerText = "Mobile Number is Invalid!";
      return;
    }

    if (!exist) {
      document.querySelector("#loginMesageError").innerText = "User does not exist!";
      return;
    }

    const phoneNumber = `+91${cleanedNumber}`;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setCheck({ ...check, verify: true });
        document.querySelector("#loginMesageSuccess").innerText = `OTP sent to ${cleanedNumber}!`;
        document.querySelector("#loginMesageError").innerText = "";
      })
      .catch((err) => {
        console.error(err);
        document.querySelector("#loginMesageError").innerText = "Failed to send OTP. Try again.";
      });
  };

  const verifyCode = () => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        dispatch(login_user(userData)); // should update isAuth
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

        <div className="loginLinks">
          <Link to="/register">Don't have an Account</Link>
          <Link to="/admin"> | Admin Login</Link>
        </div>


        <h3 id="loginMesageError"></h3>
        <h3 id="loginMesageSuccess"></h3>
      </div>
    </div>
  );
};
