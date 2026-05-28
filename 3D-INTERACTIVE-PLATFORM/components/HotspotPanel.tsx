"use client";

import type { Hotspot } from "@/lib/supabase";

type Props = {
  hotspot: Hotspot;
  onClose: () => void;
};

export function HotspotPanel({ hotspot, onClose }: Props) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-72 animate-in slide-in-from-right duration-300">
      <div className="bg-black/80 backdrop-blur-md border border-white/15 rounded-2xl overflow-hidden">
        {hotspot.product_image_url && (
          <img
            src={hotspot.product_image_url}
            alt={hotspot.object_name}
            className="w-full h-40 object-cover"
          />
        )}

        <div className="p-4">
          <h3 className="text-white font-semibold text-base mb-1">
            {hotspot.object_name}
          </h3>

          {hotspot.product_price && (
            <p className="text-blue-400 font-bold text-lg mb-3">
              ${hotspot.product_price.toFixed(2)}
            </p>
          )}

          {hotspot.product_url ? (
            <a
              href={hotspot.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition text-sm"
            >
              View / Buy →
            </a>
          ) : (
            <p className="text-white/40 text-sm text-center py-2">
              No purchase link yet
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-3 w-full text-center text-white/40 text-xs hover:text-white/70 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
