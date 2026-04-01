import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useFamilyStatistics } from "@/hooks/useFamilyStatistics";
import { FamilyRelationship } from "@/hooks/useRelationships";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { RelationshipsTab } from "@/components/statistics/RelationshipsTab";
import { PlacesTab } from "@/components/statistics/PlacesTab";
import { AgesTab } from "@/components/statistics/AgesTab";
import { BirthsTab } from "@/components/statistics/BirthsTab";
import { MarriagesTab } from "@/components/statistics/MarriagesTab";
import { ChildrenTab } from "@/components/statistics/ChildrenTab";
import { DivorcesTab } from "@/components/statistics/DivorcesTab";

const Statistics = () => {
  const { members, loading: membersLoading } = useFamilyMembers();
  const [relationships, setRelationships] = useState<FamilyRelationship[]>([]);
  const [relLoading, setRelLoading] = useState(true);

  useEffect(() => {
    const fetchRels = async () => {
      const { data } = await supabase.from("family_relationships").select("*");
      setRelationships((data || []) as FamilyRelationship[]);
      setRelLoading(false);
    };
    fetchRels();
  }, []);

  const stats = useFamilyStatistics(members, relationships);
  const loading = membersLoading || relLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Family Statistics</h1>
            <p className="text-muted-foreground mt-2">Statistical insights about the Chapaneri family tree</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
              <TabsTrigger value="places">Places</TabsTrigger>
              <TabsTrigger value="ages">Ages</TabsTrigger>
              <TabsTrigger value="births">Births</TabsTrigger>
              <TabsTrigger value="marriages">Marriages</TabsTrigger>
              <TabsTrigger value="children">Children</TabsTrigger>
              <TabsTrigger value="divorces">Divorces</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab gender={stats.gender} living={stats.living} relationshipStatus={stats.relationshipStatus} />
            </TabsContent>
            <TabsContent value="relationships">
              <RelationshipsTab stats={stats.relationshipNetwork} />
            </TabsContent>
            <TabsContent value="places">
              <PlacesTab stats={stats.placesStats} />
            </TabsContent>
            <TabsContent value="ages">
              <AgesTab ageGroups={stats.ageGroups} oldest={stats.oldestLiving} youngest={stats.youngestLiving} />
            </TabsContent>
            <TabsContent value="births">
              <BirthsTab months={stats.birthMonths} zodiac={stats.zodiacSigns} decades={stats.birthDecades} />
            </TabsContent>
            <TabsContent value="marriages">
              <MarriagesTab members={members} relationships={relationships} />
            </TabsContent>
            <TabsContent value="children">
              <ChildrenTab stats={stats.childrenStats} />
            </TabsContent>
            <TabsContent value="divorces">
              <DivorcesTab members={members} relationships={relationships} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
