export interface InstallPromptEvent extends Event {
  prompt(): Promise<void | { outcome: "accepted" | "dismissed" }>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
}
export function isInstalled(): boolean {
  return (
    matchMedia("(display-mode: standalone)").matches ||
    matchMedia("(display-mode: fullscreen)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
export async function toggleFullscreen(): Promise<
  "entered" | "exited" | "unavailable"
> {
  if (document.fullscreenElement) {
    if (typeof document.exitFullscreen !== "function") return "unavailable";
    await document.exitFullscreen();
    return "exited";
  }
  if (
    typeof document.documentElement.requestFullscreen !== "function" ||
    document.fullscreenEnabled === false
  )
    return "unavailable";
  await document.documentElement.requestFullscreen();
  return "entered";
}
