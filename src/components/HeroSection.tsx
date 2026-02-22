import heroImage from "@/assets/hero-travel.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-header" />

      {/* Content */}
      <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-12 items-center pt-24 pb-16 px-4">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
            Guest Match
          </h1>
          <p className="text-lg text-primary-foreground/85 mb-8 max-w-lg font-body">
            Web platforma koja kombinuje rezervaciju smeštaja sa mogućnošću upoznavanja drugih gostiju koji borave u isto vreme na istoj lokaciji.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#plan-razvoja"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Pogledaj MVP ↓
            </a>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              Kontakt
            </a>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <img
            src={heroImage}
            alt="Putnici se druže u hostelu"
            className="rounded-2xl shadow-2xl w-full object-cover max-h-[450px]"
          />
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40L48 35C96 30 192 20 288 25C384 30 480 50 576 55C672 60 768 50 864 40C960 30 1056 20 1152 22C1248 24 1344 38 1392 45L1440 52V100H0V40Z" fill="hsl(210, 20%, 98%)" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
