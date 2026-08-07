import DotGrid from "@/components/ui/DotGrid";

// Shared hero background: the same interactive dot grid as the home / about hero,
// with a white radial mask (keeps the headline readable) and a bottom fade that
// blends into the next section — so the dots read as a soft background texture,
// not a hard-edged box. Used by every inner-page hero for a uniform look.
export default function HeroDotBackground() {
  return (
    <>
      <div className="absolute inset-0 z-0">
        <DotGrid />
      </div>

      {/* White radial mask behind the headline */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 62% at 50% 50%, rgba(255,255,255,0.96) 28%, rgba(255,255,255,0.6) 56%, rgba(255,255,255,0) 84%)",
        }}
      />

      {/* Bottom fade into the next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 70%, white 100%)",
        }}
      />
    </>
  );
}
