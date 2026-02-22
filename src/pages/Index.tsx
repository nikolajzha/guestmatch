import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-travel.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-header" />
        <div className="relative z-10 container mx-auto grid md:grid-cols-2 gap-12 items-center px-4 py-20">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground leading-tight mb-6">
              Guest Match
            </h1>
            <p className="text-lg text-primary-foreground/85 mb-8 max-w-lg">
              Web platforma koja kombinuje rezervaciju smeštaja sa mogućnošću upoznavanja drugih gostiju koji borave u isto vreme na istoj lokaciji.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Započni →
              </Link>
            </div>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <img src={heroImage} alt="Putnici" className="rounded-2xl shadow-2xl w-full object-cover max-h-[450px]" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-background">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Kako funkcioniše?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Tri jednostavna koraka do novih poznanstava.</p>
        </div>
        <div className="container mx-auto grid md:grid-cols-3 gap-8">
          {[
            { step: "1", title: "Rezerviši smeštaj", desc: "Pretraži i rezerviši smeštaj na željenoj destinaciji." },
            { step: "2", title: "Podeli profil", desc: "Uključi opciju deljenja profila sa drugim gostima." },
            { step: "3", title: "Poveži se", desc: "Upoznaj goste koji borave na istoj lokaciji u isto vreme." },
          ].map((item) => (
            <div key={item.step} className="bg-card rounded-xl p-8 border border-border text-center shadow-sm">
              <div className="w-14 h-14 rounded-full gradient-header flex items-center justify-center text-xl font-bold text-primary-foreground mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-header py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
            Putuj. Upoznaj. Poveži se.
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Pridruži se GuestMatch zajednici i učini svako putovanje društveno bogatijim.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-accent-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
          >
            Kreiraj nalog besplatno
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-8">
        <div className="container mx-auto text-center px-4">
          <p className="text-sm text-background/60">© 2025 GuestMatch. Sva prava zadržana.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
