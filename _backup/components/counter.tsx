"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type CounterProps = {
  /** Giá trị đích, ví dụ 900, 33200, 230. */
  value: number;
  /** Hậu tố hiển thị: "+", "K+", "/5"... */
  suffix?: string;
  /** Có định dạng dấu chấm ngăn cách nghìn không (kiểu VN). */
  grouping?: boolean;
  durationMs?: number;
};

function formatVN(n: number) {
  return n.toLocaleString("vi-VN");
}

/**
 * Counter: đếm số tăng dần từ 0 → value khi cuộn vào màn hình.
 * Tự nhảy thẳng tới giá trị cuối nếu người dùng bật giảm chuyển động.
 */
export default function Counter({
  value,
  suffix = "",
  grouping = true,
  durationMs = 1400,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, durationMs, reduceMotion]);

  return (
    <span ref={ref}>
      {grouping ? formatVN(display) : display}
      {suffix}
    </span>
  );
}
