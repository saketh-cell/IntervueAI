"use client";

import { useEffect, useState, useRef } from "react";

export default function QuestionTimer({
  seconds = 1800, // 30 minutes
  questionKey,
  paused = false,
  onTimeUp,
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const firedRef = useRef(false);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(seconds);
    firedRef.current = false;
  }, [questionKey, seconds]);

  useEffect(() => {
    if (paused) return;

    if (timeLeft <= 0) {
      if (!firedRef.current) {
        firedRef.current = true;
        onTimeUp?.();
      }
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, paused, onTimeUp]);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const bg =
    timeLeft <= 60
      ? "#b91c1c" // last minute red
      : timeLeft <= 300
      ? "#b45309" // last 5 min orange
      : "#111";

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: bg,
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 12,
        fontWeight: 800,
        zIndex: 9999,
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        userSelect: "none",
        fontSize: "18px",
      }}
      aria-label="Question timer"
    >
      ⏱ {mm}:{ss}
    </div>
  );
}