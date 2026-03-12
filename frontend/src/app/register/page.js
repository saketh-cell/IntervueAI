"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/src/context/AuthContext";
import AILoader from "@/src/components/AILoader";
import "@/src/styles/register.css";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(formData);
      router.push("/dashboard");
    } catch (err) {
      console.error("Register page error:", err);
      setError(
        err?.response?.data?.message || err?.message || "Registration failed. Try again."
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
            Create your account and start your interview preparation journey
            with us. Access a wide range of coding problems, mock interviews,
            and personalized feedback to ace your next tech interview.
          </p>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2 className="login-heading">
            Create an Account & Get Interview Ready 🎯
          </h2>

          <p className="login-subheading">
            Register to access your dashboard
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                type="text"
                name="name"
                className="login-input"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
              <input
                type="password"
                name="password"
                className="login-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="login-footer">
            Already have an account?{" "}
            <span onClick={() => router.push("/login")}>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}