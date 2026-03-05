"use client";

import { useState } from "react";
import { Zap } from "lucide-react";
import { PostJobModal } from "./PostJobModal";

/** Thin client wrapper — just a button + modal state. Home page stays a Server Component. */
export function PostJobButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        <Zap className="h-4 w-4" />
        Post a Job
      </button>
      {open && <PostJobModal onClose={() => setOpen(false)} />}
    </>
  );
}
