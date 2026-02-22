import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, CalendarCheck, Users, MessageCircle } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const { data: reservationCount } = useQuery({
    queryKey: ["reservationCount", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("reservations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: messageCount } = useQuery({
    queryKey: ["messageCount", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("contact_requests")
        .select("*", { count: "exact", head: true })
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const cards = [
    { to: "/search", icon: <Search size={28} />, title: "Pretraži smeštaj", desc: "Pronađi savršen smeštaj" },
    { to: "/reservations", icon: <CalendarCheck size={28} />, title: "Moje rezervacije", desc: `${reservationCount ?? 0} aktivnih` },
    { to: "/matches", icon: <Users size={28} />, title: "Match-ovani gosti", desc: "Upoznaj putnike" },
    { to: "/messages", icon: <MessageCircle size={28} />, title: "Poruke", desc: `${messageCount ?? 0} konverzacija` },
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
          Zdravo, {profile?.nickname || "Putniče"}! 👋
        </h1>
        <p className="text-muted-foreground">Šta želiš da uradiš danas?</p>
      </div>

      {!profile?.nickname || profile.interests?.length === 0 ? (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-2">Kompletriaj svoj profil</h3>
          <p className="text-sm text-muted-foreground mb-3">Dodaj interesovanja i jezike da bi te drugi putnici lakše pronašli.</p>
          <Link to="/profile" className="text-sm font-semibold text-accent hover:underline">
            Uredi profil →
          </Link>
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-lg gradient-header flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 font-heading">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
