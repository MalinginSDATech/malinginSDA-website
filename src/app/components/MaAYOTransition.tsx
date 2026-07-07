import { useEffect, useMemo, useState } from "react";
import { motion, type Transition } from "motion/react";

// ─── Timing ──────────────────────────────────────────────────────────────────

const JUMPER_WALK_S = 1.3;
const CROUCH_S = 0.28;
const LEAP_S = 0.7;
const JUMPER_TOTAL_S = JUMPER_WALK_S + CROUCH_S + LEAP_S;
const JUMPER_EXIT_S = 0.6; // extra stroll-off-right time added after landing

const WIPE_DELAY_S = JUMPER_WALK_S + CROUCH_S + LEAP_S * 0.4;
const WIPE_SWEEP_S = 0.95;
const PAGE_SWAP_MS = (WIPE_DELAY_S + WIPE_SWEEP_S * 0.42) * 1000;
const TOTAL_MS = Math.max(JUMPER_TOTAL_S + JUMPER_EXIT_S, WIPE_DELAY_S + WIPE_SWEEP_S, 2.6) * 1000 + 300;

const WALK_CYCLE_S = 0.56; // shared by limb swing + body bob so they stay in sync

const CONFETTI_COLORS = ["#7C3AED", "#DB2777", "#0891B2", "#EA580C", "#FACC15"];
const JUMPER_END_XVW = 74;
const JUMPER_BOTTOM_PX = 72;

function darken(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.floor(((n >> 16) & 255) * (1 - amt)));
  const g = Math.max(0, Math.floor(((n >> 8) & 255) * (1 - amt)));
  const b = Math.max(0, Math.floor((n & 255) * (1 - amt)));
  return `rgb(${r},${g},${b})`;
}

// ─── Paper-cutout figure ─────────────────────────────────────────────────────
// Each limb is a thick rounded "paper strip" pivoted via a static translate (to
// the joint) wrapping a motion.g rotating around its own local (0,0) — rotating
// around an unambiguous local origin, rather than relying on SVG/CSS transform-
// origin unit conversion, is what keeps the limb visually locked to its joint.

interface LimbConf {
  animate: { rotate: number | number[] };
  transition: Transition;
}

type Pose = "walk" | "idle" | "waveR" | "waveL" | "crouch" | "leap" | "land" | "hop";

