"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyResetOtp, sendResetOtp } from "@/src/services/password.service";
import "@/src/styles/login.css";

export default function VerifyOtpPage() {
  const router = useRouter();
  const params = useSearchParams();

  // ✅ derive directly from URL, no state needed
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState({ loading: false, msg: "", error: "" });

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", error: "" });

    try {
      const res = await verifyResetOtp(email, otp);
      setStatus({
        loading: false,
        msg: res.message || "OTP verified",
        error: "",
      });

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setStatus({
        loading: false,
        msg: "",
        error: err?.response?.data?.message || "Invalid OTP",
      });
    }
  };

  const resend = async () => {
    setStatus({ loading: true, msg: "", error: "" });

    try {
      const res = await sendResetOtp(email);
      setStatus({
        loading: false,
        msg: res.message || "OTP resent",
        error: "",
      });
    } catch (err) {
      setStatus({
        loading: false,
        msg: "",
        error: err?.response?.data?.message || "Failed to resend OTP",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-right" style={{ width: "100%" }}>
        <div className="login-card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 className="login-heading">Verify OTP</h2>
          <p className="login-subheading">Enter the OTP sent to your email</p>

          {status.error && <div className="error-message">{status.error}</div>}
          {status.msg && <div className="success-message">{status.msg}</div>}

          <form onSubmit={handleVerify}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="login-input" value={email} disabled />
            </div>

            <div className="input-group">
              <label className="input-label">OTP</label>
              <input
                className="login-input"
                type="text"
                inputMode="numeric"
                placeholder="6 digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
              />
            </div>

            <button className="login-button" disabled={status.loading || !email}>
              {status.loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>

          <div style={{ marginTop: 12, textAlign: "right" }}>
            <span
              onClick={resend}
              style={{ cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Resend OTP
            </span>
          </div>

          <div className="login-footer">
            Back to <span onClick={() => router.push("/login")}>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}