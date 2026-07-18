"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Hướng trượt vào: lên (mặc định), trái, phải, hoặc chỉ mờ dần. */
  direction?: "up" | "left" | "right" | "fade";
  /** Trễ (giây) để tạo hiệu ứng nối tiếp giữa các phần tử. */
  delay?: number;
  className?: string;
  /** Thẻ HTML bọc ngoài (mặc định div). */
  as?: "div" | "section" | "li" | "article";
};

const OFFSET = 28;

function hiddenTransform(direction: RevealProps["direction"]) {
  if (direction === "up") return `translateY(${OFFSET}px)`;
  if (direction === "left") return `translateX(${OFFSET}px)`;
  if (direction === "right") return `translateX(-${OFFSET}px)`;
  return "none";
}

/**
 * Reveal: nội dung "hiện lên" khi cuộn vào viewport.
 * Dùng IntersectionObserver + CSS transition (không dùng Framer Motion) để
 * server và client render giống hệt nhau -> không lỗi hydration trên SSR.
 * Tự tắt hiệu ứng khi người dùng bật "giảm chuyển động".
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : hiddenTransform(direction),
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: "opacity, transform",
  };

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
