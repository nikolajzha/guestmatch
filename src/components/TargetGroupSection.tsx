import { Backpack, Globe, Laptop, Heart, Home, MapPin } from "lucide-react";

const groups = [
  {
    icon: <Backpack size={24} />,
    title: "Solo putnici",
    desc: "Putnici koji često putuju sami i žele da upoznaju druge ljude tokom boravka, ali isključivo u sigurnom i kontrolisanom digitalnom okruženju.",
  },
  {
    icon: <Globe size={24} />,
    title: "Mladi putnici (18–35)",
    desc: "Mladi ljudi otvoreni za nova iskustva, druženje i deljenje avantura. Aktivno koriste digitalne platforme i očekuju moderno korisničko iskustvo.",
  },
  {
    icon: <Laptop size={24} />,
    title: "Digitalni nomadi",
    desc: "Osobe koje kombinuju posao i putovanja traže priliku da se povežu sa drugim putnicima na destinaciji, bez gubitka privatnosti.",
  },
  {
    icon: <Heart size={24} />,
    title: "Društveno orijentisani putnici",
    desc: "Korisnici kojima je važan društveni aspekt putovanja i koji žele da upoznaju ljude sličnih interesovanja tokom boravka.",
  },
  {
    icon: <Home size={24} />,
    title: "Vlasnici smeštaja",
    desc: "Sekundarna ciljna grupa – vlasnici apartmana, hostela i manjih hotela koji žele da gostima ponude dodatnu vrednost.",
  },
  {
    icon: <MapPin size={24} />,
    title: "Lokalne turističke usluge",
    desc: "Male turističke agencije i lokalni vodiči koji mogu iskoristiti platformu za povezivanje sa gostima zainteresovanim za aktivnosti.",
  },
];

const TargetGroupSection = () => {
  return (
    <section id="ciljna-grupa" className="section-padding bg-muted/50">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          Ciljna grupa
        </h2>
      </div>

      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Ciljna grupa GuestMatch platforme
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            GuestMatch je prvenstveno namenjen solo i mladim putnicima otvorenim za nova poznanstva, dok sekundarnu ciljnu grupu čine vlasnici smeštaja i lokalni pružaoci turističkih usluga.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                {group.icon}
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2 font-heading">{group.title}</h4>
              <p className="text-sm text-muted-foreground">{group.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupSection;
