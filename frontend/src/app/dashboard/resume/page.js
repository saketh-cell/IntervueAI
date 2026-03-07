"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "@/src/styles/resume.css";

import {
  uploadResume,
  getMyResumes,
  deleteResume,
} from "@/src/services/resume.service";

export default function ResumePage() {
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [showBreakdown, setShowBreakdown] = useState(false);

  const apiBase = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    return base.replace("/api", "");
  }, []);

  const loadResumes = async () => {
    try {
      setErrMsg("");
      const data = await getMyResumes();
      const list = data?.resumes || [];
      setResumes(list);
      
      setSelected((prev) => prev || (list.length ? list[0] : null));
    } catch (e) {
      setErrMsg(e?.response?.data?.message || "Failed to load resumes");
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const validate = (f) => {
    if (!f) return "Please select a PDF resume.";
    if (f.type !== "application/pdf") return "Only PDF files are allowed.";
    const maxMB = 5;
    if (f.size > maxMB * 1024 * 1024) return `File must be <= ${maxMB}MB.`;
    return null;
  };

  const handleUpload = async () => {
    const v = validate(file);
    if (v) {
      setOkMsg("");
      setErrMsg(v);
      return;
    }

    try {
      setLoading(true);
      setOkMsg("");
      setErrMsg("");
      await uploadResume(file);
      setOkMsg(" Resume uploaded and analyzed successfully 📂.");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setShowBreakdown(false);
      await loadResumes();
    } catch (e) {
      setErrMsg(e?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setOkMsg("");
      setErrMsg("");
      await deleteResume(id);
      setOkMsg("Resume deleted successfully 🗑️.");
      setShowBreakdown(false);
      await loadResumes();
      setSelected((prev) => (prev?._id === id ? null : prev));
    } catch (e) {
      setErrMsg(e?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const openFile = async (fileUrl) => {
    try {
      const res = await fetch(`${apiBase}${fileUrl}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to open file");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      setErrMsg(e.message);
    }
  };

  // Selected resume derived data
  const analysis = selected?.analysis || {};
  const overall = analysis?.overallScore ?? 0;
  const ats = analysis?.atsScore ?? 0;

  const bd = analysis?.atsBreakdown || {};
  const parseability = bd?.parseability ?? 0;
  const sections = bd?.sections ?? 0;
  const keywords = bd?.keywords ?? 0;
  const formatting = bd?.formatting ?? 0;
  const completeness = bd?.completeness ?? 0;

  const strengths = Array.isArray(analysis?.strengths)
    ? analysis.strengths
    : [];
  const weaknesses = Array.isArray(analysis?.weaknesses)
    ? analysis.weaknesses
    : [];
  const suggestions = Array.isArray(analysis?.suggestions)
    ? analysis.suggestions
    : [];

  return (
    <main className="dashMain">
      <div className="dashPage">
        {/* ===== Top Header ===== */}
        <div className="dashTop">
          <div>
            <h1 className="dashTitle">Resume</h1>
            <p className="dashSub">
              Upload your resume and get <b>Overall Score</b> +{" "}
              <b>ATS Compatibility</b>. Select any uploaded resume to view full
              feedback.
            </p>
          </div>

          <div className="dashBtnRow">
            <button
              className="dashBtnGhost"
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
            >
              Choose PDF
            </button>

            <button
              className="dashBtnPrimary"
              type="button"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Upload & Analyze"}
            </button>
          </div>
        </div>

        {/* ===== Upload Panel ===== */}
        <div className="dashPanel">
          <div className="dashPanelHeader">
            <h2 className="dashPanelTitle">Upload Resume</h2>
            <div className="dashPanelHint">PDF only • Max 5MB</div>
          </div>

          <div className="resumeUploadRow">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="resumeFileInput"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <div className="dashBtnRow">
              <button
                className="dashBtnGhost"
                type="button"
                onClick={() => {
                  setFile(null);
                  setOkMsg("");
                  setErrMsg("");
                  if (fileRef.current) fileRef.current.value = "";
                }}
                disabled={loading}
              >
                Clear
              </button>

              <button
                className="dashBtnPrimary"
                type="button"
                onClick={handleUpload}
                disabled={loading || !file}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div className="resumeHelper">
            Tip: Upload a text-based PDF (selectable text). Scanned PDFs may
            need OCR for best ATS scoring.
          </div>

          {okMsg && (
            <div className="dashEmpty">
              <div className="dashEmptyTitle">Success</div>
              <div className="dashEmptySub">{okMsg}</div>
            </div>
          )}

          {errMsg && (
            <div className="dashError">
              <div className="dashErrorTitle">Error</div>
              <div className="dashErrorMsg">{errMsg}</div>
            </div>
          )}
        </div>

        {/* ===== Resumes Panel ===== */}
        <div className="dashPanel" style={{ marginTop: 22 }}>
          <div className="dashPanelHeader">
            <h2 className="dashPanelTitle">My Resumes</h2>
            <div className="dashPanelHint">Click one to view full analysis</div>
          </div>

          {resumes.length === 0 ? (
            <div className="dashEmpty">
              <div className="dashEmptyTitle">No resumes uploaded yet</div>
              <div className="dashEmptySub">
                Upload your resume above to generate scores and suggestions.
              </div>
            </div>
          ) : (
            <div className="dashList">
              {resumes.map((r) => {
                const o = r?.analysis?.overallScore ?? 0;
                const a = r?.analysis?.atsScore ?? 0;
                const isActive = selected?._id === r._id;

                return (
                  <div
                    key={r._id}
                    className="dashListItem"
                    style={{
                      outline: isActive
                        ? "2px solid rgba(79,70,229,0.35)"
                        : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelected(r);
                      setShowBreakdown(false);
                    }}
                  >
                    <div>
                      <div className="dashRole">{r.originalName}</div>
                      <div className="dashMeta">
                        Uploaded:{" "}
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleString()
                          : "-"}
                        <div className="resumePills">
                          <span className="resumePillOverall">
                            Overall: {o}/100
                          </span>
                          <span className="resumePillATS">ATS: {a}/100</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="resumeRightBtns"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="dashBtnGhost"
                        type="button"
                        onClick={() => openFile(r.fileUrl)}
                      >
                        View / Download
                      </button>

                      <button
                        className="resumeBtnDanger"
                        type="button"
                        onClick={() => handleDelete(r._id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== Selected Resume Analysis ===== */}
        {selected && (
          <>
            {/* Scores Panel */}
            <div className="dashPanel" style={{ marginTop: 22 }}>
              <div className="dashPanelHeader">
                <h2 className="dashPanelTitle">Analysis</h2>
                <div className="dashPanelHint">{selected.originalName}</div>
              </div>

              <div className="resumePills">
                <span className="resumePillOverall">
                  Overall Score: {overall}/100
                </span>
                <span className="resumePillATS">ATS Score: {ats}/100</span>
              </div>

              {/* ATS Progress bar */}
              <div className="atsBarWrap">
                <div className="atsBarTop">
                  <div className="atsLabel">ATS Compatibility</div>
                  <div className="atsValue">{ats}/100</div>
                </div>
                <div className="atsTrack">
                  <div
                    className="atsFill"
                    style={{ width: `${Math.max(0, Math.min(100, ats))}%` }}
                  />
                </div>
              </div>

              {/* Collapsible breakdown */}
              <button
                type="button"
                className="collapseBtn"
                onClick={() => setShowBreakdown((s) => !s)}
              >
                {showBreakdown ? "Hide ATS Breakdown" : "Show ATS Breakdown"}
              </button>

              {showBreakdown && (
                <div className="breakdownGrid">
                  <div className="breakdownCard">
                    <div className="breakdownTitle">Parseability</div>
                    <div className="breakdownScore">{parseability}</div>
                    <div className="breakdownMini">Text extraction quality</div>
                  </div>

                  <div className="breakdownCard">
                    <div className="breakdownTitle">Sections</div>
                    <div className="breakdownScore">{sections}</div>
                    <div className="breakdownMini">
                      Summary/Skills/Exp/Edu/Projects
                    </div>
                  </div>

                  <div className="breakdownCard">
                    <div className="breakdownTitle">Keywords</div>
                    <div className="breakdownScore">{keywords}</div>
                    <div className="breakdownMini">
                      JD match (neutral if no JD)
                    </div>
                  </div>

                  <div className="breakdownCard">
                    <div className="breakdownTitle">Formatting</div>
                    <div className="breakdownScore">{formatting}</div>
                    <div className="breakdownMini">ATS-friendly formatting</div>
                  </div>

                  <div className="breakdownCard">
                    <div className="breakdownTitle">Completeness</div>
                    <div className="breakdownScore">{completeness}</div>
                    <div className="breakdownMini">
                      Email/Phone/LinkedIn/GitHub
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Gemini Feedback Two Column */}
            <div className="dashTwoCol">
              <div className="dashPanel">
                <div className="dashPanelHeader">
                  <h3 className="dashPanelTitle">Strengths</h3>
                  <div className="dashPanelHint">What you did well</div>
                </div>

                {strengths.length ? (
                  <ul className="analysisList">
                    {strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="analysisHint">No strengths found.</div>
                )}
              </div>

              <div className="dashPanel">
                <div className="dashPanelHeader">
                  <h3 className="dashPanelTitle">Weaknesses</h3>
                  <div className="dashPanelHint">What to improve</div>
                </div>

                {weaknesses.length ? (
                  <ul className="analysisList">
                    {weaknesses.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="analysisHint">No weaknesses found.</div>
                )}
              </div>
            </div>

            {/* Suggestions panel full width */}
            <div className="dashPanel" style={{ marginTop: 22 }}>
              <div className="dashPanelHeader">
                <h3 className="dashPanelTitle">Suggestions</h3>
                <div className="dashPanelHint">Actionable improvements</div>
              </div>

              {suggestions.length ? (
                <ul className="analysisList">
                  {suggestions.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <div className="analysisHint">No suggestions found.</div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
