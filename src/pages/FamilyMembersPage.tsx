import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Users, ChevronDown, Plus, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DbMemberCard } from "@/components/members/DbMemberCard";
import { MemberFormDialog } from "@/components/members/MemberFormDialog";
import { MemberDetailDialog } from "@/components/members/MemberDetailDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useFamilyMembers, DbFamilyMember, MemberFormData, MemberPhoto } from "@/hooks/useFamilyMembers";
import { useActivityLog } from "@/hooks/useActivityLog";

type GenerationFilter = "all" | number;

const generationLabels: Record<number, string> = {
  0: "Great-Grandparents",
  1: "Grandparents",
  2: "Parents & Aunts/Uncles",
  3: "Subject & Siblings",
  4: "Children & Nieces/Nephews",
};

const FamilyMembersPage = () => {
  const { user, canEdit } = useAuth();
  const { members, loading, addMember, updateMember, deleteMember, uploadPhoto, getMemberPhotos } = useFamilyMembers();
  const { logActivity } = useActivityLog();

  const [searchQuery, setSearchQuery] = useState("");
  const [generationFilter, setGenerationFilter] = useState<GenerationFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<DbFamilyMember | null>(null);
  const [detailMember, setDetailMember] = useState<DbFamilyMember | null>(null);
  const [detailPhotos, setDetailPhotos] = useState<MemberPhoto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [primaryPhotos, setPrimaryPhotos] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPhotos = async () => {
      const photoMap: Record<string, string> = {};
      for (const m of members) {
        const photos = await getMemberPhotos(m.id);
        const primary = photos.find(p => p.is_primary) || photos[0];
        if (primary) photoMap[m.id] = primary.photo_url;
      }
      setPrimaryPhotos(photoMap);
    };
    if (members.length > 0) loadPhotos();
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.birth_place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.relationship.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGeneration = generationFilter === "all" || member.generation === generationFilter;
      return matchesSearch && matchesGeneration;
    });
  }, [searchQuery, generationFilter, members]);

  const groupedByGeneration = useMemo(() => {
    const groups: Record<number, DbFamilyMember[]> = {};
    filteredMembers.forEach(member => {
      if (!groups[member.generation]) groups[member.generation] = [];
      groups[member.generation].push(member);
    });
    return groups;
  }, [filteredMembers]);

  const sortedGenerations = Object.keys(groupedByGeneration).map(Number).sort((a, b) => a - b);

  const handleSubmit = async (form: MemberFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    if (editingMember) {
      const success = await updateMember(editingMember.id, form);
      if (success) {
        // Compute changed fields
        const changes: Record<string, unknown> = {};
        (Object.keys(form) as (keyof MemberFormData)[]).forEach(key => {
          const oldVal = editingMember[key as keyof DbFamilyMember];
          const newVal = form[key];
          if (String(oldVal || "") !== String(newVal || "")) {
            changes[key] = { from: oldVal, to: newVal };
          }
        });
        await logActivity("update", editingMember.id, form.name, changes);
      }
    } else {
      const data = await addMember(form, user.id);
      if (data) {
        await logActivity("create", data.id, form.name);
      }
    }
    setIsSubmitting(false);
    setEditingMember(null);
  };

  const handleUploadPhotos = async (files: File[]) => {
    if (!user || !editingMember) return;
    for (const file of files) {
      await uploadPhoto(editingMember.id, file, user.id);
    }
  };

  const handleEdit = (member: DbFamilyMember) => {
    setEditingMember(member);
    setFormOpen(true);
  };

  const handleDelete = async (member: DbFamilyMember) => {
    const success = await deleteMember(member.id);
    if (success) {
      await logActivity("delete", member.id, member.name);
    }
  };

  const handleViewDetail = async (member: DbFamilyMember) => {
    setDetailMember(member);
    const photos = await getMemberPhotos(member.id);
    setDetailPhotos(photos);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
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
                Browse and search through {members.length} documented family members
              </p>
              {canEdit && (
                <Button className="mt-6 gap-2" size="lg" onClick={() => { setEditingMember(null); setFormOpen(true); }}>
                  <Plus className="w-5 h-5" /> Add Family Member
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, place, or relationship..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" /> Generation <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuCheckboxItem checked={generationFilter === "all"} onCheckedChange={() => setGenerationFilter("all")}>
                    All Generations
                  </DropdownMenuCheckboxItem>
                  {[0, 1, 2, 3, 4].map(gen => (
                    <DropdownMenuCheckboxItem key={gen} checked={generationFilter === gen} onCheckedChange={() => setGenerationFilter(gen)}>
                      {generationLabels[gen]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Showing {filteredMembers.length} of {members.length} members
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : sortedGenerations.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  {members.length === 0 ? "No members yet" : "No members found"}
                </h3>
                <p className="text-muted-foreground">
                  {members.length === 0 && canEdit
                    ? "Get started by adding your first family member"
                    : "Try adjusting your search or filters"}
                </p>
                {members.length === 0 && canEdit && (
                  <Button className="mt-4 gap-2" onClick={() => { setEditingMember(null); setFormOpen(true); }}>
                    <Plus className="w-4 h-4" /> Add First Member
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                {sortedGenerations.map(generation => (
                  <div key={generation}>
                    <h2 className="font-display text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">
                      {generationLabels[generation] || `Generation ${generation}`}
                      <span className="text-muted-foreground font-normal text-lg ml-3">
                        ({groupedByGeneration[generation].length})
                      </span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {groupedByGeneration[generation].map(member => (
                        <DbMemberCard
                          key={member.id}
                          member={member}
                          photoUrl={primaryPhotos[member.id]}
                          canEdit={canEdit}
                          onEdit={() => handleEdit(member)}
                          onDelete={() => handleDelete(member)}
                          onClick={() => handleViewDetail(member)}
                        />
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

      <MemberFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        member={editingMember}
        onSubmit={handleSubmit}
        onUploadPhotos={handleUploadPhotos}
        isSubmitting={isSubmitting}
      />

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

export default FamilyMembersPage;
