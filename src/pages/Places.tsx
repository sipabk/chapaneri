import { useMemo } from "react";
import { MapPin, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MemberCard } from "@/components/members/MemberCard";
import { familyMembers } from "@/data/familyData";

const Places = () => {
  const placeGroups = useMemo(() => {
    const groups: Record<string, typeof familyMembers> = {};
    
    familyMembers.forEach(member => {
      if (member.birthPlace) {
        // Normalize place names
        const place = member.birthPlace.split(',')[0].trim();
        if (!groups[place]) {
          groups[place] = [];
        }
        groups[place].push(member);
      }
    });

    // Sort by number of members
    return Object.entries(groups)
      .sort((a, b) => b[1].length - a[1].length);
  }, []);

  const totalPlaces = placeGroups.length;
  const membersWithPlaces = familyMembers.filter(m => m.birthPlace).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Geographic Origins</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Places
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover where our family members were born across {totalPlaces} locations
              </p>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <div className="bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{totalPlaces} Locations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{membersWithPlaces} Members with recorded birthplaces</span>
              </div>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="space-y-12">
              {placeGroups.map(([place, members], index) => (
                <div 
                  key={place}
                  className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(index * 0.1, 0.5)}s` }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-semibold text-foreground">
                        {place}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {members.length} {members.length === 1 ? 'member' : 'members'} born here
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pl-0 md:pl-14">
                    {members.map(member => (
                      <MemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {placeGroups.length === 0 && (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No places recorded
                </h3>
                <p className="text-muted-foreground">
                  Birth places haven't been documented yet
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Places;
