"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    startTransition(() => {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="w-full px-6 py-4 text-lg bg-white/10 text-white placeholder-white/40 rounded-2xl border border-white/20 outline-none focus:bg-white/15 focus:border-white/40 transition backdrop-blur-md"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl text-sm transition disabled:opacity-50"
        >
          {isPending ? "..." : "Search"}
        </button>
      </div>
    </form>
  );
}
