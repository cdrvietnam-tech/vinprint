"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      className="fixed z-40 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4D00] text-white rounded-full shadow-lg hover:bg-[#E64500] hover:scale-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 bottom-[88px] sm:bottom-6 right-4 sm:right-6"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
    </button>
  );
}
