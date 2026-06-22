import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

type TrustFeatureCardProps = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export function TrustFeatureCard({ icon: Icon, title, text }: TrustFeatureCardProps) {
  return (
    <Card className="h-full">
      <Icon className="h-8 w-8 text-casero-green" aria-hidden />
      <h3 className="mt-4 font-heading text-lg font-bold text-casero-dark">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-casero-text/70">{text}</p>
    </Card>
  );
}
