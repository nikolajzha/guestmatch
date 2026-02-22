import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "O projektu", href: "#o-projektu" },
  { label: "Plan razvoja", href: "#plan-razvoja" },
  { label: "Ciljna grupa", href: "#ciljna-grupa" },
  { label: "Tim", href: "#tim" },
  { label: "Kontakt", href: "#kontakt" },
  { label: "Novosti", href: "#novosti" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 gradient-header">
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="#" className="text-2xl font-heading font-bold text-primary-foreground">
          Guest Match
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden gradient-header pb-4">
          <ul className="container mx-auto flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
