"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type VinPrintEventName } from "../lib/analytics";

type ConversionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: VinPrintEventName;
  eventPosition: string;
  children: ReactNode;
};

export default function ConversionLink({
  eventName,
  eventPosition,
  children,
  onClick,
  ...props
}: ConversionLinkProps) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, { position: eventPosition });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
