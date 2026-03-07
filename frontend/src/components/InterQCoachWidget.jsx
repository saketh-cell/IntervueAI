"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadHistory, streamChat } from "@/src/services/interqChat.service";

export default function InterQCoachWidget() {
  const [open, setOpen] = useState(false);

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "coach", text: "Hi 👋 I’m InterQ Coach. Ask me anything!" },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [typingDots, setTypingDots] = useState("");

  const listRef = useRef(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !streaming,
    [input, streaming]
  );

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  // Typing dots while streaming
  useEffect(() => {
    if (!streaming) return;

    const t = setInterval(() => {
      setTypingDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 350);

    return () => clearInterval(t);
  }, [streaming]);

  // Load history when widget opens
  useEffect(() => {
    if (!open) return;

    const saved = localStorage.getItem("interq_sessionId");
    if (saved) setSessionId(saved);

    (async () => {
      try {
        const data = await loadHistory(saved);

        if (data?.sessionId) {
          setSessionId(data.sessionId);
          localStorage.setItem("interq_sessionId", data.sessionId);
        }

        if (data?.messages?.length) {
          setMessages(
            data.messages.map((m) => ({ sender: m.sender, text: m.text }))
          );
        }

        setTimeout(scrollToBottom, 0);
      } catch (error) {
        // ✅ show history load error (most useful when 401)
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load history";
        setMessages((prev) => [
          ...prev,
          { sender: "coach", text: `⚠️ ${msg}` },
        ]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const send = async () => {
    if (!canSend) return;

    const userText = input.trim();
    setInput("");

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);

    // Add empty coach bubble to stream into
    setMessages((prev) => [...prev, { sender: "coach", text: "" }]);

    setStreaming(true);
    setTimeout(scrollToBottom, 0);

    let localSessionId = sessionId;

    try {
      await streamChat({
        sessionId: localSessionId,
        message: userText,

        onMeta: ({ sessionId: sid }) => {
          if (sid && sid !== localSessionId) {
            localSessionId = sid;
            setSessionId(sid);
            localStorage.setItem("interq_sessionId", sid);
          }
        },

        onDelta: ({ delta }) => {
          if (!delta) return;

          setMessages((prev) => {
            const copy = [...prev];
            for (let i = copy.length - 1; i >= 0; i--) {
              if (copy[i].sender === "coach") {
                copy[i] = {
                  ...copy[i],
                  text: (copy[i].text || "") + delta,
                };
                break;
              }
            }
            return copy;
          });

          requestAnimationFrame(scrollToBottom);
        },

        onDone: () => {
          setStreaming(false);
          setTypingDots("");
          setTimeout(scrollToBottom, 0);
        },

        onError: ({ message }) => {
          // ✅ backend SSE error event
          setStreaming(false);
          setTypingDots("");
          setMessages((prev) => [
            ...prev,
            { sender: "coach", text: `⚠️ ${message || "Streaming failed"}` },
          ]);
        },
      });
    } catch (error) {
      // ✅ show exact fetch error (401/404/500)
      const msg =
        error?.message ||
        error?.response?.data?.message ||
        "Streaming failed. Try again.";

      setStreaming(false);
      setTypingDots("");
      setMessages((prev) => [
        ...prev,
        { sender: "coach", text: `⚠️ ${msg}` },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open InterQ Coach"
        title="InterQ Coach"
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          background: "#4f46e5",
          color: "white",
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          fontSize: 22,
        }}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 84,
            width: "min(380px, calc(100vw - 32px))",
            height: "min(540px, calc(100vh - 140px))",
            background: "white",
            borderRadius: 16,
            boxShadow: "0 18px 60px rgba(0,0,0,0.22)",
            border: "1px solid rgba(0,0,0,0.08)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              background: "#F9FAFB",
            }}
          >
            <div style={{ fontWeight: 700 }}>InterQ Coach</div>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 18,
                opacity: 0.7,
              }}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} style={{ flex: 1, padding: 12, overflowY: "auto" }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "82%",
                    padding: "10px 12px",
                    borderRadius: 14,
                    background: m.sender === "user" ? "#E8F0FE" : "#F3F4F6",
                    fontSize: 14,
                    lineHeight: 1.35,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.sender === "coach" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.text ||
                        (streaming && idx === messages.length - 1
                          ? `Typing${typingDots}`
                          : "")}
                    </ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              padding: 10,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                outline: "none",
              }}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={!canSend}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "none",
                cursor: canSend ? "pointer" : "not-allowed",
                background: canSend ? "#111827" : "#9CA3AF",
                color: "white",
                fontWeight: 600,
              }}
            >
              {streaming ? "..." : "Send"}
            </button>
          </div>

          <div style={{ padding: "0 10px 10px", fontSize: 11, opacity: 0.6 }}>
            Session: {sessionId || "new"}
          </div>
        </div>
      )}
    </>
  );
}