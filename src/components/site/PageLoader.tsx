import { useEffect, useState } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/mquid-logo.png";

export function PageLoader() {
  // react-router-dom doesn't have a built-in "loading" state for data-less routes,
  // so we show a brief loader on initial mount and on each route change.
  const location = useLocation();
  // useNavigation may not be available outside a data router; guard it.
  let navState: string = "idle";
  try {
    navState = useNavigation().state;
  } catch {
    navState = "idle";
  }

  const [initial, setInitial] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setInitial(false), 850);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (initial) return;
    setRouteLoading(true);
    const t = setTimeout(() => setRouteLoading(false), 250);
    return () => clearTimeout(t);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const show = initial || routeLoading || navState === "loading";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
          aria-hidden="true"
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative flex flex-col items-center gap-6">
            <div className="relative h-24 w-24 grid place-items-center">
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40 loader-orbit" />
              <div className="absolute inset-3 rounded-full border border-primary/20" />
              <img src={logo} alt="Mquid" className="relative h-10 w-auto loader-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">Mquid</p>
              <div className="h-0.5 w-32 overflow-hidden rounded-full bg-foreground/10">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
