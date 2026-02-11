"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  speed?: number;          // seconds for one full loop
  direction?: "left" | "right";
  className?: string;
  pauseOnHover?: boolean;
}

export default function InfiniteMarquee({
  children,
  speed = 30,
  direction = "left",
  className = "",
  pauseOnHover = true,
}: Props) {
  const style = {
    "--duration": `${speed}s`,
    animationDirection: direction === "right" ? "reverse" : "normal",
  } as React.CSSProperties;

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className={`flex w-max ${pauseOnHover ? "animate-marquee" : "animate-marquee"}`} style={style}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
