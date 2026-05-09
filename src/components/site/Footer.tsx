import { Link } from "@tanstack/react-router";
import { Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
                <span className="text-primary-foreground font-bold">M</span>
              </div>
              <span className="text-lg font-semibold">Mquid</span>
            </div>
            <p className="mt-4 text-muted-foreground max-w-sm text-sm leading-relaxed">
              Engineering business continuity through intelligent automation,
              cloud and security infrastructure for modern enterprises.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all"
            >
              Schedule a free consultation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Platform
              </h4>
              <ul className="space-y-3">
                <li><Link to="/solutions" className="hover:text-primary">Managed Services</Link></li>
                <li><Link to="/solutions" className="hover:text-primary">Cyber Security</Link></li>
                <li><Link to="/solutions" className="hover:text-primary">Cloud Services</Link></li>
                <li><Link to="/solutions" className="hover:text-primary">IT Consulting</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-primary">About</Link></li>
                <li><Link to="/industries" className="hover:text-primary">Industries</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
                <li><a href="tel:+23408109439770" className="hover:text-primary">+234 810 943 9770</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Connect
              </h4>
              <div className="flex gap-2">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="h-9 w-9 rounded-full glass grid place-items-center hover:text-primary transition">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mquid Technologies. All rights reserved.</p>
          <p className="font-mono">v2026.1 · status: <span className="text-primary">operational</span></p>
        </div>
      </div>
    </footer>
  );
}
