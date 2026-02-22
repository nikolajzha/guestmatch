import AppLayout from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Users } from "lucide-react";

const Search = () => {
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: accommodations, isLoading } = useQuery({
    queryKey: ["accommodations", city, type, maxPrice],
    queryFn: async () => {
      let query = supabase.from("accommodations").select("*");
      if (city) query = query.ilike("city", `%${city}%`);
      if (type) query = query.eq("type", type);
      if (maxPrice) query = query.lte("price_per_night", Number(maxPrice));
      const { data, error } = await query.order("rating", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <AppLayout>
      <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Pretraži smeštaj</h1>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border mb-6">
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Grad ili destinacija..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          >
            <option value="">Svi tipovi</option>
            <option value="hotel">Hotel</option>
            <option value="hostel">Hostel</option>
            <option value="apartman">Apartman</option>
            <option value="vila">Vila</option>
          </select>
          <input
            type="number"
            placeholder="Max cena po noći (€)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          />
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accommodations?.map((acc) => (
            <Link
              key={acc.id}
              to={`/accommodation/${acc.id}`}
              className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={acc.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"}
                  alt={acc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-primary uppercase">{acc.type}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" /> {acc.rating}
                  </span>
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{acc.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin size={14} /> {acc.city}, {acc.country}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">€{acc.price_per_night}<span className="text-sm font-normal text-muted-foreground">/noć</span></span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users size={14} /> do {acc.max_guests}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {accommodations?.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-10">Nema rezultata za ovu pretragu.</p>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Search;
