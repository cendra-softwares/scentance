"use client";

import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";

export default function PerfumesPage() {
  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div className="p-4 rounded-xl bg-accent/20 w-full max-w-md">
        <DatabaseWithRestApi />
      </div>
    </div>
  );
}