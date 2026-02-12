import { useRef } from "react";
import { Printer, Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { familyMembers, getSpouse, getChildren, FamilyMember } from "@/data/familyData";
import { cn } from "@/lib/utils";

const PrintableTreeNode = ({ member, level = 0 }: { member: FamilyMember; level?: number }) => {
  const spouse = getSpouse(member.id);
  const children = getChildren(member.id);

  return (
    <div className="flex flex-col items-center">
      {/* Couple */}
      <div className="flex items-center gap-1">
        <div
          className={cn(
            "print-node border-2 rounded px-3 py-2 text-center min-w-[120px]",
            member.gender === "male"
              ? "border-primary/40 bg-primary/5"
              : "border-accent/40 bg-accent/5"
          )}
        >
          <p className="font-display text-sm font-semibold text-foreground leading-tight">{member.name}</p>
          {member.birthDate && (
            <p className="text-[10px] text-muted-foreground">b. {member.birthDate.split(" ").pop()}</p>
          )}
          {member.deathDate && (
            <p className="text-[10px] text-muted-foreground">d. {member.deathDate.split(" ").pop()}</p>
          )}
        </div>
        {spouse && (
          <>
            <div className="w-4 h-px bg-muted-foreground/40 print-line" />
            <div
              className={cn(
                "print-node border-2 rounded px-3 py-2 text-center min-w-[120px]",
                spouse.gender === "male"
                  ? "border-primary/40 bg-primary/5"
                  : "border-accent/40 bg-accent/5"
              )}
            >
              <p className="font-display text-sm font-semibold text-foreground leading-tight">{spouse.name}</p>
              {spouse.birthDate && (
                <p className="text-[10px] text-muted-foreground">b. {spouse.birthDate.split(" ").pop()}</p>
              )}
              {spouse.deathDate && (
                <p className="text-[10px] text-muted-foreground">d. {spouse.deathDate.split(" ").pop()}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Children */}
      {children.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          <div className="w-px h-4 bg-muted-foreground/30 print-line" />
          {children.length > 1 && (
            <div className="h-px bg-muted-foreground/30 print-line" style={{ width: `${Math.max((children.length - 1) * 160, 80)}px` }} />
          )}
          <div className="flex gap-4 mt-0">
            {children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-px h-4 bg-muted-foreground/30 print-line" />
                <PrintableTreeNode member={child} level={level + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PrintableTree = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Find root ancestor (generation 0)
  const rootMembers = familyMembers.filter(
    (m) => m.generation === 0 && !m.spouseId
  );
  // Also get generation 0 members who are primary (not a spouse of another gen-0)
  const gen0Primary = familyMembers.filter(
    (m) => m.generation === 0 && (!m.spouseId || !familyMembers.find(s => s.id === m.spouseId && s.generation === 0 && s.id < m.id))
  );
  // Use the main subject's paternal line root
  const rootMember = familyMembers.find((m) => m.id === 74) || familyMembers.find((m) => m.id === 12)!;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Controls - hidden in print */}
        <div className="print:hidden container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/tree">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back to Tree
                </Button>
              </Link>
              <h1 className="font-display text-2xl font-bold text-foreground">Printable Family Tree</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use your browser's print dialog to save as PDF or send to a printer. Tip: Select "Landscape" orientation for best results.
          </p>
        </div>

        {/* Printable Area */}
        <div ref={printRef} className="print-area px-4 pb-12">
          {/* Print Header */}
          <div className="text-center mb-8 pt-4">
            <h1 className="font-display text-3xl font-bold text-foreground">Chapaneri Family Tree</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generated on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <div className="w-24 h-px bg-primary/30 mx-auto mt-3" />
          </div>

          {/* Tree */}
          <div className="overflow-x-auto">
            <div className="min-w-max flex justify-center">
              <PrintableTreeNode member={rootMember} />
            </div>
          </div>

          {/* Print Footer */}
          <div className="mt-12 pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground">
              Chapaneri Family Heritage • {familyMembers.length} Members • chapaneri.lovable.app
            </p>
          </div>
        </div>
      </main>

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
};

export default PrintableTree;
