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
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

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
    setSubmitting(true);

    try {
      await login(formData);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login page error:", err);
      setError(
        err?.response?.data?.message || err?.message || "Invalid email or password"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="brand-content">
          <h1 className="brand-title">Intervue.AI</h1>
          <p className="brand-text">
            This is a place where you can check your knowledge and improve your
            interview skills.
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
                value={formData.email}
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
                  value={formData.password}
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

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
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