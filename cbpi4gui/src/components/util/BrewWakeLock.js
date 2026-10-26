import { useEffect, useRef } from "react";
import { useCBPi } from "../data";

// A brew is running while a mash step is active, stopped mid-way or in error.
const BREWING_STATES = ["A", "S", "E"];

// Keeps the display awake during a brew, so a kiosk screen does not blank
// in the middle of a mash. Outside a brew, the OS idle settings apply again.
const BrewWakeLock = () => {
  const { state } = useCBPi();
  const brewing = state.mashProfile.some((step) => BREWING_STATES.includes(step.status));
  const lock = useRef(null);

  useEffect(() => {
    if (!brewing || !("wakeLock" in navigator)) return;

    const acquire = () => {
      if (document.visibilityState !== "visible" || (lock.current && !lock.current.released)) return;
      navigator.wakeLock.request("screen").then(
        (sentinel) => (lock.current = sentinel),
        (err) => console.warn("Screen wake lock unavailable:", err.message)
      );
    };

    // The browser drops the lock when the page is hidden: take it back on return.
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      lock.current?.release();
      lock.current = null;
    };
  }, [brewing]);

  return null;
};

export default BrewWakeLock;