function limbConf(pose: Pose, limb: "armL" | "armR" | "legL" | "legR"): LimbConf {
  const legSwing = 20, armSwing = 26, walkDur = WALK_CYCLE_S;
  switch (pose) {
    case "walk":
      if (limb === "legL") return { animate: { rotate: [legSwing, -legSwing, legSwing] }, transition: { duration: walkDur, repeat: Infinity, ease: "easeInOut" } };
      if (limb === "legR") return { animate: { rotate: [-legSwing, legSwing, -legSwing] }, transition: { duration: walkDur, repeat: Infinity, ease: "easeInOut" } };
      if (limb === "armL") return { animate: { rotate: [-armSwing, armSwing, -armSwing] }, transition: { duration: walkDur, repeat: Infinity, ease: "easeInOut" } };
      return { animate: { rotate: [armSwing, -armSwing, armSwing] }, transition: { duration: walkDur, repeat: Infinity, ease: "easeInOut" } };
    case "hop":
      if (limb === "legL") return { animate: { rotate: [legSwing, -32, 10, -32, legSwing] }, transition: { duration: 0.62, ease: "easeInOut" } };
      if (limb === "legR") return { animate: { rotate: [-legSwing, 32, -10, 32, -legSwing] }, transition: { duration: 0.62, ease: "easeInOut" } };
      if (limb === "armL") return { animate: { rotate: [-armSwing, -90, -60, -90, -armSwing] }, transition: { duration: 0.62, ease: "easeInOut" } };
      return { animate: { rotate: [armSwing, 90, 60, 90, armSwing] }, transition: { duration: 0.62, ease: "easeInOut" } };
    case "idle":
      if (limb === "legL") return { animate: { rotate: [3, -3, 3] }, transition: { duration: 1.15, repeat: Infinity, ease: "easeInOut" } };
      if (limb === "legR") return { animate: { rotate: [-3, 3, -3] }, transition: { duration: 1.15, repeat: Infinity, ease: "easeInOut" } };
      if (limb === "armL") return { animate: { rotate: [-6, 0, -6] }, transition: { duration: 1.35, repeat: Infinity, ease: "easeInOut" } };
      return { animate: { rotate: [6, 0, 6] }, transition: { duration: 1.35, repeat: Infinity, ease: "easeInOut" } };
    case "waveR":
      if (limb === "armR") return { animate: { rotate: [20, -155, -170, -155, -170, -150] }, transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut", times: [0, 0.16, 0.4, 0.6, 0.8, 1] } };
      return limbConf("idle", limb);
    case "waveL":
      if (limb === "armL") return { animate: { rotate: [-20, 155, 170, 155, 170, 150] }, transition: { duration: 1.05, repeat: Infinity, ease: "easeInOut", times: [0, 0.16, 0.4, 0.6, 0.8, 1] } };
      return limbConf("idle", limb);
    case "crouch":
      if (limb === "legL") return { animate: { rotate: 12 }, transition: { duration: CROUCH_S, ease: "easeIn" } };
      if (limb === "legR") return { animate: { rotate: -12 }, transition: { duration: CROUCH_S, ease: "easeIn" } };
      if (limb === "armL") return { animate: { rotate: 30 }, transition: { duration: CROUCH_S, ease: "easeIn" } };
      return { animate: { rotate: -30 }, transition: { duration: CROUCH_S, ease: "easeIn" } };
    case "leap":
      if (limb === "legL") return { animate: { rotate: -58 }, transition: { duration: 0.36, ease: "backOut" } };
      if (limb === "legR") return { animate: { rotate: 58 }, transition: { duration: 0.36, ease: "backOut" } };
      if (limb === "armL") return { animate: { rotate: -172 }, transition: { duration: 0.36, ease: "backOut" } };
      return { animate: { rotate: 172 }, transition: { duration: 0.36, ease: "backOut" } };
    case "land":
      if (limb === "legL") return { animate: { rotate: 15 }, transition: { duration: 0.3, ease: "easeOut" } };
      if (limb === "legR") return { animate: { rotate: -15 }, transition: { duration: 0.3, ease: "easeOut" } };
      if (limb === "armL") return { animate: { rotate: -16 }, transition: { duration: 0.3, ease: "easeOut" } };
      return { animate: { rotate: 16 }, transition: { duration: 0.3, ease: "easeOut" } };
  }
}

function Limb({ x, y, w, h, tuck, color, conf }: { x: number; y: number; w: number; h: number; tuck: number; color: string; conf: LimbConf }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <motion.g style={{ originX: 0, originY: 0 }} animate={conf.animate} transition={conf.transition}>
        <rect x={-w / 2} y={-tuck} width={w} height={h} rx={w / 2} fill={color} />
      </motion.g>
    </g>
  );
}

