// This code is full and does not use index.css or something else to worry about. (besides the imports)
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LoginRegisterSplit() {
  const [selected, setSelected] = useState(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e, form) => {
    const { name, value } = e.target;
    if (form === "login") {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const triggerError = (message) => {
    setError(message);
    setShowError(true);
    setTimeout(() => {
      setShowError(false);
      setError("");
    }, 3000);
  };

  const handleLogin = async () => {
  if (!loginData.email || !loginData.password) {
    triggerError("Please fill in all login fields.");
    return;
  }

  try {
    const res = await axios.post(
      "https://mybankingapp-regandlogin-backend.onrender.com/api/auth/login",
      loginData
    );

    localStorage.setItem('token', res.data.token);
    navigate("/dashboard");
  } catch (err) {
    triggerError(err.response?.data?.message || "Login failed.");
  }
};


const handleRegister = async () => {
  if (!registerData.email || !registerData.password || !registerData.name) {
    triggerError("Please fill in all registration fields.");
    return;
  }

  try {
    const res = await axios.post(
      "https://mybankingapp-regandlogin-backend.onrender.com/api/auth/register",
      registerData
    );

    localStorage.setItem('token', res.data.token);
    navigate("/dashboard");
  } catch (err) {
    triggerError(err.response?.data?.message || "Registration failed.");
  }
};


  const handleReset = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({ name: "", email: "", password: "" });
    setSelected(null);
    setError("");
    setShowError(false);
  };

  return (
    <>
      <style>{`
        @keyframes flicker {
          0%   { color: red; }
          10%  { color: gray; }
          20%  { color: red; }
          30%  { color: gray; }
          40%  { color: red; }
          50%  { color: gray; }
          60%  { color: red; }
        }

        .flicker-error {
          animation: flicker 1s ease-in-out 1;
          font-weight: bold;
          margin-bottom: 1rem;
          color: red;
        }

        .container {
          display: flex;
          width: 800px;
          height: 400px;
          border: 2px solid #333;
          margin: 13rem auto;
          overflow: hidden;
          font-family: Arial, sans-serif;
          user-select: none;
        }

        .panel {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: flex-grow 0.5s ease;
          cursor: pointer;
          position: relative;
          padding: 20px;
          box-sizing: border-box;
        }

        .panel:not(:last-child)::after {
          content: "";
          position: absolute;
          right: 0;
          top: 10%;
          height: 80%;
          width: 2px;
          background: #555;
          opacity: 1;
          transform: translateX(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: none;
        }

        .container.selected .panel:not(:last-child)::after {
          opacity: 0;
          transform: translateX(20px);
        }

        .container:not(.selected) .panel:hover {
          flex-grow: 3;
        }

        .container:not(.selected) .panel:hover ~ .panel {
          flex-grow: 1;
        }

        .container.selected .panel {
          cursor: default;
        }

        .container.selected .panel.hidden {
          flex-grow: 0 !important;
          width: 0;
          padding: 0;
          opacity: 0;
          pointer-events: none;
          transition: flex-grow 0.5s ease, opacity 0.5s ease, padding 0.5s ease, width 0.5s ease;
        }

        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          position: relative;
          width: 100%;
          max-width: 260px;
        }

        h2 {
          margin-bottom: 20px;
        }

        input {
          display: block;
          width: 100%;
          padding: 8px 10px;
          margin-bottom: 12px;
          border-radius: 4px;
          border: 1px solid #aaa;
          font-size: 14px;
        }

        button {
          padding: 10px 18px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        button:hover {
          background: #0056b3;
        }

        .reset-btn-text {
          font-size: 0.8rem;
          color: #7c7c7c;
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          cursor: pointer;
        }

        .reset-btn-text:hover {
          color: #7098aa;
        }
      `}</style>

      {showError && (
        <p className="flicker-error" style={{ textAlign: "center" }}>{error}</p>
      )}

      <div className={`container ${selected ? "selected" : ""}`}>
        {/* LOGIN PANEL */}
        <div
          className={`panel login ${selected === "register" ? "hidden" : ""}`}
          onClick={() => !selected && setSelected("login")}
        >
          <div className="content">
            <h2>Login</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => handleChange(e, "login")}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => handleChange(e, "login")}
            />
            <button onClick={handleLogin}>Login</button>
            {selected === "login" && (
              <p className="reset-btn-text" onClick={handleReset}>
                Choose Again
              </p>
            )}
          </div>
        </div>

        {/* REGISTER PANEL */}
        <div
          className={`panel register ${selected === "login" ? "hidden" : ""}`}
          onClick={() => !selected && setSelected("register")}
        >
          <div className="content">
            <h2>Register</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) => handleChange(e, "register")}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => handleChange(e, "register")}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) => handleChange(e, "register")}
            />
            <button onClick={handleRegister}>Register</button>
            {selected === "register" && (
              <p className="reset-btn-text" onClick={handleReset}>
                Choose Again
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRegisterSplit;
