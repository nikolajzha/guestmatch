import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import AboutSection from "@/components/AboutSection";
import MVPSection from "@/components/MVPSection";
import TargetGroupSection from "@/components/TargetGroupSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <AboutSection />
      <MVPSection />
      <TargetGroupSection />
      <TeamSection />
      <ContactSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
