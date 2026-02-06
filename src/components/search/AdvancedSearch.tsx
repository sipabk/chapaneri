import { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, User, MapPin, Calendar, Filter, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { searchMembers, familyMembers, FamilyMember } from "@/data/familyData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type GenerationFilter = 'all' | 0 | 1 | 2 | 3 | 4;
type GenderFilter = 'all' | 'male' | 'female';

const generationLabels: Record<number, string> = {
  0: 'Great-Grandparents',
  1: 'Grandparents',
  2: 'Parents & Aunts/Uncles',
  3: 'Subject & Siblings',
  4: 'Children & Nieces/Nephews',
};

interface AdvancedSearchProps {
  showFilters?: boolean;
  compact?: boolean;
}

export const AdvancedSearch = ({ showFilters = true, compact = false }: AdvancedSearchProps) => {
  const [query, setQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState<GenerationFilter>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showInstantResults, setShowInstantResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const locations = useMemo(() => {
    const places = new Set<string>();
    familyMembers.forEach(m => {
      if (m.birthPlace) places.add(m.birthPlace.split(',')[0].trim());
    });
    return Array.from(places).sort();
  }, []);

  const results = useMemo(() => {
    let members = query.trim().length >= 1 ? searchMembers(query) : familyMembers;

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

  const instantResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchMembers(query).slice(0, 5);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowInstantResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent/30 text-foreground rounded px-0.5">{part}</mark>
      ) : part
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input with Instant Results */}
      <div ref={containerRef} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search by name, place, or relationship..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowInstantResults(true)}
          className={cn("pl-12 pr-12", compact ? "py-4" : "py-6 text-lg")}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => { setQuery(""); inputRef.current?.focus(); }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        {/* Instant Dropdown Results */}
        <AnimatePresence>
          {showInstantResults && instantResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {instantResults.map(member => (
                <Link
                  key={member.id}
                  to={`/member/${member.id}`}
                  onClick={() => setShowInstantResults(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    member.gender === 'male' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                  )}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {highlightMatch(member.name, query)}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.relationship}</p>
                  </div>
                  {member.birthPlace && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {member.birthPlace.split(',')[0]}
                    </span>
                  )}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                Generation
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked={generationFilter === 'all'} onCheckedChange={() => setGenerationFilter('all')}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <User className="w-3.5 h-3.5" />
                Gender
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem checked={genderFilter === 'all'} onCheckedChange={() => setGenderFilter('all')}>All</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={genderFilter === 'male'} onCheckedChange={() => setGenderFilter('male')}>Male</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={genderFilter === 'female'} onCheckedChange={() => setGenderFilter('female')}>Female</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Location
                <ChevronDown className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-auto">
              <DropdownMenuCheckboxItem checked={locationFilter === 'all'} onCheckedChange={() => setLocationFilter('all')}>
                All Locations
              </DropdownMenuCheckboxItem>
              {locations.map(loc => (
                <DropdownMenuCheckboxItem key={loc} checked={locationFilter === loc} onCheckedChange={() => setLocationFilter(loc)}>
                  {loc}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {(generationFilter !== 'all' || genderFilter !== 'all' || locationFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => { setGenerationFilter('all'); setGenderFilter('all'); setLocationFilter('all'); }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Result Count */}
      {(query.trim().length >= 1 || generationFilter !== 'all' || genderFilter !== 'all' || locationFilter !== 'all') && (
        <p className="text-sm text-muted-foreground">
          Showing {results.length} of {familyMembers.length} members
        </p>
      )}
    </div>
  );
};