function PaperFigure({ color, size, pose }: { color: string; size: number; pose: Pose }) {
  const dark = useMemo(() => darken(color, 0.32), [color]);
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 60 90" style={{ overflow: "visible", display: "block" }}>
      <Limb x={21} y={54} w={13} h={32} tuck={5} color={dark} conf={limbConf(pose, "legL")} />
      <Limb x={39} y={54} w={13} h={32} tuck={5} color={dark} conf={limbConf(pose, "legR")} />
      <rect x="10" y="17" width="40" height="42" rx="14" fill={color} />
      <Limb x={13} y={25} w={12} h={30} tuck={5} color={color} conf={limbConf(pose, "armL")} />
      <Limb x={47} y={25} w={12} h={30} tuck={5} color={color} conf={limbConf(pose, "armR")} />
      <circle cx="30" cy="12" r="14" fill={color} />
      <circle cx="24" cy="11" r="2" fill="#241a33" />
      <circle cx="36" cy="11" r="2" fill="#241a33" />
      <path d="M23,17.5 Q30,21.5 37,17.5" stroke="#241a33" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Walkers ─────────────────────────────────────────────────────────────────

interface PoseBeat {
  pose: Pose;
  atS: number;
}

function useScriptedPose(script: PoseBeat[]): Pose {
  const [pose, setPose] = useState<Pose>(script[0].pose);
  useEffect(() => {
    const timers = script.slice(1).map((b) => setTimeout(() => setPose(b.pose), b.atS * 1000));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return pose;
}

/** A background walker: simple walk-in, optional pause-to-greet or a mid-walk hop. */
function Walker({
  color, size, bottomPx, xKeyframes, xTimes, durationS, delayS = 0, script, bodyRotate,
}: {
  color: string; size: number; bottomPx: number;
  xKeyframes: string[]; xTimes: number[]; durationS: number; delayS?: number;
  script: PoseBeat[]; bodyRotate?: number[];
}) {
  const pose = useScriptedPose(script);

  return (
    <motion.div
      className="absolute left-0"
      style={{ bottom: bottomPx }}
      initial={{ x: xKeyframes[0], y: 0, rotate: 0 }}
      animate={{
        x: xKeyframes,
        y: [0, -7, 0, -7, 0, -7, 0],
        rotate: bodyRotate ?? 0,
      }}
      transition={{
        x: { duration: durationS, delay: delayS, times: xTimes, ease: "easeInOut" },
        y: { duration: WALK_CYCLE_S, delay: delayS, repeat: Infinity, ease: "easeInOut" },
        rotate: bodyRotate ? { duration: durationS, delay: delayS, ease: "easeInOut" } : undefined,
      }}
    >
      <PaperFigure color={color} size={size} pose={pose} />
    </motion.div>
  );
}

function Jumper() {
  const animS = JUMPER_TOTAL_S + JUMPER_EXIT_S;

  const pose = useScriptedPose([
    { pose: "walk", atS: 0 },
    { pose: "crouch", atS: JUMPER_WALK_S },
    { pose: "leap", atS: JUMPER_WALK_S + CROUCH_S },
    { pose: "land", atS: JUMPER_WALK_S + CROUCH_S + LEAP_S * 0.72 },
    { pose: "walk", atS: JUMPER_TOTAL_S + 0.14 },
  ]);

  const tWalk = JUMPER_WALK_S / animS;
  const tCrouch = (JUMPER_WALK_S + CROUCH_S) / animS;
  const tPeak = (JUMPER_WALK_S + CROUCH_S + LEAP_S * 0.75) / animS;
  const tLand = JUMPER_TOTAL_S / animS;

  return (
    <motion.div
      className="absolute left-0"
      style={{ bottom: JUMPER_BOTTOM_PX }}
      initial={{ x: "-18vw", y: 0, rotate: 0 }}
      animate={{
        x: ["-18vw", `${JUMPER_END_XVW}vw`, `${JUMPER_END_XVW}vw`, `${JUMPER_END_XVW + 6}vw`, "150vw"],
        y: [0, 0, 6, -96, 0, 0],
        rotate: [0, 0, -6, 366, 360, 360],
      }}
      transition={{
        x: { duration: animS, times: [0, tWalk, tCrouch, tLand, 1], ease: "easeInOut" },
        y: { duration: animS, times: [0, tWalk, tCrouch, tPeak, tLand, 1], ease: ["easeInOut", "easeIn", "backOut", "easeOut", "linear"] },
        rotate: { duration: animS, times: [0, tWalk, tCrouch, tPeak, tLand, 1], ease: ["linear", "linear", "easeIn", "easeOut", "linear"] },
      }}
    >
      <PaperFigure color="#7C3AED" size={92} pose={pose} />
    </motion.div>
  );
}

function ChatBubble({ leftVw, bottomPx, atS }: { leftVw: number; bottomPx: number; atS: number }) {
  return (
    <motion.div
      className="absolute flex items-center justify-center rounded-2xl bg-white shadow-lg"
      style={{ left: `${leftVw}vw`, bottom: bottomPx, width: 34, height: 26, fontSize: 15 }}
      initial={{ opacity: 0, scale: 0.4, y: 6 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.7], y: [6, -2, -2, -8] }}
      transition={{ duration: 1.15, delay: atS, times: [0, 0.25, 0.75, 1], ease: "easeOut" }}
    >
      ✨
    </motion.div>
  );
}

function ConfettiBurst() {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const angle = Math.random() * 360;
        const dist = 120 + Math.random() * 260;
        const rad = (angle * Math.PI) / 180;
        return {
          key: i,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          dx: Math.cos(rad) * dist,
          dy: Math.sin(rad) * dist - 70,
          size: 7 + Math.random() * 10,
          round: Math.random() > 0.5,
          delay: WIPE_DELAY_S - 0.08 + Math.random() * 0.1,
          spin: 180 + Math.random() * 360,
        };
      }),
    []
  );

  return (
    <>
      {bits.map((b) => (
        <motion.div
          key={b.key}
          className="absolute"
          style={{
            left: `${JUMPER_END_XVW}vw`,
            bottom: JUMPER_BOTTOM_PX + 60,
            width: b.size,
            height: b.size,
            background: b.color,
            borderRadius: b.round ? "50%" : "2px",
          }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
          animate={{ x: [0, b.dx], y: [0, b.dy, b.dy + 160], opacity: [0, 1, 0], rotate: [0, b.spin] }}
          transition={{ duration: 1.05, delay: b.delay, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] }}
        />
      ))}
    </>
  );
}

