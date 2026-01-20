import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedMembers } from "@/components/home/FeaturedMembers";
import { StatsSection } from "@/components/home/StatsSection";
import { TimelinePreview } from "@/components/home/TimelinePreview";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedMembers />
        <StatsSection />
        <TimelinePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
