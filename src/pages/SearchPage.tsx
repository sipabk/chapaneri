import { useState, useMemo } from "react";
import { Search, User, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MemberCard } from "@/components/members/MemberCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchMembers } from "@/data/familyData";

const SearchPage = () => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchMembers(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Search Header */}
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                  Search Family
                </h1>
                <p className="text-muted-foreground text-lg">
                  Find family members by name, location, or relationship
                </p>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Type to search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-12 py-6 text-lg"
                  autoFocus
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {query.length > 0 && query.length < 2 && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Type at least 2 characters to search
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {query.length >= 2 && (
              <p className="text-sm text-muted-foreground mb-8 text-center">
                Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
              </p>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {results.map(member => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="text-center py-16">
                <User className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-display font-semibold text-muted-foreground mb-2">
                  Start typing to search
                </h3>
                <p className="text-muted-foreground/70">
                  Search across all family members
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

export default SearchPage;
