import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedMembers } from "@/components/home/FeaturedMembers";
import { StatsSection } from "@/components/home/StatsSection";
import { TimelinePreview } from "@/components/home/TimelinePreview";
import { FamilyStatsWidget } from "@/components/home/FamilyStatsWidget";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturedMembers />
        <StatsSection />

        {/* Quick Search & Stats Widget Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
                Quick Lookup
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Instantly search across all family members with smart filters
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                  <AdvancedSearch showFilters={true} compact />
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <FamilyStatsWidget />
              </motion.div>
            </div>
          </div>
        </section>

        <TimelinePreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
