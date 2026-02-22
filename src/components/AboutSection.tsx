import aboutImage from "@/assets/about-travel.jpg";

const AboutSection = () => {
  return (
    <section id="o-projektu" className="section-padding bg-background">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          O projektu
        </h2>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img
          src={aboutImage}
          alt="Putnici istražuju destinaciju"
          className="rounded-2xl shadow-lg w-full object-cover aspect-square"
        />
        <div>
          <h3 className="text-2xl md:text-3xl font-heading font-bold gradient-text mb-4">
            Šta je GuestMatch?
          </h3>
          <p className="text-muted-foreground mb-4">
            GuestMatch je travel-tech platforma koja povezuje goste u istom smeštaju ili blizini tokom istog perioda boravka. Za razliku od klasičnih rezervacionih sistema, GuestMatch gradi male privremene zajednice putnika.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Kako funkcioniše?</h4>
          <p className="text-muted-foreground mb-4">
            Nakon rezervacije, korisnik može uključiti opciju deljenja profila. Sistem zatim prikazuje druge goste sa sličnim terminima boravka koji su takođe dali saglasnost. Na taj način nastaju male zajednice putnika.
          </p>

          <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">Koji problem rešavamo?</h4>
          <p className="text-muted-foreground mb-4">
            Putnici često ostaju izolovani tokom boravka u novim sredinama. Postojeće platforme fokusiraju se samo na rezervaciju, bez društvene dimenzije. GuestMatch rešava taj problem omogućavajući sigurno i kontrolisano povezivanje gostiju.
          </p>

          <a href="#plan-razvoja" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity text-sm">
            Naš MVP →
          </a>
        </div>
      </div>

      {/* Wider value proposition */}
      <div className="container mx-auto mt-20">
        <div className="bg-card rounded-2xl p-10 border border-border shadow-sm">
          <p className="text-sm text-accent font-semibold uppercase tracking-wide mb-2">Putuj. Upoznaj. Poveži se.</p>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Više od rezervacije – iskustvo zajedničkog putovanja.
          </h3>
          <p className="text-muted-foreground max-w-3xl">
            GuestMatch donosi novu dimenziju digitalnog turizma. Naša platforma omogućava putnicima da se povežu sa drugim gostima na istoj lokaciji, razmenjuju iskustva i organizuju aktivnosti, uz potpunu kontrolu nad ličnim podacima. Cilj nam je da svako putovanje učinimo društveno bogatijim i prijatnijim.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
