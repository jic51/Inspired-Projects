"use client";

import { useState } from "react";

type Comment = {
  id: string;
  user: string;
  text: string;
  timestamp: string;
};

type Props = {
  comments?: Comment[];
};

const DEMO_COMMENTS: Comment[] = [
  { id: "1", user: "maria_rv", text: "Where is that hotel??", timestamp: "2m" },
  { id: "2", user: "traveler_josh", text: "The kitchen setup is amazing 🔥", timestamp: "5m" },
  { id: "3", user: "chef_andrea", text: "That pan is a Le Creuset, clicked the hotspot!", timestamp: "8m" },
];

export function CommentsPanel({ comments = DEMO_COMMENTS }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute right-4 top-20 bottom-24 z-10 w-64 pointer-events-auto">
      <div className="h-full bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
          <span className="text-white/70 text-xs font-medium">Comments</span>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white/40 hover:text-white/80 text-xs transition"
          >
            {collapsed ? "Show" : "Hide"}
          </button>
        </div>

        {!collapsed && (
          <>
            <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
              {comments.map((c) => (
                <div key={c.id}>
                  <span className="text-blue-400 text-xs font-medium">@{c.user}</span>
                  <span className="text-white/60 text-xs ml-1">{c.timestamp}</span>
                  <p className="text-white/85 text-xs mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="p-2 border-t border-white/10">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full bg-white/10 text-white text-xs placeholder-white/30 rounded-xl px-3 py-2 outline-none focus:bg-white/15 transition"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
