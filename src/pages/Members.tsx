import { useState, useMemo } from "react";
import { Search, Filter, Users, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MemberCard } from "@/components/members/MemberCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { familyMembers } from "@/data/familyData";

type GenerationFilter = 'all' | 0 | 1 | 2 | 3 | 4;
type GenderFilter = 'all' | 'male' | 'female';

const generationLabels: Record<number, string> = {
  0: 'Great-Grandparents',
  1: 'Grandparents',
  2: 'Parents & Aunts/Uncles',
  3: 'Subject & Siblings',
  4: 'Children & Nieces/Nephews',
};

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState<GenerationFilter>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');

  const filteredMembers = useMemo(() => {
    return familyMembers.filter(member => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.birthPlace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.relationship.toLowerCase().includes(searchQuery.toLowerCase());

      // Generation filter
      const matchesGeneration = generationFilter === 'all' || member.generation === generationFilter;

      // Gender filter
      const matchesGender = genderFilter === 'all' || member.gender === genderFilter;

      return matchesSearch && matchesGeneration && matchesGender;
    });
  }, [searchQuery, generationFilter, genderFilter]);

  const groupedByGeneration = useMemo(() => {
    const groups: Record<number, typeof familyMembers> = {};
    filteredMembers.forEach(member => {
      if (!groups[member.generation]) {
        groups[member.generation] = [];
      }
      groups[member.generation].push(member);
    });
    return groups;
  }, [filteredMembers]);

  const sortedGenerations = Object.keys(groupedByGeneration)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Family Directory</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                All Family Members
              </h1>
              <p className="text-muted-foreground text-lg">
                Browse and search through {familyMembers.length} documented family members
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, place, or relationship..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Generation Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Generation
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuCheckboxItem
                    checked={generationFilter === 'all'}
                    onCheckedChange={() => setGenerationFilter('all')}
                  >
                    All Generations
                  </DropdownMenuCheckboxItem>
                  {[0, 1, 2, 3, 4].map(gen => (
                    <DropdownMenuCheckboxItem
                      key={gen}
                      checked={generationFilter === gen}
                      onCheckedChange={() => setGenerationFilter(gen as GenerationFilter)}
                    >
                      {generationLabels[gen]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Gender Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    Gender
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={genderFilter === 'all'}
                    onCheckedChange={() => setGenderFilter('all')}
                  >
                    All
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={genderFilter === 'male'}
                    onCheckedChange={() => setGenderFilter('male')}
                  >
                    Male
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={genderFilter === 'female'}
                    onCheckedChange={() => setGenderFilter('female')}
                  >
                    Female
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mt-3">
              Showing {filteredMembers.length} of {familyMembers.length} members
            </p>
          </div>
        </section>

        {/* Members Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {sortedGenerations.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No members found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {sortedGenerations.map(generation => (
                  <div key={generation}>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                      {generationLabels[generation]}
                      <span className="text-muted-foreground font-normal text-lg ml-3">
                        ({groupedByGeneration[generation].length})
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {groupedByGeneration[generation].map(member => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Members;
