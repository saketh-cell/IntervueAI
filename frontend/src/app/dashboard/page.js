"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDashboardData } from "@/src/services/dashboard.service";
import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}

function DashboardInner() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        setStatus({ loading: true, error: "" });

        const res = await getDashboardData();
        const payload = res?.data ?? res;

        if (!mounted) return;
        setData(payload);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        const mesg =
          error?.response?.data?.message || "Failed to fetch dashboard data";

        if (!mounted) return;
        setStatus({ loading: false, error: mesg });

        if (error?.response?.status === 401) {
          router.replace("/login");
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [router]);

  const stats = useMemo(() => data?.stats ?? {}, [data]);

  const recent = useMemo(
    () => (Array.isArray(data?.recent) ? data.recent : []),
    [data]
  );

  const latestInterviewId = recent?.[0]?._id || null;

  if (status.loading) {
    return (
      <div className="dashPage">
        <div className="dashTop">
          <div>
            <div className="dashTitleSkeleton" />
            <div className="dashSubSkeleton" />
          </div>
          <div className="dashBtnRow">
            <div className="dashBtnSkeleton" />
            <div className="dashBtnSkeleton" />
          </div>
        </div>

        <div className="dashGrid">
          <div className="dashCard skeleton" />
          <div className="dashCard skeleton" />
          <div className="dashCard skeleton" />
          <div className="dashCard skeleton" />
        </div>

        <div
          className="dashPanel skeleton"
          style={{ height: 260, marginTop: 14 }}
        />
      </div>
    );
  }

  return (
    <div className="dashPage">
      <div className="dashTop">
        <div>
          <h1 className="dashTitle">Welcome Back, {data?.name || "User"}!</h1>
          <p className="dashSub">
            Track progress, run mock interviews, and improve your resume — all
            in one platform.
          </p>
        </div>

        <div className="dashBtnRow">
          <Link className="dashBtnPrimary" href="/dashboard/interview">
            Start Mock Interview
          </Link>
          <Link className="dashBtnGhost" href="/dashboard/resume">
            Analyze Resume
          </Link>
        </div>
      </div>

      {status.error ? (
        <div className="dashError">
          <div className="dashErrorTitle">Couldn&apos;t load dashboard</div>
          <div className="dashErrorMsg">{status.error}</div>
        </div>
      ) : null}

      <div className="dashGrid">
        <StatCard
          title="Total Resumes"
          value={num(stats.totalResumes)}
          sub="Uploaded resumes"
        />
        <StatCard
          title="Total Interviews"
          value={num(stats.totalInterviews)}
          sub="Mock interviews taken"
        />
        <StatCard
          title="Average Score"
          value={num(stats.avgScore, 2)}
          sub="Across all interviews"
        />
        <StatCard
          title="Last Interview"
          value={stats.lastInterviewDate ? fmtDate(stats.lastInterviewDate) : "-"}
          sub="Most recent attempt"
        />
      </div>

      <div className="dashTwoCol">
        <section className="dashPanel">
          <div className="dashPanelHeader">
            <h2 className="dashPanelTitle">Quick Actions</h2>
            <span className="dashPanelHint">Do one thing now</span>
          </div>

          <div className="dashActions">
            <ActionCard
              title="Upload Resume"
              desc="Get AI feedback on strengths, weaknesses & improvement areas"
              href="/dashboard/resume"
              tag="Resume"
            />
            <ActionCard
              title="Start Mock Interview"
              desc="Practice with an AI interviewer and get instant feedback"
              href="/dashboard/interview"
              tag="Interview"
            />

            {latestInterviewId ? (
              <ActionCard
                title="View Latest Result"
                desc="Open your most recent interview result"
                href={`/dashboard/results?id=${latestInterviewId}`}
                tag="Results"
              />
            ) : (
              <div className="dashActionCard" style={{ opacity: 0.7 }}>
                <div className="dashActionTop">
                  <div className="dashTag">Results</div>
                  <div className="dashArrow">→</div>
                </div>
                <div className="dashActionTitle">View Results</div>
                <div className="dashActionDesc">
                  Complete an interview to view results here
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="dashPanel">
          <div className="dashPanelHeader">
            <h2 className="dashPanelTitle">Recent Interviews</h2>
            <span className="dashPanelHint">Your last 5 interviews</span>
          </div>

          {recent.length === 0 ? (
            <div className="dashEmpty">
              <div className="dashEmptyTitle">No interviews taken yet</div>
              <div className="dashEmptySub">
                Start a mock interview to see your recent activity here.
              </div>
              <Link className="dashBtnPrimary" href="/dashboard/interview">
                Start Mock Interview
              </Link>
            </div>
          ) : (
            <div className="dashList">
              {recent.slice(0, 5).map((it, idx) => (
                <div
                  key={it?._id ?? idx}
                  className="dashListItem"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/dashboard/results?id=${it._id}`)}
                >
                  <div className="dashListLeft">
                    <div className="dashRole">{it?.role || "Interview"}</div>
                    <div className="dashMeta">
                      {it?.createdAt ? fmtDate(it.createdAt) : "-"}
                    </div>
                  </div>

                  <div className="dashBtnRow" style={{ alignItems: "center" }}>
                    <div className="dashScorePill">
                      {typeof it?.score === "number"
                        ? `${Number(it.score).toFixed(1)}/10`
                        : "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className="dashCard">
      <div className="dashCardTitle">{title}</div>
      <div className="dashCardValue">{value}</div>
      <div className="dashCardSub">{sub}</div>
    </div>
  );
}

function ActionCard({ title, desc, href, tag }) {
  return (
    <Link href={href} className="dashActionCard">
      <div className="dashActionTop">
        <div className="dashTag">{tag}</div>
        <div className="dashArrow">→</div>
      </div>
      <div className="dashActionTitle">{title}</div>
      <div className="dashActionDesc">{desc}</div>
    </Link>
  );
}

function num(v, decimals = 0) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return decimals > 0 ? Number(v.toFixed(decimals)) : v;
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "-";
  }
}