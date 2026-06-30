"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const dismissKey = "casero-pwa-install-dismissed";

function isPublicRoute(pathname: string) {
  return !pathname.startsWith("/admin") && !pathname.startsWith("/proveedor");
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px) and (pointer: coarse)").matches;
}

function isIosSafari() {
  const userAgent = window.navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!CriOS|FxiOS|EdgiOS|OPiOS).)*Safari/i.test(userAgent);

  return isIos && isSafari;
}

function isStandalone() {
  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;

  return window.matchMedia("(display-mode: standalone)").matches || navigatorWithStandalone.standalone === true;
}

export function InstallPrompt() {
  const pathname = usePathname();
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (!isPublicRoute(pathname) || !isMobileViewport() || isStandalone()) {
      setIsDismissed(true);
      setInstallEvent(null);
      setShowIosHint(false);
      return;
    }

    const dismissed = window.localStorage.getItem(dismissKey) === "true";
    setIsDismissed(dismissed);
    setShowIosHint(!dismissed && isIosSafari());
  }, [pathname]);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();

      if (!isPublicRoute(window.location.pathname) || !isMobileViewport() || isStandalone()) {
        return;
      }

      if (window.localStorage.getItem(dismissKey) === "true") {
        return;
      }

      setInstallEvent(event as BeforeInstallPromptEvent);
      setShowIosHint(false);
      setIsDismissed(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  function dismiss() {
    window.localStorage.setItem(dismissKey, "true");
    setInstallEvent(null);
    setShowIosHint(false);
    setIsDismissed(true);
  }

  async function install() {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    dismiss();
  }

  if (isDismissed || (!installEvent && !showIosHint)) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-20 z-50 rounded-md border border-casero-dark/10 bg-white p-4 text-casero-dark shadow-soft sm:left-5 sm:right-auto sm:max-w-sm">
      <p className="font-heading text-sm font-bold">Instala Casero Cancún en tu celular</p>
      {showIosHint ? (
        <p className="mt-2 text-sm leading-5 text-casero-text/75">
          En iPhone, toca Compartir y luego &quot;Agregar a pantalla de inicio&quot;.
        </p>
      ) : null}
      <div className="mt-3 flex gap-2">
        {installEvent ? (
          <button
            type="button"
            className="rounded-md bg-casero-green px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            onClick={install}
          >
            Instalar
          </button>
        ) : null}
        <button
          type="button"
          className="rounded-md border border-casero-dark/10 px-4 py-2 text-sm font-bold text-casero-dark transition hover:bg-casero-background"
          onClick={dismiss}
        >
          Ahora no
        </button>
      </div>
    </div>
  );
}
