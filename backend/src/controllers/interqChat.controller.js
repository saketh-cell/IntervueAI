const CoachSession = require("../models/coachSession.model");
const CoachMessage = require("../models/coachMessage.model");
const { startGeminiStream } = require("../services/interqGemini.service");

async function getOrCreateSession({ userId, sessionId }) {
  let session = null;

  if (sessionId) {
    session = await CoachSession.findOne({ userId, _id: sessionId });
  }

  if (!session) {
    session = await CoachSession.create({ userId, title: "InterQ Coach Chat" });
  }

  return session;
}

exports.getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { sessionId } = req.query;

    // First time opening chat
    if (!sessionId) {
      return res.status(200).json({
        success: true,
        sessionId: null,
        messages: [],
      });
    }

    const session = await CoachSession.findOne({ _id: sessionId, userId });

    // Invalid session id / not belongs to user
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Chat session not found",
      });
    }

    const msgs = await CoachMessage.find({ sessionId: session._id, userId })
      .sort({ createdAt: 1 })
      .limit(200);

    return res.status(200).json({
      success: true,
      sessionId: String(session._id),
      messages: msgs.map((m) => ({
        sender: m.sender,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.streamChat = async (req, res, next) => {
  let closed = false;
  try {
    const userId = req.user._id;
    const { sessionId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const session = await getOrCreateSession({ userId, sessionId });

    await CoachMessage.create({
      sessionId: session._id,
      userId,
      sender: "user",
      text: message.trim(),
    });

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transfrom");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Acel-Buffering", "no");
    res.flushHeaders?.();

    req.on("close", () => {
      closed = true;
    });

    res.write(
      `event: meta\ndata: ${JSON.stringify({ sessionId: String(session._id) })}\n\n`,
    );

    const { stream } = await startGeminiStream({
      sessionId: session._id,
      userId,
      userMessage: message,
    });

    let fullText = "";

    for await (const chunk of stream) {
      if (closed) break;

      const delta = chunk?.text || "";
      if (!delta) continue;

      fullText += delta;

      res.write(`event: delta\ndata:${JSON.stringify({ delta })}\n\n`);
    }

    if (closed) return;

    const finalText = fullText.trim();

    await CoachMessage.create({
      sessionId: session._id,
      userId,
      sender: "coach",
      userMessage: finalText,
    });

    res.write(`event: done\ndata:${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    try {
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: error.message || "Internal Server Error",
        });
      }
      if (!closed) {
        res.write(
          `event: error\ndata:${JSON.stringify({
            message: err.message || "ERROR",
          })}\n\n`,
        );
        res.end();
      }
    } catch (error) {}
    next(error);
  }
};
