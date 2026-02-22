import { AlertTriangle, ArrowRight } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Mi rešavamo pravi problem
        </p>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
          Putovanja su danas digitalna – ali <span className="gradient-text">usamljena</span>.
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mb-10">
          GuestMatch dodaje društvenu dimenziju putovanju. Povezujemo goste koji borave na istoj lokaciji u isto vreme.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <AlertTriangle className="text-destructive mb-4" size={28} />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Problem</h3>
            <p className="text-muted-foreground">
              Putnici često ostaju izolovani tokom boravka u novim sredinama. Postojeće platforme fokusiraju se samo na rezervaciju, bez društvene dimenzije.
            </p>
          </div>
          <div className="bg-card rounded-xl p-8 shadow-sm border border-border">
            <ArrowRight className="text-accent mb-4" size={28} />
            <h3 className="text-xl font-heading font-semibold text-foreground mb-3">Rešenje</h3>
            <p className="text-muted-foreground">
              GuestMatch omogućava sigurno i kontrolisano povezivanje gostiju koji borave u istom objektu ili blizini, uz potpunu kontrolu privatnosti.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-heading font-semibold gradient-text mb-6">Za koga je GuestMatch?</h3>
          <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {["Solo putnici", "Mladi putnici (18–35)", "Digitalni nomadi", "Ljudi otvoreni za nova poznanstva"].map((item) => (
              <li key={item} className="bg-card rounded-lg p-5 border border-border text-center font-medium text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
