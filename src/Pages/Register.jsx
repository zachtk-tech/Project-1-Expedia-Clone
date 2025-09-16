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

  const { user } = useSelector((store) => ({
    user: store.LoginReducer.user,
  }));

  // Check if number exists
  const exist = user.some(u => u.number === `+91${number}`);

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

    if (exist) {
      document.querySelector("#loginMesageError").innerText = "User already exists!";
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
        console.error(err);
        document.querySelector("#loginMesageError").innerText = "Failed to send OTP. Try again.";
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
        <div className="loginHead"><hr /><hr /><hr /><h1>Register</h1></div>

        {/* Phone input */}
        {!verify && (
          <div className="loginInputB">
            <label>Enter Your Number</label>
            <span>
              <input type="number" name="number" value={number} onChange={handleChange} />
              <button onClick={handleVerifyNumber}>Send OTP</button>
            </span>
          </div>
        )}

        {/* OTP input */}
        {verify && !otpVerify && (
          <div className="loginInputB">
            <label>Enter OTP</label>
            <span>
              <input type="number" name="otp" value={otp} onChange={handleChange} />
              <button onClick={verifyCode}>Verify OTP</button>
            </span>
          </div>
        )}

        {/* User info after OTP */}
        {otpVerify && (
          <>
            <div className="loginInputB">
              <label>Full Name</label>
              <input type="text" name="user_name" value={user_name} onChange={handleChange} />
            </div>
            <div className="loginInputB">
              <label>Password</label>
              <input type="password" name="password" value={password} onChange={handleChange} />
            </div>
            <div className="loginInputB">
              <button onClick={handleRegisterUser}>Complete Registration</button>
            </div>
          </>
        )}

        <h3 id="loginMesageError"></h3>
        <h3 id="loginMesageSuccess"></h3>
      </div>
    </div>
  );
};
