import { useEffect, useMemo } from "react";
import { motion } from "motion/react";

const NOTE_SYMBOLS = ["♪", "♫", "♬", "♩", "𝄞", "♭", "♯"];
const PARTICLE_COUNT = 46;
const TOTAL_DURATION = 1.9;
const EXPLODE_AT = 0.72; // fraction of TOTAL_DURATION where notes converge and burst — page opens here

interface Particle {
  key: number;
  symbol: string;
  startX: number;
  startY: number;
  wobbleX: number;
  wobbleY: number;
  explodeX: number;
  explodeY: number;
  startAngle: number;
  duration: number;
  delay: number;
  fontSize: number;
}

function buildParticles(): Particle[] {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
    // scattered across the entire viewport, not just a ring near the center
    const startX = (Math.random() - 0.5) * vw * 1.05;
    const startY = (Math.random() - 0.5) * vh * 1.05;
    const explodeAngle = Math.random() * 360;
    const explodeRad = (explodeAngle * Math.PI) / 180;
    const explodeDistance = 520 + Math.random() * 340;
    return {
      key: i,
      symbol: NOTE_SYMBOLS[i % NOTE_SYMBOLS.length],
      startX,
      startY,
      wobbleX: startX + (Math.random() - 0.5) * 120,
      wobbleY: startY + (Math.random() - 0.5) * 120,
      explodeX: Math.cos(explodeRad) * explodeDistance,
      explodeY: Math.sin(explodeRad) * explodeDistance,
      startAngle: Math.random() * 40 - 20,
      duration: TOTAL_DURATION - 0.25 + Math.random() * 0.5,
      delay: Math.random() * 0.3,
      fontSize: 18 + Math.random() * 22,
    };
  });
}

function NoteParticle({ p }: { p: Particle }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 pointer-events-none select-none"
      style={{
        fontSize: p.fontSize,
        marginLeft: -p.fontSize / 2,
        marginTop: -p.fontSize / 2,
        color: "#1E5FB8",
        textShadow: "0 0 14px rgba(255,255,255,0.85), 0 2px 8px rgba(10,25,60,0.45)",
      }}
      initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0.4, rotate: p.startAngle }}
      animate={{
        x: [p.startX, p.wobbleX, p.startX * 0.35, 0, 0, p.explodeX],
        y: [p.startY, p.wobbleY, p.startY * 0.35, 0, 0, p.explodeY],
        opacity: [0, 1, 1, 1, 1, 0],
        scale: [0.4, 1, 1, 1, 1.15, 0.3],
        rotate: [p.startAngle, p.startAngle + 30, p.startAngle + 160, p.startAngle + 380, p.startAngle + 420, p.startAngle + 520],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        times: [0, 0.16, 0.46, EXPLODE_AT - 0.1, EXPLODE_AT, 1],
        ease: ["easeOut", "easeInOut", "easeInOut", "easeOut", "easeIn"],
      }}
    >
      {p.symbol}
    </motion.div>
  );
}

/**
 * Musical notes flutter in across the whole page, converge, and burst — the burst
 * moment (onExplode) is when the caller should actually swap in the new page, so
 * it's revealed right as the notes explode rather than before.
 */
export function ChoraleTransitionOverlay({ onExplode, onDone }: { onExplode: () => void; onDone: () => void }) {
  const particles = useMemo(buildParticles, []);

  useEffect(() => {
    const t1 = setTimeout(onExplode, TOTAL_DURATION * 1000 * EXPLODE_AT);
    const t2 = setTimeout(onDone, TOTAL_DURATION * 1000 + 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onExplode, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{ background: "radial-gradient(circle, rgba(214,229,245,0.95) 0%, rgba(147,197,253,0.55) 45%, transparent 75%)" }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: [0, 0, 140, 620], height: [0, 0, 140, 620], opacity: [0, 0, 0.85, 0] }}
        transition={{ duration: TOTAL_DURATION, times: [0, EXPLODE_AT - 0.1, EXPLODE_AT, 1], ease: ["easeInOut", "easeOut", "easeIn"] }}
      />
      {particles.map((p) => (
        <NoteParticle key={p.key} p={p} />
      ))}
    </motion.div>
  );
}
