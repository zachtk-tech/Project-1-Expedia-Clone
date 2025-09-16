import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { auth } from "../01_firebase/config_firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, userRigister } from "../Redux/Authantication/auth.action";

const initialState = {
  number: "",
  otp: "",
  user_name: "",
  password: "",
  verify: false,
  otpVerify: false,
};

export const Register = () => {
  const [check, setCheck] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { number, otp, verify, otpVerify, user_name, password } = check;

  const { user, isLoading } = useSelector((store) => ({
    user: store.LoginReducer.user,
    isLoading: store.LoginReducer.isLoading,
  }));

  let exist = user.some(u => `+91${u.number}` === `+91${number}`);

  // Initialize reCAPTCHA once
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

  const handleChange = (e) => {
    setCheck({ ...check, [e.target.name]: e.target.value });
  };

  const handleVerifyNumber = () => {
    if (number.length !== 10) {
      document.querySelector("#loginMesageError").innerText = "Mobile Number is Invalid!";
      return;
    }

    if (exist) {
      document.querySelector("#loginMesageError").innerText = "User Already exists";
      return;
    }

    document.querySelector("#nextButton").innerText = "Please wait...";
    const phoneNumber = `+91${number}`;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setCheck({ ...check, verify: true });
        document.querySelector("#loginMesageSuccess").innerText = `OTP sent to ${number}!`;
        document.querySelector("#loginMesageError").innerText = "";
        document.querySelector("#nextButton").style.display = "none";
      })
      .catch((error) => {
        console.error("OTP send error:", error);
        document.querySelector("#loginMesageError").innerText = "Failed to send OTP. Try again.";
        document.querySelector("#nextButton").innerText = "Next";
      });
  };

  const verifyCode = () => {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        setCheck({ ...check, otpVerify: true });
        document.querySelector("#loginMesageSuccess").innerText = "Verified Successfully!";
        document.querySelector("#loginMesageError").innerText = "";
      })
      .catch(() => {
        document.querySelector("#loginMesageError").innerText = "Invalid OTP";
      });
  };

  const handleRegisterUser = () => {
    const newUser = {
      number: `+91${number}`,
      user_name,
      password,
      email: "",
      dob: "",
      gender: "",
      marital_status: null,
    };
    
    dispatch(userRigister(newUser));
    setCheck(initialState);
    navigate("/login");
  };

  return (
    <div className="mainLogin">
      <div id="recaptcha-container"></div>
      <div className="loginBx">
        <div className="logoImgdivReg">
          <img className="imglogoReg" src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg" alt="logo" />
        </div>
        <div className="loginHead"><hr /><hr /><hr /><h1>Register</h1></div>

        {!verify && (
          <div className="loginInputB" id="loginNumber">
            <label>Enter Your Number</label>
            <span>
              <input type="number" name="number" value={number} onChange={handleChange} placeholder="Number" />
              <button onClick={handleVerifyNumber} id="nextButton">Next</button>
            </span>
          </div>
        )}

        {verify && !otpVerify && (
          <div className="loginInputB" id="loginOtp">
            <label>Enter OTP</label>
            <span>
              <input type="number" name="otp" value={otp} onChange={handleChange} />
              <button onClick={verifyCode}>Verify</button>
            </span>
          </div>
        )}

        {otpVerify && (
          <>
            <div className="loginInputB">
              <label>Enter Your Full Name</label>
              <span><input type="text" name="user_name" value={user_name} onChange={handleChange} /></span>
            </div>
            <div className="loginInputB">
              <label>Your Password</label>
              <span><input type="password" name="password" value={password} onChange={handleChange} /></span>
            </div>
            <div className="loginInputB">
              <button onClick={handleRegisterUser}>Continue</button>
            </div>
          </>
        )}

        {isLoading && <h1>Please wait...</h1>}

        <h3 id="loginMesageError"></h3>
        <h3 id="loginMesageSuccess"></h3>
      </div>
    </div>
  );
};
