import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageCircle, Check, X, Send, ArrowLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const { data: chatMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["chatMessages", activeConversation?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeConversation!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!activeConversation,
  });

  // Realtime subscription
  useEffect(() => {
    if (!activeConversation) return;
    const channel = supabase
      .channel(`chat-${activeConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversation.id}`,
        },
        () => {
          refetchMessages();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeConversation?.id]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!newMessage.trim() || !activeConversation || !user) return;
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
    },
    onError: () => toast.error("Greška pri slanju poruke."),
  });

  const received = requests?.filter((r: any) => r.receiver_id === user?.id) || [];
  const sent = requests?.filter((r: any) => r.sender_id === user?.id) || [];
  const accepted = requests?.filter((r: any) => r.status === "accepted") || [];

  const getOtherProfile = (r: any) => {
    if (r.sender_id === user?.id) return r.receiverProfile;
    return r.senderProfile;
  };

  // Chat view
  if (activeConversation) {
    const otherUser = getOtherProfile(activeConversation);
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <button onClick={() => setActiveConversation(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="w-9 h-9 rounded-full gradient-header flex items-center justify-center text-primary-foreground font-bold text-sm">
              {otherUser?.nickname?.[0] || "?"}
            </div>
            <p className="font-semibold text-foreground">{otherUser?.nickname || "Putnik"}</p>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-3 px-1">
              {(!chatMessages || chatMessages.length === 0) && (
                <p className="text-center text-muted-foreground text-sm py-8">Započni razgovor!</p>
              )}
              {chatMessages?.map((msg: any) => {
                const isMine = msg.sender_id === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("sr-RS", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="flex gap-2 pt-3 border-t border-border">
            <Input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Napiši poruku..."
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage.mutate()}
              className="flex-1"
            />
            <Button
              onClick={() => sendMessage.mutate()}
              disabled={!newMessage.trim() || sendMessage.isPending}
              size="icon"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

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
          {/* Accepted - Chat list */}
          {accepted.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Razgovori</h2>
              <div className="space-y-2">
                {accepted.map((r: any) => {
                  const other = getOtherProfile(r);
                  return (
                    <button
                      key={r.id}
                      onClick={() => setActiveConversation(r)}
                      className="w-full bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full gradient-header flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {other?.nickname?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{other?.nickname || "Putnik"}</p>
                        <p className="text-sm text-muted-foreground truncate">{r.message || "Klikni za razgovor"}</p>
                      </div>
                      <MessageCircle size={18} className="text-primary shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending received */}
          {received.filter((r: any) => r.status === "pending").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Primljeni zahtevi</h2>
              <div className="space-y-3">
                {received.filter((r: any) => r.status === "pending").map((r: any) => (
                  <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-header flex items-center justify-center text-primary-foreground font-bold shrink-0">
                      {r.senderProfile?.nickname?.[0] || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{r.senderProfile?.nickname || "Putnik"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{r.message || "Želi da se poveže sa tobom."}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("sr-RS")}</p>
                    </div>
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending sent */}
          {sent.filter((r: any) => r.status === "pending").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">Poslati zahtevi</h2>
              <div className="space-y-3">
                {sent.filter((r: any) => r.status === "pending").map((r: any) => (
                  <div key={r.id} className="bg-card rounded-xl border border-border p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold shrink-0">
                      {r.receiverProfile?.nickname?.[0] || "?"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">→ {r.receiverProfile?.nickname || "Putnik"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{r.message || "Zahtev za kontakt"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("sr-RS")}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full shrink-0 bg-primary/10 text-primary">
                      Na čekanju
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
