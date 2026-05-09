import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";

type Item = { to: string; label: string; desc?: string };
type NavEntry =
  | { kind: "link"; to: string; label: string }
  | { kind: "menu"; label: string; basePaths: string[]; items: Item[] };

const nav: NavEntry[] = [
  {
    kind: "menu",
    label: "Solutions",
    basePaths: ["/solutions"],
    items: [
      { to: "/solutions", label: "Managed Services", desc: "24/7 ops, support and SLAs" },
      { to: "/solutions", label: "Cyber Security", desc: "Zero-trust, SOC and audits" },
      { to: "/solutions", label: "Cloud Services", desc: "AWS · Azure · GCP" },
      { to: "/solutions", label: "IT Consulting", desc: "Strategy & architecture" },
      { to: "/solutions", label: "Web Development", desc: "Marketing & e-commerce" },
      { to: "/solutions", label: "Mobile Development", desc: "iOS, Android, React Native" },
      { to: "/industries", label: "Industries", desc: "Logistics, health, finance" },
    ],
  },
  {
    kind: "menu",
    label: "Company",
    basePaths: ["/about", "/why-us", "/team", "/careers", "/partners"],
    items: [
      { to: "/about", label: "About us", desc: "Our story and mission" },
      { to: "/why-us", label: "Why us", desc: "How we're different" },
      { to: "/team", label: "Team", desc: "The people behind Mquid" },
      { to: "/careers", label: "Careers", desc: "Open roles" },
      { to: "/partners", label: "Partners & Certifications", desc: "Tier-1 platform partnerships" },
    ],
  },
  { kind: "link", to: "/blog", label: "Blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setMobileMenu(null);
  }, [path]);

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${
          scrolled || openMenu ? "glass-strong" : "border border-transparent"
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
            if (n.kind === "link") {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                    active ? "text-foreground bg-white/[0.06]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            }
            const active = n.basePaths.some((p) => path.startsWith(p));
            const isOpen = openMenu === n.label;
            return (
              <div
                key={n.label}
                className="relative"
                onMouseEnter={() => enter(n.label)}
                onMouseLeave={leave}
              >
                <button
                  onClick={() => setOpenMenu(isOpen ? null : n.label)}
                  className={`inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                    active || isOpen ? "text-foreground bg-white/[0.06]" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div
                    onMouseEnter={() => enter(n.label)}
                    onMouseLeave={leave}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[340px]"
                  >
                    <div className="glass-strong rounded-2xl p-2">
                      {n.items.map((it) => (
                        <Link
                          key={it.label}
                          to={it.to}
                          className="block px-3 py-2.5 rounded-xl hover:bg-primary/10 transition group/item"
                        >
                          <div className="text-sm font-medium text-foreground group-hover/item:text-primary transition">
                            {it.label}
                          </div>
                          {it.desc && (
                            <div className="text-xs text-muted-foreground mt-0.5">{it.desc}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2 mr-1">
            <span className="text-xs text-muted-foreground">Client support</span>
            <a href="tel:+23408109439770" className="text-sm font-mono text-foreground hover:text-primary transition">
              0810 943 9770
            </a>
          </div>
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition"
          >
            Contact us <ArrowUpRight className="h-3.5 w-3.5" />
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
        <div className="absolute top-20 left-3 right-3 glass-strong rounded-2xl p-3 md:hidden max-h-[80vh] overflow-y-auto">
          {nav.map((n) => {
            if (n.kind === "link") {
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className="block px-4 py-3 rounded-xl text-foreground hover:bg-white/[0.05]"
                >
                  {n.label}
                </Link>
              );
            }
            const isOpen = mobileMenu === n.label;
            return (
              <div key={n.label}>
                <button
                  onClick={() => setMobileMenu(isOpen ? null : n.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-white/[0.05]"
                >
                  <span>{n.label}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="ml-2 pl-3 border-l border-border">
                    {n.items.map((it) => (
                      <Link
                        key={it.label}
                        to={it.to}
                        className="block px-4 py-2.5 text-sm rounded-xl text-muted-foreground hover:text-primary"
                      >
                        {it.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            to="/contact"
            className="block mt-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-center font-medium"
          >
            Contact us
          </Link>
        </div>
      )}
    </header>
  );
}
