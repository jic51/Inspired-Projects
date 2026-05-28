"use client";

import { useState } from "react";

type Props = {
  creatorName: string;
  title: string;
  likeCount?: number;
  children?: React.ReactNode;
};

export function UIOverlay({ creatorName, title, likeCount = 0, children }: Props) {
  const [hidden, setHidden] = useState(false);

  if (hidden) {
    return (
      <button
        onClick={() => setHidden(false)}
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white/60 rounded-lg hover:text-white transition backdrop-blur"
        title="Show UI"
      >
        👁
      </button>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none select-none">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-start justify-between">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm leading-tight">@{creatorName}</p>
            <p className="text-white/60 text-xs leading-tight">{title}</p>
          </div>
          <button className="ml-2 px-3 py-1 text-xs font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition">
            Follow
          </button>
        </div>

        <button
          onClick={() => setHidden(true)}
          className="p-2 bg-black/40 text-white/60 rounded-lg hover:text-white transition backdrop-blur pointer-events-auto"
          title="Hide UI"
        >
          👁
        </button>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-center pointer-events-auto">
        <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition">
          <span className="text-2xl">♥</span>
          <span className="text-xs">{likeCount}</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition">
          <span className="text-2xl">💬</span>
          <span className="text-xs">Reply</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white hover:scale-110 transition">
          <span className="text-2xl">↗</span>
          <span className="text-xs">Share</span>
        </button>
      </div>

      {children}
    </div>
  );
}
