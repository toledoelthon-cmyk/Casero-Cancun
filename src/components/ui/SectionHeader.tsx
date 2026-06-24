type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-casero-green">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-2xl font-bold tracking-normal text-casero-dark sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-casero-text/70 sm:mt-4 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
