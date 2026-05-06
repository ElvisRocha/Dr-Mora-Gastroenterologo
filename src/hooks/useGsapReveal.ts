import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type RefObject } from "react";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  selector?: string;
  y?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  delay?: number;
};

export function useGsapReveal<T extends HTMLElement = HTMLDivElement>(
  options: RevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useGSAP(
    () => {
      const {
        selector = "[data-reveal]",
        y = 28,
        duration = 0.8,
        stagger = 0.08,
        start = "top 85%",
        delay = 0,
      } = options;

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const reduced = ctx.conditions?.reduced;
          if (reduced) {
            gsap.set(selector, { opacity: 1, y: 0, clearProps: "all" });
            return;
          }

          const targets = ref.current?.querySelectorAll(selector);
          if (!targets || targets.length === 0) return;

          gsap.from(targets, {
            opacity: 0,
            y,
            duration,
            stagger,
            delay,
            ease: "power2.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: ref.current!,
              start,
              once: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
