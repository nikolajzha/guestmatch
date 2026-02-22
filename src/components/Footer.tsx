const Footer = () => {
  return (
    <footer className="gradient-header py-10">
      <div className="container mx-auto text-center">
        <h3 className="text-xl font-heading font-bold text-primary-foreground mb-2">Guest Match</h3>
        <p className="text-sm text-primary-foreground/70 mb-6">Putuj. Upoznaj. Poveži se.</p>
        <nav className="flex flex-wrap justify-center gap-6 mb-6">
          {["O projektu", "Plan razvoja", "Ciljna grupa", "Tim", "Kontakt", "Novosti"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <p className="text-xs text-primary-foreground/50">
          © 2025 GuestMatch. Sva prava zadržana.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
