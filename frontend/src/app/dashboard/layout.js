"use client";

import { useRouter } from "next/navigation";
import "@/src/styles/global.css";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="dashShell">
      <aside className="dashSidebar">
        {/* Top Content Wrapper */}
        <div className="dashSidebarTop">
          <div className="dashBrand">
            <div className="dashLogo"><img src="/logo.png" alt="IntervueAI logo"/></div>
            <div>
              <div className="dashBrandTitle">IntervueAI</div>
              <div className="dashBrandSub">
                Practice • Improve • Win
              </div>
            </div>
          </div>

          <nav className="dashNav">
            <a className="dashNavItem" href="/dashboard">Dashboard</a>
            <a className="dashNavItem" href="/dashboard/interview">Interview</a>
            <a className="dashNavItem" href="/dashboard/topInterviewQuestions">Top Questions</a>
            <a className="dashNavItem" href="/dashboard/resume">Resume</a>
            <a className="dashNavItem" href="/dashboard/results">Results</a>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="dashSidebarBottom">
          <div className="dashTip">
            Tip: Do mock Interview Daily 📝
          </div>

          <button className="dashLogoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashMain">{children}</main>
    </div>
  );
}