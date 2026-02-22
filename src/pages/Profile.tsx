import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const interestOptions = [
  "Planinarenje", "Plivanje", "Fotografija", "Istorija", "Hrana i piće",
  "Muzika", "Sport", "Čitanje", "Yoga", "Biciklizam", "Surfovanje", "Umetnost",
];

const Profile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState("");
  const [ageRange, setAgeRange] = useState("18-25");
  const [language, setLanguage] = useState("Srpski");
  const [interests, setInterests] = useState<string[]>([]);
  const [shareProfile, setShareProfile] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setNickname(profile.nickname || "");
      setAgeRange(profile.age_range || "18-25");
      setLanguage(profile.language || "Srpski");
      setInterests(profile.interests || []);
      setShareProfile(profile.share_profile || false);
    }
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ nickname, age_range: ageRange, language, interests, share_profile: shareProfile })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profil uspešno ažuriran!");
    },
    onError: (err: any) => toast.error(err.message),
  });

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  if (isLoading) return <AppLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Moj profil</h1>

        <form
          onSubmit={(e) => { e.preventDefault(); updateProfile.mutate(); }}
          className="space-y-6"
        >
          <div className="bg-card rounded-xl p-6 border border-border space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nadimak</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Starosni opseg</label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="18-25">18–25</option>
                <option value="26-35">26–35</option>
                <option value="36-45">36–45</option>
                <option value="46+">46+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Jezik</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option>Srpski</option>
                <option>Engleski</option>
                <option>Nemački</option>
                <option>Francuski</option>
                <option>Španski</option>
              </select>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <label className="block text-sm font-medium text-foreground mb-3">Interesovanja</label>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    interests.includes(interest)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy opt-in (F5) */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="share"
                checked={shareProfile}
                onChange={(e) => setShareProfile(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-ring"
              />
              <label htmlFor="share" className="cursor-pointer">
                <span className="font-medium text-foreground block">Dozvoli prikaz profila drugim gostima</span>
                <span className="text-sm text-muted-foreground">
                  Tvoj profil (nadimak, interesovanja, jezik) biće vidljiv drugim gostima koji borave na istoj lokaciji i takođe dele svoj profil. Ovo možeš promeniti u bilo kom trenutku.
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateProfile.isPending}
            className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {updateProfile.isPending ? "Čuvanje..." : "Sačuvaj profil"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Profile;
