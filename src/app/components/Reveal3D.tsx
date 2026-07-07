import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface Reveal3DProps {
  children: React.ReactNode;
  /** stagger index (in ms-like units, e.g. 0, 100, 200) — later items settle a beat after earlier ones */
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "pop" | "flip";
}

const BASE: Record<NonNullable<Reveal3DProps["direction"]>, { rotateX: number; rotateY: number; rotateZ: number; x: number; y: number; scaleFrom: number }> = {
  up: { rotateX: -50, rotateY: 0, rotateZ: 0, x: 0, y: 130, scaleFrom: 0.82 },
  left: { rotateX: 0, rotateY: 52, rotateZ: -4, x: -160, y: 40, scaleFrom: 0.85 },
  right: { rotateX: 0, rotateY: -52, rotateZ: 4, x: 160, y: 40, scaleFrom: 0.85 },
  pop: { rotateX: 0, rotateY: 0, rotateZ: 0, x: 0, y: 40, scaleFrom: 0.55 },
  flip: { rotateX: 78, rotateY: 0, rotateZ: 0, x: 0, y: 0, scaleFrom: 0.9 },
};

/**
 * Scroll-scrubbed 3D reveal: rotation/position/scale/blur are a direct function of
 * scroll progress (not a one-shot timed transition), so the motion is gradual and
 * reversible — exactly as far "in" as the user has scrolled. Settles quickly once a
 * section enters view rather than dragging out over a long scroll distance.
 */
export function Reveal3D({ children, delay = 0, className = "", direction = "up" }: Reveal3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shift = Math.min(delay / 2200, 0.08);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`start ${0.85 + shift}`, `start ${0.66 + shift}`],
  });

  const base = BASE[direction];
  const rotateX = useTransform(scrollYProgress, [0, 1], [base.rotateX, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [base.rotateY, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [base.rotateZ, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [base.x, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [base.y, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [base.scaleFrom, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [0, 1]);
  const blurPx = useTransform(scrollYProgress, [0, 1], [4, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <div ref={ref} style={{ perspective: 1600 }} className={className}>
      <motion.div style={{ rotateX, rotateY, rotateZ, x, y, scale, opacity, filter }}>
        {children}
      </motion.div>
    </div>
  );
}
