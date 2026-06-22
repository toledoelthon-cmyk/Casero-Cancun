import { HTMLAttributes } from "react";
import { clsx } from "clsx";

type BadgeTone = "green" | "turquoise" | "orange" | "neutral";

const tones: Record<BadgeTone, string> = {
  green: "bg-casero-green/10 text-casero-green",
  turquoise: "bg-casero-turquoise/10 text-casero-turquoise",
  orange: "bg-casero-orange/15 text-casero-dark",
  neutral: "bg-casero-background text-casero-text",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
