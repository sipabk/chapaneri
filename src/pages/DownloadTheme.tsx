import { useState } from "react";
import { Download, CheckCircle, FileCode, Loader2 } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const THEME_FILES = [
  "style.css",
  "functions.php",
  "header.php",
  "footer.php",
  "index.php",
  "front-page.php",
  "single-family_member.php",
  "archive-family_member.php",
  "page-family-tree.php",
  "page-timeline.php",
  "page-places.php",
  "page-search.php",
  "template-parts/member-gallery.php",
  "inc/class-widget-family-stats.php",
  "inc/class-widget-featured-members.php",
  "inc/class-widget-related-members.php",
  "inc/class-import-export.php",
  "inc/class-admin-dashboard-widget.php",
  "inc/shortcodes.php",
  "inc/blocks/family-member-block.php",
  "assets/js/navigation.js",
  "assets/js/theme-switcher.js",
  "assets/js/ajax-search.js",
  "assets/js/blocks.js",
  "assets/css/admin-import-export.css",
  "assets/css/blocks-editor.css",
  "README.md",
];

const DownloadTheme = () => {
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setDone(false);

    try {
      const zip = new JSZip();
      const themeFolder = zip.folder("chapaneri-heritage");

      const results = await Promise.all(
        THEME_FILES.map(async (filePath) => {
          try {
            const response = await fetch(`/wordpress-theme-export/${filePath}`);
            if (!response.ok) throw new Error(`Failed to fetch ${filePath}`);
            const content = await response.text();
            return { path: filePath, content };
          } catch (err) {
            console.warn(`Skipping ${filePath}:`, err);
            return null;
          }
        })
      );

      results.forEach((result) => {
        if (result && themeFolder) {
          themeFolder.file(result.path, result.content);
        }
      });

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "chapaneri-heritage-v2.0.zip");
      setDone(true);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <FileCode className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                Download WordPress Theme
              </h1>
              <p className="text-muted-foreground text-lg">
                Chapaneri Heritage v2.0 — Complete WordPress theme with 6 color
                themes, family tree, timeline, search, photo galleries, and more.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Included Files ({THEME_FILES.length})</h2>
              <div className="text-left text-sm text-muted-foreground max-h-48 overflow-y-auto space-y-1 mb-6 font-mono">
                {THEME_FILES.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-accent flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {downloading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Packaging ZIP...
                  </>
                ) : done ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Downloaded! Click to download again
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download ZIP
                  </>
                )}
              </button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Installation:</strong> Upload the ZIP to{" "}
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                  wp-content/themes/chapaneri-heritage/
                </code>
              </p>
              <p>Then activate through WordPress Admin → Appearance → Themes.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DownloadTheme;
