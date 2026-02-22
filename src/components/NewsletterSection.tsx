import { useState } from "react";

const NewsletterSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "" });
  };

  return (
    <section id="novosti" className="section-padding bg-background">
      {/* Page header */}
      <div className="gradient-header rounded-2xl py-16 mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground text-center">
          Novosti o putovanjima
        </h2>
      </div>

      <div className="container mx-auto max-w-xl text-center">
        <p className="text-lg text-muted-foreground mb-8">
          Prijavi se da dobijaš informacije o popularnim destinacijama i posebnim ponudama za putovanja na koja ide veći broj ljudi.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ime i prezime *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            Prijavi se
          </button>
          {submitted && (
            <p className="text-sm text-accent font-medium">Uspešno ste se prijavili!</p>
          )}
        </form>
      </div>
    </section>
  );
};

export default NewsletterSection;
