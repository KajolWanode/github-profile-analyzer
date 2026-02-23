import { motion } from "framer-motion";
import { ArrowRight, Github, Sparkles, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 via-purple-500/5 to-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Profile Analysis</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">Unlock Your</span>
          <br />
          <span className="gradient-text">Career Potential</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Get comprehensive AI analysis of your GitHub profile.
          <br className="hidden md:block" />
          Receive actionable insights, career recommendations, and a professional report.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button 
            variant="hero" 
            size="xl" 
            onClick={onGetStarted}
            className="group"
          >
            Start Free Analysis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="glass" size="xl">
            See Sample Report
          </Button>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          <div className="premium-card p-6 text-left hover-lift">
            <div className="w-12 h-12 rounded-xl bg-github/10 flex items-center justify-center mb-4">
              <Github className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">GitHub Analysis</h3>
            <p className="text-muted-foreground text-sm">
              Deep dive into your repositories, contributions, languages, and coding patterns.
            </p>
          </div>

          <div className="premium-card p-6 text-left hover-lift">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-lg mb-2">Career Roadmap</h3>
            <p className="text-muted-foreground text-sm">
              Personalized 7, 30, and 90-day action plans for career growth.
            </p>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-success" />
            <span className="text-sm">Real GitHub Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm">AI-Powered Insights</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-sm">Export to PDF</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
