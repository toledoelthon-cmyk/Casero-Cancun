import Image from "next/image";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

type EmptyResultsStateProps = {
  title: string;
  description: string;
  resetLabel?: string;
  onReset?: () => void;
};

function SearchIcon() {
  return <Image src="/icons/ui/icon-search.svg" alt="" width={16} height={16} aria-hidden />;
}

export function EmptyResultsState({ title, description, resetLabel = "Buscar otra cosa", onReset }: EmptyResultsStateProps) {
  return (
    <div className="rounded-[1.15rem] border border-casero-dark/10 bg-white p-5 text-center shadow-sm sm:p-7">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-casero-beige text-casero-green shadow-sm">
        <Image src="/icons/ui/icon-search.svg" alt="" width={28} height={28} aria-hidden />
      </div>
      <h2 className="mt-4 font-heading text-2xl font-extrabold text-casero-dark">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-casero-text/68">{description}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {onReset ? (
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-casero-dark/10 bg-white px-5 py-2.5 text-sm font-extrabold text-casero-dark transition hover:border-casero-green hover:text-casero-green"
            type="button"
            onClick={onReset}
          >
            <SearchIcon />
            {resetLabel}
          </button>
        ) : (
          <Button href="/buscar-servicios" variant="outline" className="w-full font-extrabold sm:w-auto">
            <SearchIcon />
            {resetLabel}
          </Button>
        )}
        <Button href="/registrar-mi-negocio" className="w-full font-extrabold sm:w-auto">
          <Store className="h-4 w-4" aria-hidden />
          Registrar negocio
        </Button>
      </div>
    </div>
  );
}