"use client";

import { useState } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { generateTopInterviewQuestions } from "@/src/services/topInterviewQuestions.service";
import "@/src/styles/top-interview-questions.css";

const roles = [
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Frontend Developer",
  "Backend Developer",
  "Java Developer",
  "Full Stack Developer",
];

const experiences = ["Fresher", "1 Year", "2 Years", "3+ Years"];

export default function TopInterviewQuestionsPage() {
  return (
    <ProtectedRoute>
      <TopInterviewQuestionsInner />
    </ProtectedRoute>
  );
}

function TopInterviewQuestionsInner() {
  const [role, setRole] = useState("MERN Stack Developer");
  const [experience, setExperience] = useState("Fresher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const res = await generateTopInterviewQuestions({ role, experience });

      if (!res?.success) {
        throw new Error(res?.message || "Failed to generate questions");
      }

      setResult(res.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate top interview questions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tiqPage">
      <div className="tiqHero">
        <span className="tiqBadge">AI Powered Interview Preparation</span>
        <h1 className="tiqTitle">Top Interview Questions</h1>
        <p className="tiqSub">
          Generate the most frequently asked interview questions based on your
          role and experience level.
        </p>
      </div>

      <div className="tiqFilterCard">
        <div className="tiqFilterGrid">
          <div className="tiqField">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="tiqField">
            <label htmlFor="experience">Experience</label>
            <select
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              {experiences.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            className="tiqGenerateBtn"
            onClick={handleGenerate}
            disabled={loading}
            type="button"
          >
            {loading ? "Generating..." : "Generate 15 Questions"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="tiqError">
          <div className="tiqErrorTitle">Couldn&apos;t generate questions</div>
          <div className="tiqErrorMsg">{error}</div>
        </div>
      ) : null}

      {loading ? (
        <div className="tiqLoadingCard">
          <div className="tiqSpinner" />
          <p className="tiqLoadingText">
            Generating top interview questions...
          </p>
        </div>
      ) : null}

      {!loading && result ? (
        <>
          <div className="tiqResultHead">
            <div>
              <h2 className="tiqResultTitle">
                {result?.title || "Top Interview Questions"}
              </h2>

              <div className="tiqResultMeta">
                <span className="tiqMetaPill">
                  Role: {result?.role || role}
                </span>
                <span className="tiqMetaPill">
                  Experience: {result?.experience || experience}
                </span>
                <span className="tiqMetaPill">
                  Total: {Array.isArray(result?.questions) ? result.questions.length : 0}
                </span>
              </div>
            </div>
          </div>

          {Array.isArray(result?.questions) && result.questions.length > 0 ? (
            <div className="tiqList">
              {result.questions.map((item, index) => (
                <QuestionCard key={`${item?.question}-${index}`} item={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="tiqEmpty">
              No questions available right now. Try again once.
            </div>
          )}
        </>
      ) : null}

      {!loading && !result && !error ? (
        <div className="tiqEmpty">
          Select your role and experience, then generate your top interview
          questions.
        </div>
      ) : null}
    </div>
  );
}

function QuestionCard({ item, index }) {
  const [open, setOpen] = useState(index === 0);

  const difficultyClass =
    item?.difficulty === "Easy"
      ? "tiqBadgeEasy"
      : item?.difficulty === "Medium"
      ? "tiqBadgeMedium"
      : "tiqBadgeHard";

  return (
    <div className="tiqCard">
      <button
        className="tiqCardBtn"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="tiqCardLeft">
          <span className="tiqQNo">Q{index + 1}</span>

          <div className="tiqQuestionWrap">
            <h3 className="tiqQuestion">{item?.question}</h3>

            <div className="tiqBadges">
              <span className="tiqBadgeNeutral">
                {item?.category || "General"}
              </span>
              <span className={difficultyClass}>
                {item?.difficulty || "Medium"}
              </span>
            </div>
          </div>
        </div>

        <span className={`tiqChevron ${open ? "open" : ""}`}>⌄</span>
      </button>

      {open ? (
        <div className="tiqAnswer">
          <p>{item?.answer}</p>
        </div>
      ) : null}
    </div>
  );
}