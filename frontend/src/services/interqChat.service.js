import API_URL from "./api";

// Get chatbot history
export const loadHistory = async (sessionId) => {
  const { data } = await API_URL.get("/interq/history", { params: { sessionId } });
  return data;
};


export const streamChat = async ({ sessionId, message, onMeta, onDelta, onDone, onError }) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const res = await fetch(`${baseURL}/interq/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ sessionId, message }),
  });

  
  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    let details = "";

    if (ct.includes("application/json")) {
      const j = await res.json().catch(() => null);
      details = j?.message || JSON.stringify(j);
    } else {
      details = await res.text().catch(() => "");
    }

    throw new Error(`HTTP ${res.status} ${details || "Streaming failed"}`);
  }

  if (!res.body) throw new Error("No response body (stream not supported)");

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const emitSSE = (rawEvent) => {
    const lines = rawEvent.split("\n");
    let eventName = "message";
    let dataLine = "";

    for (const line of lines) {
      if (line.startsWith("event:")) eventName = line.slice(6).trim();
      if (line.startsWith("data:")) dataLine += line.slice(5).trim(); 
    }

    if (!dataLine) return;

    let payload = null;
    try {
      payload = JSON.parse(dataLine);
    } catch {
     
      payload = { text: dataLine };
    }

    if (eventName === "meta") onMeta?.(payload);
    if (eventName === "delta") onDelta?.(payload);
    if (eventName === "done") onDone?.(payload);
    if (eventName === "error") onError?.(payload);
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 2);
      if (rawEvent) emitSSE(rawEvent);
    }
  }
};