import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAnalysis } from "@/types/profile";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { GitHubAnalysisSection } from "@/components/dashboard/GitHubAnalysisSection";
import { StrengthsWeaknesses } from "@/components/dashboard/StrengthsWeaknesses";
import { RecommendationsRoadmap } from "@/components/dashboard/RecommendationsRoadmap";
import { toast } from "sonner";
import { exportElementToPDFSimple } from "@/lib/pdf-export";

const Dashboard = () => {
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [exporting, setExporting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("profileAnalysis");
    if (stored) {
      setAnalysis(JSON.parse(stored));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const exportPDF = async () => {
    setExporting(true);
    toast.info("Generating PDF report...");
    try {
      const element = document.getElementById("report-content");
      if (!element) {
        toast.error("Report content not found");
        return;
      }

      const filename = `${analysis?.github?.user.login || "profile"}-analysis.pdf`;
      await exportElementToPDFSimple(element, filename);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-border/50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="font-display font-bold text-xl gradient-text">Profile Analysis</h1>
          <Button variant="hero" onClick={exportPDF} disabled={exporting} className="gap-2">
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main id="report-content" className="max-w-7xl mx-auto px-4 py-8 space-y-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <OverviewSection analysis={analysis} />
        </motion.div>

        {analysis.github && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <GitHubAnalysisSection github={analysis.github} />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <StrengthsWeaknesses analysis={analysis} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <RecommendationsRoadmap analysis={analysis} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
