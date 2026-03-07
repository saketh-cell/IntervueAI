"use client";

import { useEffect, useState } from "react";

export default function AILoader() {
  const messages = [
    "AI Analyzing...",
    "AI Evaluating...",
    "Generating Insights...",
    "Success with AI...",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.logo}>Intervue.AI</div>
      <div style={styles.status}>{messages[index]}</div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#ffffff",
    fontFamily: "Inter, sans-serif",
  },

  logo: {
    fontSize: "48px",
    fontWeight: "700",
    background: "linear-gradient(90deg,#2563EB,#14B8A6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  status: {
    marginTop: "15px",
    fontSize: "18px",
    color: "#444",
  },
};