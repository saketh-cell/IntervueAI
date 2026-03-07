"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/src/context/AuthContext";
import AILoader from "@/src/components/AILoader";
import "@/src/styles/login.css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AILoader />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="brand-content">
          <h1 className="brand-title">Intervue.AI</h1>
          <p className="brand-text">
            This is a Place Where you can check your knowledge and improve your
            Interview Skills. We provide you with a Resume Analyzer, Mock
            Interview and many other features to help you prepare for your next
            interview. We are here to help you succeed in your career.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-heading">Welcome Back, Future Hire</h2>
          <p className="login-subheading">
            Login to continue to your dashboard
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                type="email"
                name="email"
                className="login-input"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="login-input"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>

              <div style={{ marginTop: 8, textAlign: "right" }}>
                <span
                  onClick={() => router.push("/forgot-password")}
                  style={{ cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Forgot password?
                </span>
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          <div className="login-footer">
            Don’t have an account?{" "}
            <span onClick={() => router.push("/register")}>
              Register
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}