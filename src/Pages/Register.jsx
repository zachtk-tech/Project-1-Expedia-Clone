import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import { auth } from "../01_firebase/config_firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, userRigister } from "../Redux/Authantication/auth.action";
import Navbar from "../Components/Navbar";

const state = {
  number: "",
  otp: "",
  user_name: "",
  password: "",
  verify: false,
  otpVerify: false,
};

export const Register = () => {
  const [check, setCheck] = useState(state);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let exist = false;
  const { number, otp, verify, otpVerify, user_name, password } = check;

  // store value and getting user to check if the number is exist or not
  const { user, isLoading } = useSelector((store) => {
    return {
      user: store.LoginReducer.user,
      isLoading: store.LoginReducer.isLoading,
    };
  });

  // check if the user exists
  for (let i = 0; i <= user.length - 1; i++) {
    if (user[i].number === number) {
      exist = true;
      break;
    }
  }

  // register user
  const handleRegisterUser = () => {
    let newObj = {
      number,
      user_name,
      password,
      email: "",
      dob: "",
      gender: "",
      marital_status: null,
    };
    dispatch(userRigister(newObj));
    setCheck(state);
    navigate("/login"); // ✅ better than window.location
  };
  
  // reCAPTCHA
  function onCapture() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          handleVerifyNumber();
        },
      },
      auth
    );
  }

  // verify number
  function handleVerifyNumber() {
    document.querySelector("#nextButton").innerText = "Please wait...";
    onCapture();
    const phoneNumber = `+91${number}`;
    const appVerifier = window.recaptchaVerifier;

    if (number.length === 10) {
      if (exist) {
        document.querySelector("#loginMesageError").innerHTML =
          "User Already exists";
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
      } else {
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setCheck({ ...check, verify: true });
            document.querySelector(
              "#loginMesageSuccess"
            ).innerHTML = `Otp sent to ${number} !`;
            document.querySelector("#loginMesageError").innerHTML = "";
            document.querySelector("#nextButton").style.display = "none";
          })
          .catch(() => {
            document.querySelector("#nextButton").innerText = "Server Error";
          });
      }
    } else {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML =
        "Mobile Number is Invalid!";
    }
  }

  // verify OTP
  function verifyCode() {
    window.confirmationResult
      .confirm(otp)
      .then(() => {
        setCheck({ ...check, otpVerify: true });
        document.querySelector(
          "#loginMesageSuccess"
        ).innerHTML = `Verified Successfully`;
        document.querySelector("#loginMesageError").innerHTML = "";
        document.querySelector("#loginNumber").style.display = "none";
        document.querySelector("#loginOtp").style.display = "none";
      })
      .catch(() => {
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
        document.querySelector("#loginMesageError").innerHTML = "Invalid OTP";
      });
  }

  // handle input change
  const handleChangeMobile = (e) => {
    let val = e.target.value;
    setCheck({ ...check, [e.target.name]: val });
  };

  useEffect(() => {
    dispatch(fetch_users);
  }, [dispatch]);

  return (
    <>
      <div className="mainLogin">
        <div id="recaptcha-container"></div>
        <div className="loginBx">
          <div className="logoImgdivReg">
            <img
              className="imglogoReg"
              src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg"
              alt="logo"
            />
          </div>

          <div className="loginHead">
            <hr />
            <hr />
            <hr />
            <h1>Register</h1>
          </div>

          {/* Phone number input */}
          <div className="loginInputB" id="loginNumber">
            <label>Enter Your Number</label>
            <span>
              <input
                type="number"
                readOnly={verify}
                name="number"
                value={number}
                onChange={handleChangeMobile}
                placeholder="Number"
              />
              <button
                disabled={verify}
                onClick={handleVerifyNumber}
                id="nextButton"
              >
                Next
              </button>
            </span>
          </div>

          {/* OTP input */}
          {verify && (
            <div className="loginInputB" id="loginOtp">
              <label>Enter OTP</label>
              <span>
                <input
                  type="number"
                  name="otp"
                  value={otp}
                  onChange={handleChangeMobile}
                />
                <button onClick={verifyCode}>Next</button>
              </span>
            </div>
          )}

          {/* Username + Password after OTP */}
          {otpVerify && (
            <>
              <div className="loginInputB">
                <label>Enter Your Full Name</label>
                <span>
                  <input
                    type="text"
                    name="user_name"
                    value={user_name}
                    onChange={handleChangeMobile}
                  />
                </span>
              </div>
              <div className="loginInputB">
                <label>Your Password</label>
                <span>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChangeMobile}
                  />
                </span>
              </div>
              <div className="loginInputB">
                <button onClick={handleRegisterUser}>Continue</button>
              </div>
            </>
          )}

          {isLoading && <h1>Please wait...</h1>}

          <div className="loginTerms">
            <div className="inpChecbx">
              <input className="inp" type="checkbox" />{" "}
              <h2>Keep me signed in</h2>
            </div>
            <p>
              Selecting this checkbox will keep you signed into your account on
              this device until you sign out. Do not select this on shared
              devices.
            </p>
            <h6>
              By signing in, I agree to the Expedia{" "}
              <span>Terms and Conditions</span>, <span>Privacy Statement</span>{" "}
              and <span>Expedia Rewards Terms and Conditions</span>.
            </h6>
          </div>
          <br />
          <h3 id="loginMesageError"></h3>
          <h3 id="loginMesageSuccess"></h3>
        </div>
      </div>
    </>
  );
};
