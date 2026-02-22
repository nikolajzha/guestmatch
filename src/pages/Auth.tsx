import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import heroImage from "@/assets/hero-travel.jpg";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { nickname },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Proverite email za potvrdu naloga!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img src={heroImage} alt="GuestMatch" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-header opacity-70" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <h1 className="text-5xl font-heading font-bold text-primary-foreground mb-4">Guest Match</h1>
            <p className="text-xl text-primary-foreground/80">Putuj. Upoznaj. Poveži se.</p>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            {isLogin ? "Prijavi se" : "Kreiraj nalog"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isLogin ? "Dobrodošli nazad!" : "Pridruži se GuestMatch zajednici"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nadimak</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tvoj nadimak"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="email@primer.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Lozinka</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Minimum 6 karaktera"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Učitavanje..." : isLogin ? "Prijavi se" : "Registruj se"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Nemaš nalog?" : "Već imaš nalog?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Registruj se" : "Prijavi se"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
