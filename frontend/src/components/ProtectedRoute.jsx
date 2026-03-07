"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState("loading"); // loading | ok | fail

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          { credentials: "include" } // ✅ send HttpOnly cookie
        );

        if (cancelled) return;

        if (!res.ok) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          setStatus("fail");
          return;
        }

        setStatus("ok");
      } catch (e) {
        if (!cancelled) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          setStatus("fail");
        }
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [router, pathname]);

  if (status === "loading") return null;
  return children;
}