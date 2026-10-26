import type { ReactNode } from "react";

export function Status({
  children,
  neutral = false,
}: {
  children: ReactNode;
  neutral?: boolean;
}) {
  return (
    <span className={`status ${neutral ? "status-neutral" : ""}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}
