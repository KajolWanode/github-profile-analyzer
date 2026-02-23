import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { ProfileAnalysis } from "@/types/profile";

interface StrengthsWeaknessesProps {
  analysis: ProfileAnalysis;
}

export function StrengthsWeaknesses({ analysis }: StrengthsWeaknessesProps) {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-display font-bold">Strengths & Weaknesses</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-card p-6 border-l-4 border-success"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Key Strengths
          </h3>
          <ul className="space-y-3">
            {analysis.overallStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="premium-card p-6 border-l-4 border-warning"
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-warning" />
            Areas to Improve
          </h3>
          <ul className="space-y-3">
            {analysis.overallWeaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <span className="text-sm">{w}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
