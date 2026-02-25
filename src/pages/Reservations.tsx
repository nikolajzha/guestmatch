import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Reservations = () => {
  const { user } = useAuth();

  const { data: reservations, isLoading } = useQuery({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, accommodations(*)")
        .eq("user_id", user!.id)
        .order("check_in", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-heading font-bold text-foreground">Moje rezervacije</h1>
        <Link to="/search" className="px-4 py-2 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
          + Nova
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : reservations?.length === 0 ? (
        <div className="text-center py-20">
          <CalendarCheck size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Još nemaš nijednu rezervaciju.</p>
          <Link to="/search" className="text-accent font-semibold hover:underline">Pretraži smeštaj →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations?.map((r: any) => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row gap-4">
              <img
                src={r.accommodations?.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300"}
                alt={r.accommodations?.name}
                className="w-full sm:w-40 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground">{r.accommodations?.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin size={14} /> {r.accommodations?.city}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-foreground"><span className="text-muted-foreground">Dolazak:</span> {r.check_in.split("-").reverse().join("-")}</span>
                  <span className="text-foreground"><span className="text-muted-foreground">Odlazak:</span> {r.check_out.split("-").reverse().join("-")}</span>
                  <span className="text-foreground"><span className="text-muted-foreground">Gosti:</span> {r.guests}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                    {r.status === "confirmed" ? "Potvrđena" : r.status}
                  </span>
                  {r.share_profile && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      Profil deli se
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Reservations;
