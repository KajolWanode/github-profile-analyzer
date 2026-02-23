import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalysisInput } from "@/types/profile";

interface ProfileFormProps {
  onSubmit: (data: AnalysisInput) => void;
  isLoading: boolean;
}

export function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [githubUsername, setGithubUsername] = useState("");
  const [errors, setErrors] = useState<{ github?: string }>({});

  const validateForm = () => {
    const newErrors: { github?: string } = {};

    if (!githubUsername.trim()) {
      newErrors.github = "GitHub username is required";
    } else if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(githubUsername)) {
      newErrors.github = "Invalid GitHub username format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ githubUsername: githubUsername.trim() });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      id="analyze-form"
      className="py-20 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Start Your Analysis
            </h2>
            <p className="text-muted-foreground text-lg">
              Enter your profile details to get comprehensive insights
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GitHub Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Github className="w-4 h-4" />
                GitHub Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  github.com/
                </span>
                <Input
                  type="text"
                  placeholder="username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className={`pl-28 h-12 text-base rounded-xl border-2 transition-all ${
                    errors.github 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border focus:border-primary"
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.github && (
                <p className="text-sm text-destructive">{errors.github}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full mt-8"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Your Profiles...
                </>
              ) : (
                <>
                  Generate Analysis Report
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Your data is analyzed securely. We only access public profile information.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
