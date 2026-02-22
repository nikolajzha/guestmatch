import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Check, X } from "lucide-react";

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["contactRequests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Get all relevant user profiles
      const userIds = [...new Set(data.flatMap(r => [r.sender_id, r.receiver_id]))];
      const { data: profiles } = await supabase.from("profiles").select("*").in("user_id", userIds);

      return data.map(r => ({
        ...r,
        senderProfile: profiles?.find(p => p.user_id === r.sender_id),
        receiverProfile: profiles?.find(p => p.user_id === r.receiver_id),
      }));
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("contact_requests")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactRequests"] });
      toast.success("Status ažuriran!");
    },
  });

  const received = requests?.filter((r: any) => r.receiver_id === user?.id) || [];
  const sent = requests?.filter((r: any) => r.sender_id === user?.id) || [];

  return (
    <AppLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Poruke</h1>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : !requests || requests.length === 0 ? (
        <div className="text-center py-20">
          <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nema poruka. Pronađi match-ovane goste i pošalji prvi zahtev!</p>
        </div>
      ) : (
        <div className="space-y-8">
          {received.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Primljeni zahtevi</h2>
              <div className="space-y-3">
                {received.map((r: any) => (
                  <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-header flex items-center justify-center text-primary-foreground font-bold shrink-0">
                      {r.senderProfile?.nickname?.[0] || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{r.senderProfile?.nickname || "Putnik"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{r.message || "Želi da se poveže sa tobom."}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("sr-RS")}</p>
                    </div>
                    {r.status === "pending" ? (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => updateStatus.mutate({ id: r.id, status: "accepted" })}
                          className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                          title="Prihvati"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => updateStatus.mutate({ id: r.id, status: "rejected" })}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          title="Odbij"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                        r.status === "accepted" ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {r.status === "accepted" ? "Prihvaćen" : "Odbijen"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sent.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Poslati zahtevi</h2>
              <div className="space-y-3">
                {sent.map((r: any) => (
                  <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold shrink-0">
                      {r.receiverProfile?.nickname?.[0] || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">→ {r.receiverProfile?.nickname || "Putnik"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{r.message || "Zahtev za kontakt"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("sr-RS")}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${
                      r.status === "accepted" ? "bg-accent/10 text-accent" :
                      r.status === "pending" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {r.status === "accepted" ? "Prihvaćen" : r.status === "pending" ? "Na čekanju" : "Odbijen"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Messages;
