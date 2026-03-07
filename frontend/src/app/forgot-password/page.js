"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendResetOtp } from "@/src/services/password.service";
import "@/src/styles/login.css"; // reuse same styles

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ loading: false, msg: "", error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", error: "" });

    try {
      const res = await sendResetOtp(email);
      
      setStatus({ loading: false, msg: res.message || "OTP sent", error: "" });

      
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.log("OTP error", err);
      setStatus({
        loading: false,
        msg: "",
        error: err?.response?.data?.message || "Failed to send OTP",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-right" style={{ width: "100%" }}>
        <div className="login-card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 className="login-heading">Forgot Password</h2>
          <p className="login-subheading">We will send OTP to your email</p>

          {status.error && <div className="error-message">{status.error}</div>}
          {status.msg && <div className="success-message">{status.msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="login-input"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button className="login-button" disabled={status.loading}>
              {status.loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          <div className="login-footer">
            Back to{" "}
            <span onClick={() => router.push("/login")}>
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}