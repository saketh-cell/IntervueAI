"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/src/services/password.service";
import "@/src/styles/login.css";

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    msg: "",
    error: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: "", error: "" });

    try {
      const res = await resetPassword(email, newPassword);

      setStatus({
        loading: false,
        msg: res.message || "Password updated",
        error: "",
      });

      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      setStatus({
        loading: false,
        msg: "",
        error: err?.response?.data?.message || "Failed to reset password",
      });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-right" style={{ width: "100%" }}>
        <div className="login-card" style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 className="login-heading">Reset Password</h2>
          <p className="login-subheading">Set a new password for your account</p>

          {status.error && <div className="error-message">{status.error}</div>}
          {status.msg && <div className="success-message">{status.msg}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input className="login-input" value={email} disabled />
            </div>

            <div className="input-group">
              <label className="input-label">New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            </div>

            <button className="login-button" disabled={status.loading || !email}>
              {status.loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="login-footer">
            Back to <span onClick={() => router.push("/login")}>Login</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="login-wrapper">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}