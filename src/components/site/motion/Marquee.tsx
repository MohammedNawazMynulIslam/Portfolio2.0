import type { CSSProperties, ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  duration?: number;
  className?: string;
}

export function Marquee({ children, duration = 28, className }: MarqueeProps) {
  const style = { "--marquee-duration": `${duration}s` } as CSSProperties;
  return (
    <div className={`marquee ${className ?? ""}`} style={style}>
      <div className="marquee-track">
        <span className="marquee-group" aria-hidden="true">
          {children}
        </span>
        <span className="marquee-group">{children}</span>
      </div>
    </div>
  );
}
