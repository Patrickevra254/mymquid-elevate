import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const nav = [
  { to: "/solutions", label: "Solutions" },
  { to: "/industries", label: "Industries" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${
          scrolled ? "glass-strong" : "border border-transparent"
        }`}
      >
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <span className="text-primary-foreground font-bold text-sm">M</span>
            <div className="absolute inset-0 rounded-lg bg-primary/40 blur-lg -z-10 group-hover:bg-primary/60 transition" />
          </div>
          <span className="text-base font-semibold tracking-tight">Mquid</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => {
            const active = path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                  active
                    ? "text-foreground bg-white/[0.06]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Get started <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden h-9 w-9 grid place-items-center rounded-full glass"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute top-20 left-3 right-3 glass-strong rounded-2xl p-3 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="block px-4 py-3 rounded-xl text-foreground hover:bg-white/[0.05]"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="block mt-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-center font-medium"
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
