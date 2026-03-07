"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AILoader from "@/src/components/AILoader";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return <AILoader />;
}