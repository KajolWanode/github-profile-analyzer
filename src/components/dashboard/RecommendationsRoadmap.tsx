import { motion } from "framer-motion";
import { Lightbulb, ArrowRight, Briefcase, Target, Map } from "lucide-react";
import { ProfileAnalysis } from "@/types/profile";

interface RecommendationsRoadmapProps {
  analysis: ProfileAnalysis;
}

export function RecommendationsRoadmap({ analysis }: RecommendationsRoadmapProps) {
  const priorityColors = {
    high: "bg-destructive/10 text-destructive border-destructive/20",
    medium: "bg-warning/10 text-warning border-warning/20",
    low: "bg-success/10 text-success border-success/20",
  };

  return (
    <section className="space-y-12">
      {/* Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-display font-bold">AI Recommendations</h2>
        </div>
        <div className="grid gap-4">
          {analysis.recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-5"
            >
              <div className="flex items-start gap-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold border ${priorityColors[rec.priority]}`}>
                  {rec.priority.toUpperCase()}
                </span>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-display font-bold">Improvement Roadmap</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {analysis.roadmap.map((phase) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-6"
            >
              <h3 className="font-display font-bold text-lg mb-4 text-primary">
                {phase.phase === '7-day' ? '🚀 Week 1' : phase.phase === '30-day' ? '📈 Month 1' : '🎯 Quarter 1'}
              </h3>
              <ul className="space-y-4">
                {phase.items.map((item, i) => (
                  <li key={i} className="space-y-1">
                    <p className="font-medium text-sm">{item.task}</p>
                    <p className="text-xs text-muted-foreground">{item.expectedOutcome}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Career Predictions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-success" />
          <h2 className="text-2xl font-display font-bold">Career Predictions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {analysis.careerPredictions.map((career, index) => (
            <motion.div
              key={career.role}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="premium-card p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display font-bold text-lg">{career.role}</h4>
                <span className="text-sm font-semibold text-success">{career.confidence}% match</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{career.reasoning}</p>
              <div className="flex flex-wrap gap-2">
                {career.skillsNeeded.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
