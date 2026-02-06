import { useState, useMemo } from "react";
import { Search, User, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MemberCard } from "@/components/members/MemberCard";
import { AdvancedSearch } from "@/components/search/AdvancedSearch";
import { FamilyStatsWidget } from "@/components/home/FamilyStatsWidget";
import { familyMembers, searchMembers } from "@/data/familyData";
import { motion } from "framer-motion";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState<'all' | number>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const results = useMemo(() => {
    let members = query.trim().length >= 2 ? searchMembers(query) : familyMembers;

    if (generationFilter !== 'all') {
      members = members.filter(m => m.generation === generationFilter);
    }
    if (genderFilter !== 'all') {
      members = members.filter(m => m.gender === genderFilter);
    }
    if (locationFilter !== 'all') {
      members = members.filter(m => m.birthPlace?.split(',')[0].trim() === locationFilter);
    }

    return members;
  }, [query, generationFilter, genderFilter, locationFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Search Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Search Family
                </h1>
                <p className="text-muted-foreground text-lg">
                  Find family members by name, location, or relationship with advanced filters
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AdvancedSearch showFilters={true} />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <FamilyStatsWidget />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {familyMembers.slice(0, 12).map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <MemberCard member={member} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SearchPage;
