import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { MapPin, Star, Users, Wifi, ArrowLeft, CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const AccommodationDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [shareProfile, setShareProfile] = useState(false);

  const { data: acc, isLoading } = useQuery({
    queryKey: ["accommodation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accommodations")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const bookMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reservations").insert({
        user_id: user!.id,
        accommodation_id: id!,
        check_in: checkInDate ? format(checkInDate, "yyyy-MM-dd") : "",
        check_out: checkOutDate ? format(checkOutDate, "yyyy-MM-dd") : "",
        guests,
        share_profile: shareProfile,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Rezervacija uspešno kreirana!");
      navigate("/reservations");
    },
    onError: (err: any) => toast.error(err.message),
  });

  if (isLoading) return <AppLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></AppLayout>;
  if (!acc) return <AppLayout><p className="text-center py-20 text-muted-foreground">Smeštaj nije pronađen.</p></AppLayout>;

  const nights = checkInDate && checkOutDate ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000)) : 0;

  return (
    <AppLayout>
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft size={16} /> Nazad
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left - Details */}
        <div className="lg:col-span-2">
          <img
            src={acc.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200"}
            alt={acc.name}
            className="w-full rounded-xl object-cover aspect-video mb-6"
          />
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">{acc.type}</span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star size={14} className="text-yellow-500 fill-yellow-500" /> {acc.rating}
            </span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">{acc.name}</h1>
          <p className="flex items-center gap-1 text-muted-foreground mb-4">
            <MapPin size={16} /> {acc.location}, {acc.city}
          </p>
          <p className="text-foreground mb-6">{acc.description}</p>

          {acc.amenities && acc.amenities.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Sadržaj</h3>
              <div className="flex flex-wrap gap-2">
                {acc.amenities.map((a: string) => (
                  <span key={a} className="flex items-center gap-1 px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground">
                    <Wifi size={14} /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Booking form */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm h-fit sticky top-20">
          <div className="text-2xl font-bold text-foreground mb-1">
            €{acc.price_per_night}<span className="text-sm font-normal text-muted-foreground">/noć</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
            <Users size={14} /> Maks. {acc.max_guests} gostiju
          </p>

          <form onSubmit={(e) => { e.preventDefault(); bookMutation.mutate(); }} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Dolazak</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "dd-MM-yyyy") : "Izaberi datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Odlazak</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "dd-MM-yyyy") : "Izaberi datum"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date < (checkInDate || new Date(new Date().setHours(0,0,0,0)))}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Broj gostiju</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              >
                {Array.from({ length: acc.max_guests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            {/* Privacy opt-in (F5) */}
            <div className="border border-accent/30 bg-accent/5 rounded-lg p-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shareProfile}
                  onChange={(e) => setShareProfile(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-input text-accent focus:ring-accent"
                />
                <span className="text-sm">
                  <span className="font-medium text-foreground block">Dozvoli prikaz profila</span>
                  <span className="text-muted-foreground">Drugim gostima u istom objektu/periodu</span>
                </span>
              </label>
            </div>

            {nights > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>€{acc.price_per_night} × {nights} noći</span>
                  <span className="font-semibold text-foreground">€{(Number(acc.price_per_night) * nights).toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={bookMutation.isPending || !checkInDate || !checkOutDate}
              className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {bookMutation.isPending ? "Rezervisanje..." : "Rezerviši"}
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default AccommodationDetail;
