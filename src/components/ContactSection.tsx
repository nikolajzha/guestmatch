import { useState } from "react";
import { Phone, MapPin, Mail } from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <section id="kontakt" className="section-padding bg-muted/50">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          Kontakt
        </h2>
      </div>

      <div className="container mx-auto grid md:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 border border-border shadow-sm">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ime i prezime"
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="tel"
              placeholder="Broj telefona"
              value={formData.phone}
              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              placeholder="Poruka"
              rows={4}
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Pošalji →
          </button>
          {submitted && (
            <p className="mt-3 text-sm text-accent font-medium">Hvala na poruci! Odgovorićemo vam uskoro.</p>
          )}
        </form>

        {/* Info */}
        <div>
          <p className="text-sm text-accent font-semibold uppercase tracking-wide mb-2">Kontaktiraj nas</p>
          <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
            Pošalji nam svoje mišljenje o GuestMatch projektu
          </h3>
          <p className="text-muted-foreground mb-6">
            Tvoj feedback nam znači! Ako imaš pitanja, predloge ili želiš da podeliš svoje mišljenje o ideji GuestMatch, slobodno nam piši. Svaki komentar nam pomaže da unapredimo platformu.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            <span className="font-semibold text-foreground">Radno vreme:</span> Ponedeljak – Petak: 9:00 – 17:00
          </p>

          <h4 className="text-xl font-heading font-semibold text-foreground mb-6">Upoznajte nas i putujte sa nama</h4>
          <div className="grid gap-4">
            {[
              { icon: <Phone size={20} />, label: "Pozovite nas", value: "062-560-218" },
              { icon: <MapPin size={20} />, label: "Nalazimo se na lokaciji", value: "Jove Ilića 154" },
              { icon: <Mail size={20} />, label: "Pišite nam", value: "guestmatch@info.com" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-card rounded-lg p-4 border border-border">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
