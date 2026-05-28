"use client";

export function HeroDemoVideo() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay so text is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80 z-10" />

      {/* Demo video — replace src with actual hosted demo video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
        src="/demo-reel.mp4"
      >
        {/* Fallback gradient if no video */}
      </video>

      {/* Simulated hotspot overlays for the demo */}
      <div className="absolute z-20 pointer-events-none" style={{ top: "40%", left: "35%" }}>
        <div className="animate-bounce">
          <div className="px-3 py-1.5 bg-white/90 text-black text-xs font-semibold rounded-full shadow-lg">
            🛒 Le Creuset Dutch Oven — $149
          </div>
        </div>
      </div>

      <div
        className="absolute z-20 pointer-events-none"
        style={{ top: "55%", left: "60%", animationDelay: "1s" }}
      >
        <div className="animate-bounce" style={{ animationDelay: "0.5s" }}>
          <div className="px-3 py-1.5 bg-white/90 text-black text-xs font-semibold rounded-full shadow-lg">
            📅 Book this hotel — From $120/night
          </div>
        </div>
      </div>
    </div>
  );
}
