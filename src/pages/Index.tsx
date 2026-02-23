import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProfileForm } from "@/components/landing/ProfileForm";
import { analyzeGitHubProfile } from "@/lib/github-api";
import { AnalysisInput, ProfileAnalysis } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (input: AnalysisInput) => {
    setIsLoading(true);
    try {
      // Fetch GitHub data
      toast.info("Fetching GitHub data...");
      const githubData = await analyzeGitHubProfile(input.githubUsername);
      
      // Call AI for analysis
      toast.info("Running AI analysis...");
      const { data, error } = await supabase.functions.invoke("analyze-profile", {
        body: { github: githubData },
      });

      if (error) throw error;

      const analysis: ProfileAnalysis = {
        github: githubData,
        recommendations: data.recommendations,
        roadmap: data.roadmap,
        careerPredictions: data.careerPredictions,
        overallStrengths: githubData.strengths,
        overallWeaknesses: githubData.weaknesses,
        generatedAt: new Date().toISOString(),
      };

      // Store in session and navigate
      sessionStorage.setItem("profileAnalysis", JSON.stringify(analysis));
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <HeroSection onGetStarted={scrollToForm} />
      <div ref={formRef}>
        <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
};

export default Index;
