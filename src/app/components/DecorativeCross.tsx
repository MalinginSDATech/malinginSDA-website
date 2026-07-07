// Plain SVG cross for decorative watermarks — the Unicode "✝" glyph renders as a
// full-color emoji on many mobile devices, ignoring the low-opacity text color.
export function DecorativeCross({ size, opacity, className }: { size: number | string; opacity: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} style={{ opacity }} aria-hidden>
      <rect x="41" y="4" width="18" height="92" fill="currentColor" />
      <rect x="12" y="30" width="76" height="18" fill="currentColor" />
    </svg>
  );
}
