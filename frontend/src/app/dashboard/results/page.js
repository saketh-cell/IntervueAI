"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { getInterview } from "@/src/services/interview.service";
import "@/src/styles/results.css";

export default function ResultsPage() {
  return (
    <ProtectedRoute>
      <ResultsInner />
    </ProtectedRoute>
  );
}

function ResultsInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(!!interviewId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!interviewId) {
      setLoading(false);
      setError("No interview was selected.");
      return;
    }

    const fetchInterviewResult = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInterview(interviewId);
        setInterview(data.interview);
      } catch (err) {
        setError(
          err?.response?.data?.message || "Failed to load interview result"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewResult();
  }, [interviewId]);

  const summary = useMemo(() => {
    if (!interview?.questions?.length) {
      return {
        total: 0,
        answered: 0,
        notAnswered: 0,
        strongAnswers: 0,
      };
    }

    const total = interview.questions.length;
    const answered = interview.questions.filter(
      (q) => q.userAnswer && q.userAnswer.trim()
    ).length;
    const notAnswered = total - answered;
    const strongAnswers = interview.questions.filter((q) => (q.score || 0) >= 7)
      .length;

    return { total, answered, notAnswered, strongAnswers };
  }, [interview]);

  const improvementItems = useMemo(() => {
    if (!interview?.questions?.length) return [];

    return interview.questions
      .map((q, i) => ({
        index: i,
        question: q.question,
        score: q.score || 0,
      }))
      .filter((q) => q.score < 7);
  }, [interview]);

  const getScoreLabel = (score) => {
    if (score >= 8) return "Excellent";
    if (score >= 7) return "Good";
    if (score >= 5) return "Average";
    return "Needs Improvement";
  };

  const getScoreClass = (score) => {
    if (score >= 8) return "scoreGood";
    if (score >= 5) return "scoreAverage";
    return "scoreBad";
  };

  if (loading) {
    return (
      <div className="resultsPage">
        <div className="resultsStateCard">Loading results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resultsPage">
        <div className="resultsStateCard errorState">
          <p>{error}</p>
          <div style={{ marginTop: "14px" }}>
            <button
              className="resultsBtn primaryBtn"
              onClick={() => router.push("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="resultsPage">
        <div className="resultsStateCard">No interview result found.</div>
      </div>
    );
  }

  return (
    <div className="resultsPage">
      <div className="resultsHeader">
        <div>
          <h1 className="resultsTitle">Mock Interview Results</h1>
          <p className="resultsSubtitle">
            Review your questions, answers, AI feedback, and improvement areas.
          </p>
        </div>

        <div className="resultsActions">
          <button
            className="resultsBtn secondaryBtn"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            className="resultsBtn primaryBtn"
            onClick={() => router.push("/dashboard/interview")}
          >
            Retake Interview
          </button>
        </div>
      </div>

      <div className="resultsTopGrid">
        <div className="resultCard">
          <p className="cardLabel">Role</p>
          <h3>{interview.role}</h3>
        </div>

        <div className="resultCard">
          <p className="cardLabel">Experience Level</p>
          <h3>{interview.experienceLevel || "Not set"}</h3>
        </div>

        <div className="resultCard">
          <p className="cardLabel">Status</p>
          <h3 className="statusText">{interview.status}</h3>
        </div>

        <div className="resultCard scoreCard">
          <p className="cardLabel">Overall Score</p>
          <h3>{Number(interview.score || 0).toFixed(1)}/10</h3>
          <span className={`scoreBadge ${getScoreClass(interview.score || 0)}`}>
            {getScoreLabel(interview.score || 0)}
          </span>
        </div>
      </div>

      <div className="resultsInfoGrid">
        <div className="infoPanel">
          <h2>Interview Summary</h2>
          <div className="miniStats">
            <div className="miniStat">
              <span>Total Questions</span>
              <strong>{summary.total}</strong>
            </div>
            <div className="miniStat">
              <span>Answered</span>
              <strong>{summary.answered}</strong>
            </div>
            <div className="miniStat">
              <span>Not Answered</span>
              <strong>{summary.notAnswered}</strong>
            </div>
            <div className="miniStat">
              <span>Strong Answers</span>
              <strong>{summary.strongAnswers}</strong>
            </div>
          </div>
        </div>

        <div className="infoPanel">
          <h2>Where You Need to Improve</h2>
          {improvementItems.length > 0 ? (
            <ul className="improveList">
              {improvementItems.slice(0, 5).map((item) => (
                <li key={item.index}>
                  <span className="improveQuestion">{item.question}</span>
                  <span className="improveMeta">Score: {item.score}/10</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="emptyText">
              Good performance. No major weak areas found.
            </p>
          )}
        </div>
      </div>

      <div className="questionSection">
        <div className="sectionHeading">
          <h2>Question by Question Review</h2>
          <p>See each question, your answer, and Gemini feedback.</p>
        </div>

        <div className="questionList">
          {interview.questions?.map((item, index) => (
            <div className="questionCard" key={index}>
              <div className="questionTop">
                <div>
                  <p className="questionCount">Question {index + 1}</p>
                  <h3 className="questionTitle">{item.question}</h3>
                </div>

                <div className={`questionScore ${getScoreClass(item.score || 0)}`}>
                  {item.score || 0}/10
                </div>
              </div>

              <div className="answerBlock">
                <h4>Your Answer</h4>
                <p>
                  {item.userAnswer && item.userAnswer.trim()
                    ? item.userAnswer
                    : "No answer submitted."}
                </p>
              </div>

              <div className="answerBlock feedbackBlock">
                <h4>Gemini Feedback</h4>
                <p>{item.aiFeedback || "No feedback available."}</p>
              </div>

              <div className="improvementHint">
                <span>Improvement Hint:</span>{" "}
                {(item.score || 0) >= 7
                  ? "Good answer. Add more confidence, examples, and structure to make it stronger."
                  : "This answer needs more clarity, technical depth, and better explanation."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}