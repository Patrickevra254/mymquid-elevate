import { Link } from "@tanstack/react-router";
import { Twitter, Linkedin, Github, ArrowUpRight } from "lucide-react";
import logo from "@/assets/mquid-logo.png";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={logo} alt="Mquid" className="h-8 w-auto" />
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
                <li><Link to="/about" className="hover:text-primary">About us</Link></li>
                <li><Link to="/why-us" className="hover:text-primary">Why us</Link></li>
                <li><Link to="/team" className="hover:text-primary">Team</Link></li>
                <li><Link to="/careers" className="hover:text-primary">Careers</Link></li>
                <li><Link to="/partners" className="hover:text-primary">Partners & Certifications</Link></li>
                <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
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
          <p className="font-mono">v2026.1.1 · status: <span className="text-primary">operational</span></p>
        </div>
      </div>
    </footer>
  );
}
