"use client";

import { useEffect, useState } from "react";
import AILoader from "./AILoader";

export default function ShowLoaderThen({ children, ms = 5000 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), ms);
    return () => clearTimeout(t);
  }, [ms]);

  if (show) return <AILoader />;
  return children;
}