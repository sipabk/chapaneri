import { useState } from "react";
import { Link } from "react-router-dom";
import { TreeDeciduous, ZoomIn, ZoomOut, Maximize2, Printer } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FamilyTreeNode } from "@/components/tree/FamilyTreeNode";
import { Button } from "@/components/ui/button";
import { getMemberById } from "@/data/familyData";

const FamilyTree = () => {
  const [zoom, setZoom] = useState(1);
  
  // Start with the main subject - Jitendra (id: 12)
  const rootMember = getMemberById(12);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));
  const handleReset = () => setZoom(1);

  if (!rootMember) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 md:pt-24 flex items-center justify-center">
          <p className="text-muted-foreground">Unable to load family tree</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24">
        {/* Page Header */}
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

        {/* Zoom Controls */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Centered on: <span className="font-medium text-foreground">{rootMember.name}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground w-16 text-center">
                {Math.round(zoom * 100)}%
              </span>
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

        {/* Tree View */}
        <section className="py-12 overflow-x-auto">
          <div 
            className="min-w-max flex justify-center px-8 pb-8 transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          >
            <FamilyTreeNode 
              member={rootMember}
              showSpouse={true}
              showChildren={true}
            />
          </div>
        </section>

        {/* Legend */}
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
    </div>
  );
};

export default FamilyTree;
