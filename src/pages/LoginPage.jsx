import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginPage.css"
import API_BASE_URL from "./config";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [token, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      login(res.data.token); // ✅ store token
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card shadow-lg p-4 rounded-4 animate-fadeIn">
        <div className="text-center mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/747/747376.png"
            alt="Investment Logo"
            width="70"
            className="mb-2"
          />
          <h3 className="text-accent">InvestingKaro</h3>
          <p className="fw text-white">Login to your investment dashboard</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <div className="mt-3 text-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    `${API_BASE_URL}/api/auth/google`,
                    {
                      token: credentialResponse.credential,
                    }
                  );

                  login(res.data.token);
                  toast.success("Logged in with Google");
                  navigate("/dashboard");
                } catch (err) {
                  toast.error("Google login failed");
                }
              }}
              onError={() => toast.error("Google Sign-In failed")}
            />
          </div>

        </form>

        <div className="text-center mt-3">
          <a href="#" className="text-accent text-decoration-none">
            Forgot Password?
          </a>
        </div>
      </div>

      <div className="login-illustration">
        <img
          src="https://cdn.dribbble.com/users/2429264/screenshots/14089530/media/af19a2ea50905af776e8eec978de501e.png?resize=1000x750&vertical=center"
          alt="Finance Illustration"
          className="floating-image"
        />
      </div>
    </div>
  );
};

export default LoginPage;