/**
 * A little paper-cutout crowd wanders in from the left — two pause to say hi,
 * one hops for no reason, one glances around — then the lead figure crouches
 * and springs into a spinning leap that kicks off a wipe dragging MaAYO's page
 * onto the screen. `onWipe` fires as the wipe fully covers the screen — that's
 * when the caller should swap in the new page.
 */
export function MaAYOTransitionOverlay({ onWipe, onDone }: { onWipe: () => void; onDone: () => void }) {
  useEffect(() => {
    const t1 = setTimeout(onWipe, PAGE_SWAP_MS);
    const t2 = setTimeout(onDone, TOTAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onWipe, onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
    >
      {/* greeter A — pauses, waves with its right arm, then strolls off-screen right */}
      <Walker
        color="#DB2777" size={82} bottomPx={40}
        xKeyframes={["-16vw", "26vw", "26vw", "135vw"]} xTimes={[0, 0.26, 0.52, 1]} durationS={2.6}
        script={[{ pose: "walk", atS: 0 }, { pose: "waveR", atS: 0.7 }, { pose: "walk", atS: 1.36 }]}
      />
      {/* greeter B — pauses, waves with its left arm, then strolls off-screen right */}
      <Walker
        color="#0891B2" size={76} bottomPx={34} delayS={0.1}
        xKeyframes={["-26vw", "34vw", "34vw", "142vw"]} xTimes={[0, 0.28, 0.54, 1]} durationS={2.6}
        script={[{ pose: "walk", atS: 0 }, { pose: "waveL", atS: 0.75 }, { pose: "walk", atS: 1.42 }]}
      />
      {/* the little chat, right between the two greeters */}
      <ChatBubble leftVw={29} bottomPx={116} atS={0.9} />

      {/* the skipper — hops mid-walk for no reason at all, then wanders off-screen right */}
      <Walker
        color="#EA580C" size={84} bottomPx={50} delayS={0.18}
        xKeyframes={["-20vw", "58vw", "150vw"]} xTimes={[0, 0.42, 1]} durationS={2.4}
        script={[{ pose: "walk", atS: 0 }, { pose: "hop", atS: 0.78 }, { pose: "walk", atS: 1.42 }]}
      />

      {/* the looker — simple walk with a curious glance side to side, then off-screen right */}
      <Walker
        color="#FACC15" size={78} bottomPx={60} delayS={0.06}
        xKeyframes={["-30vw", "72vw", "155vw"]} xTimes={[0, 0.45, 1]} durationS={2.5}
        script={[{ pose: "walk", atS: 0 }]}
        bodyRotate={[0, 0, -9, 9, 0]}
      />

      {/* the leader — crouches, spins into a leap, kicks off the wipe, then strolls off too */}
      <Jumper />
      <ConfettiBurst />

      <motion.div
        className="fixed inset-y-0 left-0"
        style={{
          width: "75vw",
          background: "linear-gradient(100deg, #EA580C 0%, #DB2777 45%, #7C3AED 100%)",
          clipPath: "polygon(18% 0%, 100% 0%, 82% 100%, 0% 100%)",
        }}
        initial={{ x: "135vw" }}
        animate={{ x: "-135vw" }}
        transition={{ duration: WIPE_SWEEP_S, delay: WIPE_DELAY_S, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  );
}
