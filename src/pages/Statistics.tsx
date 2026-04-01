import { useEffect, useState, useRef, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFamilyMembers } from "@/hooks/useFamilyMembers";
import { useFamilyStatistics } from "@/hooks/useFamilyStatistics";
import { FamilyRelationship } from "@/hooks/useRelationships";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewTab } from "@/components/statistics/OverviewTab";
import { RelationshipsTab } from "@/components/statistics/RelationshipsTab";
import { PlacesTab } from "@/components/statistics/PlacesTab";
import { AgesTab } from "@/components/statistics/AgesTab";
import { BirthsTab } from "@/components/statistics/BirthsTab";
import { MarriagesTab } from "@/components/statistics/MarriagesTab";
import { ChildrenTab } from "@/components/statistics/ChildrenTab";
import { DivorcesTab } from "@/components/statistics/DivorcesTab";
import { useToast } from "@/hooks/use-toast";

const Statistics = () => {
  const { members, loading: membersLoading } = useFamilyMembers();
  const [relationships, setRelationships] = useState<FamilyRelationship[]>([]);
  const [relLoading, setRelLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!contentRef.current) return;
    setExporting(true);
    toast({ title: "Generating PDF...", description: "Please wait while we capture the charts." });

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdfWidth = 210; // A4 mm
      const pdfPageHeight = 297;
      const contentWidth = pdfWidth - 20; // 10mm margins
      const ratio = contentWidth / imgWidth;
      const scaledHeight = imgHeight * ratio;

      const pdf = new jsPDF("p", "mm", "a4");

      // Add title
      pdf.setFontSize(18);
      pdf.text("Chapaneri Family Statistics", 10, 15);
      pdf.setFontSize(10);
      pdf.setTextColor(128);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 10, 22);
      pdf.setTextColor(0);

      const startY = 28;
      let remainingHeight = scaledHeight;
      let srcY = 0;
      let page = 0;

      while (remainingHeight > 0) {
        const availableHeight = page === 0 ? pdfPageHeight - startY - 10 : pdfPageHeight - 20;
        const sliceHeight = Math.min(availableHeight, remainingHeight);
        const sliceSrcHeight = sliceHeight / ratio;

        // Create a slice canvas
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = imgWidth;
        sliceCanvas.height = sliceSrcHeight;
        const ctx = sliceCanvas.getContext("2d")!;
        ctx.drawImage(canvas, 0, srcY, imgWidth, sliceSrcHeight, 0, 0, imgWidth, sliceSrcHeight);

        const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
        const yPos = page === 0 ? startY : 10;
        pdf.addImage(sliceData, "JPEG", 10, yPos, contentWidth, sliceHeight);

        remainingHeight -= sliceHeight;
        srcY += sliceSrcHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          page++;
        }
      }

      pdf.save("chapaneri-family-statistics.pdf");
      toast({ title: "PDF exported successfully!" });
    } catch (err) {
      console.error("PDF export failed:", err);
      toast({ title: "Export failed", description: "Could not generate PDF. Try using Print instead.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }, [toast]);

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
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Family Statistics</h1>
              <p className="text-muted-foreground mt-2">Statistical insights about the Chapaneri family tree</p>
            </div>
            <div className="flex items-center gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button variant="default" size="sm" onClick={handleExportPDF} disabled={exporting} className="gap-2">
                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export PDF
              </Button>
            </div>
          </div>

          <div ref={contentRef}>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6 print:hidden">
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
