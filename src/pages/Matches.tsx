import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Users, MessageCircle } from "lucide-react";
import { useState } from "react";

const Matches = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [contactMessage, setContactMessage] = useState("");
  const [contactTarget, setContactTarget] = useState<string | null>(null);

  // Get user's reservations with share_profile = true
  const { data: myReservations } = useQuery({
    queryKey: ["mySharedReservations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("id, user_id, accommodation_id, check_in, check_out, share_profile")
        .eq("user_id", user!.id)
        .eq("share_profile", true);
      if (error) throw error;

      // Fetch accommodation details separately
      if (!data || data.length === 0) return [];
      const accIds = [...new Set(data.map(r => r.accommodation_id))];
      const { data: accs } = await supabase.from("accommodations").select("*").in("id", accIds);
      return data.map(r => ({ ...r, accommodation: accs?.find(a => a.id === r.accommodation_id) }));
    },
    enabled: !!user,
  });

  // Get matched guests
  const { data: matches, isLoading } = useQuery({
    queryKey: ["matches", user?.id, myReservations],
    queryFn: async () => {
      if (!myReservations || myReservations.length === 0) return [];

      const { data: otherReservations, error } = await supabase
        .from("reservations")
        .select("id, user_id, accommodation_id, check_in, check_out")
        .eq("share_profile", true)
        .neq("user_id", user!.id);

      if (error) throw error;
      if (!otherReservations || otherReservations.length === 0) return [];

      // Get accommodation and profile data
      const accIds = [...new Set(otherReservations.map(r => r.accommodation_id))];
      const userIds = [...new Set(otherReservations.map(r => r.user_id))];

      const [{ data: accs }, { data: profiles }] = await Promise.all([
        supabase.from("accommodations").select("*").in("id", accIds),
        supabase.from("profiles").select("*").in("user_id", userIds),
      ]);

      // Filter overlapping dates and same city
      const matched = otherReservations.filter(other => {
        const otherAcc = accs?.find(a => a.id === other.accommodation_id);
        return myReservations.some((mine: any) => {
          const sameAcc = mine.accommodation_id === other.accommodation_id;
          const sameCity = mine.accommodation?.city === otherAcc?.city;
          const datesOverlap =
            new Date(mine.check_in) <= new Date(other.check_out) &&
            new Date(mine.check_out) >= new Date(other.check_in);
          return (sameAcc || sameCity) && datesOverlap;
        });
      });

      return matched.map(m => ({
        ...m,
        accommodation: accs?.find(a => a.id === m.accommodation_id),
        profile: profiles?.find(p => p.user_id === m.user_id),
      }));
    },
    enabled: !!user && !!myReservations,
  });

  const sendContact = useMutation({
    mutationFn: async (receiverId: string) => {
      const { error } = await supabase.from("contact_requests").insert({
        sender_id: user!.id,
        receiver_id: receiverId,
        message: contactMessage,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Zahtev za kontakt je poslat!");
      setContactTarget(null);
      setContactMessage("");
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <AppLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Match-ovani gosti</h1>

      {!myReservations || myReservations.length === 0 ? (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6">
          <p className="text-foreground font-medium mb-1">Nemaš aktivnih deljenja profila</p>
          <p className="text-sm text-muted-foreground">
            Da bi video druge goste, napravi rezervaciju i uključi opciju "Dozvoli prikaz profila".
          </p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !matches || matches.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Trenutno nema match-ovanih gostiju za tvoje rezervacije.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match: any) => (
            <div key={match.id} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full gradient-header flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {match.profile?.nickname?.[0] || "?"}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{match.profile?.nickname || "Putnik"}</h3>
                  <p className="text-xs text-muted-foreground">
                    {match.profile?.age_range} · {match.profile?.language}
                  </p>
                </div>
              </div>

              {match.profile?.interests?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {match.profile.interests.slice(0, 4).map((i: string) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{i}</span>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground mb-3">
                📍 {match.accommodation?.name}, {match.accommodation?.city}
                <br />
                📅 {match.check_in} → {match.check_out}
              </p>

              {contactTarget === match.user_id ? (
                <div className="space-y-2">
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Napiši poruku..."
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => sendContact.mutate(match.user_id)}
                      disabled={sendContact.isPending}
                      className="flex-1 py-1.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 disabled:opacity-50"
                    >
                      Pošalji
                    </button>
                    <button
                      onClick={() => setContactTarget(null)}
                      className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm"
                    >
                      Otkaži
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setContactTarget(match.user_id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                >
                  <MessageCircle size={16} /> Pošalji zahtev
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Matches;
