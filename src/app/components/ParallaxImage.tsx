import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  /** px of drift from top to bottom of the scroll range */
  strength?: number;
  /** scale applied to the image so drift never reveals an edge */
  scale?: number;
  wrapperClassName?: string;
}

/** Image that drifts at a different rate than the page scroll, giving it depth against the foreground content. */
export function ParallaxImage({
  src,
  alt,
  className = "",
  strength = 50,
  scale = 1.18,
  wrapperClassName = "absolute inset-0 overflow-hidden",
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}
