import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Search, CalendarCheck, Users, MessageCircle, User, LogOut, Home, Menu, X } from "lucide-react";
import { useState } from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Početna", icon: <Home size={18} /> },
    { to: "/search", label: "Pretraga", icon: <Search size={18} /> },
    { to: "/reservations", label: "Rezervacije", icon: <CalendarCheck size={18} /> },
    { to: "/matches", label: "Gosti", icon: <Users size={18} /> },
    { to: "/messages", label: "Poruke", icon: <MessageCircle size={18} /> },
    { to: "/profile", label: "Profil", icon: <User size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
      <header className="gradient-header sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-4">
          <Link to="/dashboard" className="text-xl font-heading font-bold text-primary-foreground">
            Guest Match
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors ml-2"
            >
              <LogOut size={18} />
            </button>
          </nav>

          <button className="md:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="md:hidden pb-3 px-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  location.pathname === link.to
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-primary-foreground/70 hover:text-primary-foreground w-full"
            >
              <LogOut size={18} />
              Odjavi se
            </button>
          </nav>
        )}
      </header>

      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default AppLayout;
