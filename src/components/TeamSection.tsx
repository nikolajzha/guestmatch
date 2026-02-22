const teamMembers = [
  { name: "Nikolija Mitić", index: "2023/0782" },
  { name: "Tara Milovanović", index: "2023/0872" },
  { name: "Lara Rosandić", index: "2022/0845" },
  { name: "Maša Pavlović", index: "2023/0788" },
];

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("");
};

const TeamSection = () => {
  return (
    <section id="tim" className="section-padding bg-background">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          Naš tim
        </h2>
      </div>

      <div className="container mx-auto">
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Upoznajte naš tim – studente koji stoje iza GuestMatch projekta.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-20 h-20 rounded-full gradient-header flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
                {getInitials(member.name)}
              </div>
              <h4 className="text-lg font-heading font-semibold text-foreground mb-1">{member.name}</h4>
              <p className="text-sm text-muted-foreground">{member.index}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Mentor: <span className="font-semibold text-foreground">Đurđa Vidanović</span>
        </p>
      </div>
    </section>
  );
};

export default TeamSection;
