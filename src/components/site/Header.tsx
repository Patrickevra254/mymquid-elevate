import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, ChevronDown, Target, Sun, Moon } from "lucide-react";
import logo from "@/assets/mquid-logo.png";
import { services, challenges, industries } from "@/lib/solutions-data";
import { useTheme } from "@/components/theme-provider";

type Item = { to: string; params?: Record<string, string>; label: string; desc?: string };
type NavEntry =
  | { kind: "link"; to: string; label: string }
  | { kind: "menu"; label: string; basePaths: string[]; items: Item[] }
  | { kind: "mega"; label: string; basePaths: string[] };

const companyItems: Item[] = [
  { to: "/about", label: "About us", desc: "Our story and mission" },
  { to: "/why-us", label: "Why us", desc: "How we're different" },
  { to: "/team", label: "Team", desc: "The people behind Mquid" },
  { to: "/careers", label: "Careers", desc: "Open roles" },
  { to: "/partners", label: "Partners & Certifications", desc: "Tier-1 platform partnerships" },
];

const nav: NavEntry[] = [
  { kind: "mega", label: "Solutions", basePaths: ["/solutions", "/industries", "/challenges"] },
  { kind: "menu", label: "Company", basePaths: ["/about", "/why-us", "/team", "/careers", "/partners"], items: companyItems },
  { kind: "link", to: "/blog", label: "Blog" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();
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
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 pt-3 sm:pt-5">
      <div
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-4 sm:px-6 py-2.5 transition-all duration-500 ${
          scrolled || openMenu
            ? "glass-strong shadow-lg"
            : "border border-transparent backdrop-blur-sm"
        }`}
        style={!scrolled && !openMenu ? { background: "var(--nav-bg-base)" } : undefined}
      >
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img src={logo} alt="Mquid" className="h-7 w-auto" />
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
                    active ? "text-foreground bg-foreground/5" : "text-muted-foreground hover:text-foreground"
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
                    active || isOpen ? "text-foreground bg-foreground/5" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && n.kind === "menu" && (
                  <div
                    onMouseEnter={() => enter(n.label)}
                    onMouseLeave={leave}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[340px]"
                  >
                    <div className="menu-panel rounded-2xl p-2">
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

                {isOpen && n.kind === "mega" && (
                  <div
                    onMouseEnter={() => enter(n.label)}
                    onMouseLeave={leave}
                    className="fixed left-1/2 -translate-x-1/2 top-[68px] pt-3 w-[min(1100px,95vw)]"
                  >
                    <div className="menu-panel rounded-3xl p-6 sm:p-8">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Services */}
                        <div className="md:col-span-3">
                          <h4 className="text-xs uppercase tracking-widest text-primary mb-4">Services</h4>
                          <ul className="space-y-1.5">
                            {services.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  to="/solutions/$slug"
                                  params={{ slug: s.slug }}
                                  className="block text-sm text-muted-foreground hover:text-primary transition py-1"
                                >
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                            <li className="pt-2">
                              <Link to="/solutions" className="text-xs text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                                View all <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            </li>
                          </ul>
                        </div>

                        {/* Business challenges */}
                        <div className="md:col-span-5">
                          <h4 className="text-xs uppercase tracking-widest text-primary mb-4">Business Challenges</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {challenges.map((c) => (
                              <Link
                                key={c.slug}
                                to="/solutions/$slug"
                                params={{ slug: c.slug }}
                                className="card-elevated rounded-xl p-3 hover:border-primary/40 transition group/c"
                              >
                                <div className="text-sm font-medium group-hover/c:text-primary transition">{c.title}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{c.desc}</div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* Industry focus */}
                        <div className="md:col-span-4 relative">
                          <div className="absolute -top-2 right-0 h-12 w-12 rounded-full glass grid place-items-center opacity-70">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <h4 className="text-xs uppercase tracking-widest text-primary mb-4">Industry Focus</h4>
                          <ul className="space-y-1.5">
                            {industries.map((ind) => (
                              <li key={ind.slug}>
                                <Link
                                  to="/solutions/$slug"
                                  params={{ slug: ind.slug }}
                                  className="block text-sm text-muted-foreground hover:text-primary transition py-1"
                                >
                                  {ind.title}
                                </Link>
                              </li>
                            ))}
                            <li className="pt-2">
                              <Link to="/industries" className="text-xs text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                                View all <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
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
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="h-9 w-9 grid place-items-center rounded-full glass hover:text-primary transition"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
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
        <div className="absolute top-20 left-3 right-3 menu-panel rounded-2xl p-3 md:hidden max-h-[80vh] overflow-y-auto">
          {/* Solutions mobile group */}
          <div>
            <button
              onClick={() => setMobileMenu(mobileMenu === "Solutions" ? null : "Solutions")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-foreground/5"
            >
              <span>Solutions</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileMenu === "Solutions" ? "rotate-180" : ""}`} />
            </button>
            {mobileMenu === "Solutions" && (
              <div className="ml-2 pl-3 border-l border-border space-y-3 pb-2">
                <div>
                  <p className="px-4 pt-2 text-[11px] uppercase tracking-widest text-primary">Services</p>
                  {services.map((s) => (
                    <Link key={s.slug} to="/solutions/$slug" params={{ slug: s.slug }}
                      className="block px-4 py-2 text-sm rounded-xl text-muted-foreground hover:text-primary">
                      {s.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="px-4 text-[11px] uppercase tracking-widest text-primary">Business Challenges</p>
                  {challenges.map((c) => (
                    <Link key={c.slug} to="/solutions/$slug" params={{ slug: c.slug }}
                      className="block px-4 py-2 text-sm rounded-xl text-muted-foreground hover:text-primary">
                      {c.title}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="px-4 text-[11px] uppercase tracking-widest text-primary">Industry Focus</p>
                  {industries.map((ind) => (
                    <Link key={ind.slug} to="/solutions/$slug" params={{ slug: ind.slug }}
                      className="block px-4 py-2 text-sm rounded-xl text-muted-foreground hover:text-primary">
                      {ind.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <button
              onClick={() => setMobileMenu(mobileMenu === "Company" ? null : "Company")}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-foreground hover:bg-foreground/5"
            >
              <span>Company</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileMenu === "Company" ? "rotate-180" : ""}`} />
            </button>
            {mobileMenu === "Company" && (
              <div className="ml-2 pl-3 border-l border-border">
                {companyItems.map((it) => (
                  <Link key={it.label} to={it.to}
                    className="block px-4 py-2.5 text-sm rounded-xl text-muted-foreground hover:text-primary">
                    {it.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/blog" className="block px-4 py-3 rounded-xl text-foreground hover:bg-foreground/5">Blog</Link>

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
