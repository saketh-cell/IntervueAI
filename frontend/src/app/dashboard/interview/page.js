"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import "@/src/styles/interview.css";
import QuestionTimer from "@/src/components/interview/QuestionTimer";

const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "HR / Behavioral",
];

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

export default function InterviewPage() {
  const router = useRouter();

  const [role, setRole] = useState("Frontend Developer");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [interview, setInterview] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const apiBase = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }, []);

  const startInterview = async () => {
    setError("");
    setLoading(true);
    setAnswer("");
    setIndex(0);

    try {
      const res = await fetch(`${apiBase}/interview/start`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role, experienceLevel }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to start interview");

      setInterview(data.interview);
      setAnswer(data.interview?.questions?.[0]?.userAnswer || "");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!interview?._id) return;
    if (!answer.trim()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${apiBase}/interview/${interview._id}/answer/${index}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit answer");

      setInterview(data.interview);

      const saved = data.interview?.questions?.[index]?.userAnswer;
      if (typeof saved === "string") setAnswer(saved);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (!interview) return;
    const next = index + 1;
    if (next >= interview.questions.length) return;
    setIndex(next);
    setAnswer(interview.questions[next]?.userAnswer || "");
    setError("");
  };

  const prevQuestion = () => {
    if (!interview) return;
    const prev = index - 1;
    if (prev < 0) return;
    setIndex(prev);
    setAnswer(interview.questions[prev]?.userAnswer || "");
    setError("");
  };

  const completeInterview = async () => {
    if (!interview?._id) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/interview/${interview._id}/complete`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to complete interview");
      }

      setInterview(data.interview);

      // redirect directly to result page
      router.push(`/dashboard/results?id=${data.interview._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setIndex(0);
    setInterview(null);
    setAnswer("");
    setError("");
    setLoading(false);
  };

  const currentQuestion = interview?.questions?.[index];

  const handleTimeUp = async () => {
    if (!interview || loading || interview.status === "completed") return;

    const saved = interview?.questions?.[index]?.userAnswer || "";
    const typed = answer || "";

    if (typed.trim() && typed.trim() !== saved.trim()) {
      try {
        setLoading(true);

        const res = await fetch(
          `${apiBase}/interview/${interview._id}/answer/${index}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ answer: typed }),
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to submit answer");
        }

        setInterview(data.interview);
      } catch (e) {
        setError(e.message);
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    }

    const isLast = index >= interview.questions.length - 1;

    if (!isLast) {
      nextQuestion();
    } else {
      await completeInterview();
    }
  };

  return (
    <div className="dashPage">
      <div className="dashTop">
        <div>
          <h1 className="dashTitle">Interview</h1>
          <p className="dashSub">
            Start a session, answer questions, and get AI feedback + score.
          </p>
        </div>
      </div>

      {!interview && (
        <div className="dashPanel">
          <div className="dashPanelHeader">
            <h2 className="dashPanelTitle">Setup</h2>
            <div className="dashPanelHint">Choose role and level</div>
          </div>

          <div className="interviewSetupGrid">
            <div className="interviewField">
              <label className="interviewLabel">Role</label>
              <select
                className="interviewSelect"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="interviewField">
              <label className="interviewLabel">Experience Level</label>
              <select
                className="interviewSelect"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                {LEVEL_OPTIONS.map((lv) => (
                  <option key={lv} value={lv}>
                    {lv}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="interviewActions">
            <button
              className="dashBtnPrimary"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? "Starting..." : "Start Interview"}
            </button>
          </div>

          {error && (
            <div className="dashError">
              <div className="dashErrorTitle">Error</div>
              <div className="dashErrorMsg">{error}</div>
            </div>
          )}
        </div>
      )}

      {interview && (
        <>
          <QuestionTimer
            seconds={1800}
            questionKey={index}
            paused={loading || interview.status === "completed"}
            onTimeUp={handleTimeUp}
          />

          <div className="dashTwoCol">
            <div className="dashPanel">
              <div className="dashPanelHeader">
                <h2 className="dashPanelTitle">
                  Question {index + 1} / {interview.questions.length}
                </h2>
                <div className="dashPanelHint">
                  Status: <b>{interview.status}</b>
                </div>
              </div>

              <div className="interviewQuestion">
                {currentQuestion?.question || "No question"}
              </div>

              <label className="interviewLabel" style={{ marginTop: 18 }}>
                Your Answer
              </label>

              <textarea
                className="interviewTextarea"
                placeholder="Write your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={loading || interview.status === "completed"}
              />

              <div className="dashBtnRow" style={{ marginTop: 16 }}>
                <button
                  className="dashBtnGhost"
                  onClick={prevQuestion}
                  disabled={loading || index === 0}
                >
                  Previous
                </button>

                <button
                  className="dashBtnPrimary"
                  onClick={submitAnswer}
                  disabled={
                    loading || !answer.trim() || interview.status === "completed"
                  }
                >
                  {loading ? "Saving..." : "Submit Answer"}
                </button>

                <button
                  className="dashBtnGhost"
                  onClick={nextQuestion}
                  disabled={loading || index >= interview.questions.length - 1}
                >
                  Next
                </button>
              </div>

              {currentQuestion?.aiFeedback ? (
                <div className="interviewFeedbackBox">
                  <div className="interviewFeedbackTitle">
                    AI Feedback • Score: {currentQuestion.score}/10
                  </div>
                  <div className="interviewFeedbackText">
                    {currentQuestion.aiFeedback}
                  </div>
                </div>
              ) : (
                <div className="dashEmpty" style={{ marginTop: 18 }}>
                  <div className="dashEmptyTitle">No feedback yet</div>
                  <div className="dashEmptySub">
                    Submit your answer to get AI feedback.
                  </div>
                </div>
              )}

              {error && (
                <div className="dashError">
                  <div className="dashErrorTitle">Error</div>
                  <div className="dashErrorMsg">{error}</div>
                </div>
              )}
            </div>

            <div className="dashPanel">
              <div className="dashPanelHeader">
                <h2 className="dashPanelTitle">Session</h2>
                <div className="dashPanelHint">Progress + Finish</div>
              </div>

              <div className="dashList">
                {interview.questions.map((q, i) => (
                  <div
                    key={i}
                    className="dashListItem"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setIndex(i);
                      setAnswer(interview.questions[i]?.userAnswer || "");
                      setError("");
                    }}
                  >
                    <div>
                      <div className="dashRole">Q{i + 1}</div>
                      <div className="dashMeta">
                        {q.userAnswer ? "Answered" : "Not answered"}
                      </div>
                    </div>

                    <div className="dashScorePill">{q.score || 0}/10</div>
                  </div>
                ))}
              </div>

              <div className="dashBtnRow" style={{ marginTop: 18 }}>
                <button
                  className="dashBtnPrimary"
                  onClick={completeInterview}
                  disabled={loading || interview.status === "completed"}
                >
                  {interview.status === "completed"
                    ? "Completed"
                    : "Complete Interview"}
                </button>

                <button
                  className="dashBtnGhost"
                  onClick={reset}
                  disabled={loading}
                >
                  New Session
                </button>
              </div>

              {interview.status === "completed" && (
                <div className="interviewFeedbackBox" style={{ marginTop: 18 }}>
                  <div className="interviewFeedbackTitle">
                    Final Score: {Number(interview.score || 0).toFixed(1)}/10
                  </div>
                  <div className="interviewFeedbackText">
                    Your interview is completed successfully.
                  </div>

                  <div className="dashBtnRow" style={{ marginTop: 14 }}>
                    <button
                      className="dashBtnPrimary"
                      onClick={() =>
                        router.push(`/dashboard/results?id=${interview._id}`)
                      }
                    >
                      View Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}