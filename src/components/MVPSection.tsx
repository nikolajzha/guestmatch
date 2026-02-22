import { User, Search, CalendarCheck, Shield, Users, MessageCircle } from "lucide-react";

const phases = [
  {
    icon: <User size={24} />,
    title: "Registracija i prijava",
    desc: "Korisnik kreira nalog (email/lozinka) i dobija pristup pretrazi i rezervaciji smeštaja.",
  },
  {
    icon: <Search size={24} />,
    title: "Pretraga smeštaja",
    desc: "Pretraga po destinaciji, datumu, broju osoba i tipu smeštaja sa osnovnim filterima.",
  },
  {
    icon: <CalendarCheck size={24} />,
    title: "Rezervacija",
    desc: "Jednostavan proces potvrde rezervacije. Sistem evidentira termin i vezuje ga za lokaciju.",
  },
  {
    icon: <Shield size={24} />,
    title: "Profil + privatnost",
    desc: "Korisnik unosi osnovni profil (nadimak, jezik, interesovanja) i bira da li želi da bude vidljiv drugim gostima.",
  },
  {
    icon: <Users size={24} />,
    title: "Match lista gostiju",
    desc: "Nakon saglasnosti, korisnik vidi listu drugih gostiju u istom objektu ili blizini sa preklapanjem termina.",
  },
  {
    icon: <MessageCircle size={24} />,
    title: "Osnovna komunikacija",
    desc: 'Minimalni kontakt mehanizam: "pošalji zahtev" ili osnovna poruka. Sigurno povezivanje.',
  },
];

const MVPSection = () => {
  return (
    <section id="plan-razvoja" className="section-padding bg-background">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          Plan razvoja
        </h2>
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-accent uppercase tracking-wide mb-2">MVP – šta je to?</p>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Minimalna funkcionalna verzija platforme
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MVP testira glavnu ideju: da se gosti mogu povezati nakon rezervacije, uz opt-in privatnost. Rezervacija smeštaja + kontrolisano povezivanje gostiju.
          </p>
        </div>

        {/* Phases grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {phases.map((phase, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg gradient-header flex items-center justify-center text-primary-foreground mb-4">
                {phase.icon}
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2 font-heading">{phase.title}</h4>
              <p className="text-sm text-muted-foreground">{phase.desc}</p>
            </div>
          ))}
        </div>

        {/* Future phases */}
        <div className="bg-card rounded-2xl p-10 border border-border shadow-sm">
          <h3 className="text-xl font-heading font-bold gradient-text mb-4">Faza 2+ (dalji razvoj)</h3>
          <p className="text-muted-foreground">
            Nakon MVP-a, plan je uvođenje pametnijeg matchinga (preporuke po interesovanjima), grupnih aktivnosti, partnerstava sa lokalnim vodičima i kasnije mobilne aplikacije. GuestMatch se razvija kroz fazni pristup koji dokazuje osnovnu vrednost platforme.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MVPSection;
