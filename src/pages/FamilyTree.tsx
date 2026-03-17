import { useState, useEffect, useCallback } from "react";
import { TreeDeciduous, ZoomIn, ZoomOut, Maximize2, Printer, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DbFamilyTreeNode } from "@/components/tree/DbFamilyTreeNode";
import { MemberDetailDialog } from "@/components/members/MemberDetailDialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFamilyMembers, DbFamilyMember, MemberPhoto } from "@/hooks/useFamilyMembers";
import { useRelationships, FamilyRelationship } from "@/hooks/useRelationships";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const FamilyTree = () => {
  const [zoom, setZoom] = useState(1);
  const { members, loading, getMemberPhotos } = useFamilyMembers();
  const { getRelationships } = useRelationships();
  const { canEdit } = useAuth();
  const [allRels, setAllRels] = useState<FamilyRelationship[]>([]);
  const [rootId, setRootId] = useState<string>("");
  const [detailMember, setDetailMember] = useState<DbFamilyMember | null>(null);
  const [detailPhotos, setDetailPhotos] = useState<MemberPhoto[]>([]);
  const [relsLoading, setRelsLoading] = useState(true);

  // Load all relationships at once
  useEffect(() => {
    const loadAllRels = async () => {
      setRelsLoading(true);
      const { data } = await supabase.from("family_relationships").select("*");
      setAllRels((data || []) as FamilyRelationship[]);
      setRelsLoading(false);
    };
    loadAllRels();
  }, []);

  // Find a good default root: the member named "Bhagvanji Champaneri" (paternal grandfather) or first gen-0 member
  useEffect(() => {
    if (members.length > 0 && !rootId) {
      const patriarch = members.find(m => m.name.includes("Bhagvanji"));
      if (patriarch) {
        setRootId(patriarch.id);
      } else {
        const oldest = [...members].sort((a, b) => a.generation - b.generation)[0];
        setRootId(oldest.id);
      }
    }
  }, [members, rootId]);

  const rootMember = members.find(m => m.id === rootId);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));
  const handleReset = () => setZoom(1);

  const handleSelectMember = async (member: DbFamilyMember) => {
    setDetailMember(member);
    const photos = await getMemberPhotos(member.id);
    setDetailPhotos(photos);
  };

  const isLoading = loading || relsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        <section className="bg-gradient-parchment border-b border-border">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
                <TreeDeciduous className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Interactive Family Tree</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-4">
                Family Tree
              </h1>
              <p className="text-muted-foreground text-lg">
                Explore the connections between generations. Click on any member to view their profile.
              </p>
            </div>
          </div>
        </section>

        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Root:</span>
              <Select value={rootId} onValueChange={setRootId}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select root..." />
                </SelectTrigger>
                <SelectContent>
                  {[...members].sort((a, b) => a.generation - b.generation).map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.3}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-16 text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 1.5}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleReset}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Link to="/tree/print">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Printer className="w-4 h-4" /> Print
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <section className="py-12 overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : !rootMember ? (
            <div className="text-center py-16 text-muted-foreground">No members found</div>
          ) : (
            <div
              className="min-w-max flex justify-center px-8 pb-8 transition-transform duration-200"
              style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
            >
              <DbFamilyTreeNode
                member={rootMember}
                allMembers={members}
                allRelationships={allRels}
                onSelectMember={handleSelectMember}
              />
            </div>
          )}
        </section>

        <section className="py-8 border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Legend</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Male</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Female</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-accent/50" />
                <span className="text-sm text-muted-foreground">Marriage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-6 bg-border" />
                <span className="text-sm text-muted-foreground">Parent-Child</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <MemberDetailDialog
        open={!!detailMember}
        onOpenChange={open => { if (!open) setDetailMember(null); }}
        member={detailMember}
        photos={detailPhotos}
        allMembers={members}
        canEdit={canEdit}
      />
    </div>
  );
};

export default FamilyTree;
