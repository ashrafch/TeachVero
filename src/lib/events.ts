export type LearningEvent =
  | "cta_clicked"
  | "booking_started"
  | "booking_submitted"
  | "content_engaged"
  | "package_interest";
export function track(event: LearningEvent) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("teachvero.analytics") !== "granted") return;
    window.dispatchEvent(
      new CustomEvent("teachvero:event", {
        detail: { event, path: location.pathname },
      }),
    );
  } catch {
    /* Storage may be unavailable; tracking stays off. */
  }
}
