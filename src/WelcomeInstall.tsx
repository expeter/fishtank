import { useState } from "react";
import { Download, Smartphone, X } from "lucide-react";

interface WelcomeInstallProps {
  lang: "en" | "de";
  installed: boolean;
  available: boolean;
  onInstall: () => void;
}

/** The operating-system prompt is always requested by the child's own tap. */
export function WelcomeInstall({
  lang,
  installed,
  available,
  onInstall,
}: WelcomeInstallProps) {
  const [dismissed, setDismissed] = useState(false);
  if (installed || dismissed) return null;
  const de = lang === "de";
  return (
    <aside
      className="welcome-install"
      aria-label={de ? "Deine Fischwelt als App" : "Your fish world as an app"}
    >
      <span className="welcome-install-art" aria-hidden="true">
        <Smartphone size={29} />
        <span>≈</span>
      </span>
      <div className="welcome-install-copy">
        <strong>
          {de
            ? "Deine Fischwelt auf dem Startbildschirm"
            : "Your fish world on your home screen"}
        </strong>
        <p>
          {de
            ? "Mit einem Tipp wieder bei deinen Fischen. Du kannst auch direkt hier spielen."
            : "One tap takes you back to your fish. You can also play right here."}
        </p>
        <button className="welcome-install-action" onClick={onInstall}>
          <Download size={18} aria-hidden="true" />
          {de ? "Auf diesem Handy installieren" : "Install on this phone"}
        </button>
        {!available && (
          <small>
            {de
              ? "Wir zeigen dir die Schritte für deinen Browser."
              : "We’ll show you the steps for your browser."}
          </small>
        )}
      </div>
      <button
        className="welcome-install-dismiss"
        aria-label={
          de ? "Installationshinweis ausblenden" : "Hide installation hint"
        }
        onClick={() => setDismissed(true)}
      >
        <X size={20} aria-hidden="true" />
      </button>
    </aside>
  );
}
