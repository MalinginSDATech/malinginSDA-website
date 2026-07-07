import { useRef, useState } from "react";
import { motion, useMotionValue, animate } from "motion/react";

interface RingItem {
  icon: string;
  title: string;
  desc: string;
  photo: string;
  bg: string;
  border: string;
  iconBg: string;
}

const RADIUS = 400;

/** A big 3D ring of cards the user can drag left/right to spin, like a tilted lazy-susan. */
export function DraggableRing3D({ items }: { items: RingItem[] }) {
  const rotateY = useMotionValue(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const step = 360 / items.length;

  const snapToNearest = (extra = 0) => {
    const target = Math.round((rotateY.get() + extra) / step) * step;
    animate(rotateY, target, { type: "spring", stiffness: 260, damping: 30 });
    const idx = (((-target / step) % items.length) + items.length) % items.length;
    setActiveIndex(Math.round(idx));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    const degDelta = dx * 0.4;
    rotateY.set(rotateY.get() + degDelta);
    velocity.current = degDelta;
  };
  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    snapToNearest(velocity.current * 4);
  };

  const goTo = (idx: number) => {
    const target = -idx * step;
    animate(rotateY, target, { type: "spring", stiffness: 260, damping: 30 });
    setActiveIndex(idx);
  };

  return (
    <div className="select-none">
      <div
        className="relative mx-auto cursor-grab active:cursor-grabbing"
        style={{ perspective: 2200, height: 460, touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d", rotateX: -9, rotateY }}
        >
          {items.map((item, i) => (
            <div
              key={item.title}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotateY(${i * step}deg) translateZ(${RADIUS}px)` }}
            >
              <div className={`${item.bg} border ${item.border} rounded-3xl overflow-hidden w-80 shadow-2xl pointer-events-none`}>
                <div className="h-36 w-full overflow-hidden">
                  <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-7">
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <p className="font-[Playfair_Display] text-foreground text-xl font-semibold mb-2 leading-tight">{item.title}</p>
                  <p className="font-[Lato] text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-10">
        {items.map((item, i) => (
          <button
            key={item.title}
            onClick={() => goTo(i)}
            aria-label={item.title}
            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40"}`}
          />
        ))}
      </div>
      <p className="text-center font-[Lato] text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-3">
        Drag to spin
      </p>
    </div>
  );
}
