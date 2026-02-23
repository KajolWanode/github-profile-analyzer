import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Github, 
  Code2, 
  GitFork, 
  Star, 
  Clock,
  ExternalLink,
  Users,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { GitHubAnalysis } from "@/types/profile";
import RepoContributorsSection from "@/components/dashboard/RepoContributorsSection";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LanguagePieChart from "@/components/dashboard/LanguagePieChart";

interface GitHubAnalysisSectionProps {
  github: GitHubAnalysis;
}

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dart: "#00B4AB",
  Vue: "#41b883",
};

export function GitHubAnalysisSection({ github }: GitHubAnalysisSectionProps) {
  const [showAllRepos, setShowAllRepos] = useState(false);
  
  const activeRepos = github.repos.filter(repo => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return new Date(repo.pushed_at) > sixMonthsAgo;
  });

  const displayedRepos = showAllRepos ? github.repos.slice(0, 20) : github.repos.slice(0, 6);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-github flex items-center justify-center">
          <Github className="w-6 h-6 text-github-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold">GitHub Deep Analysis</h2>
          <p className="text-muted-foreground">Comprehensive analysis of your repositories and contributions</p>
        </div>
      </div>

      {/* Repository Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <TooltipProvider>
          {[
            { 
              label: "Total Repos", 
              value: github.repos.length,
              tooltip: "Total number of public repositories you own",
              color: "text-primary",
              bg: "bg-primary/10"
            },
            { 
              label: "Active Repos", 
              value: activeRepos.length,
              tooltip: "Repositories with activity in the last 6 months",
              color: "text-success",
              bg: "bg-success/10"
            },
            { 
              label: "Forked Repos", 
              value: github.repos.filter(r => r.fork).length,
              tooltip: "Repositories forked from other projects",
              color: "text-accent",
              bg: "bg-accent/10"
            },
            { 
              label: "Archived", 
              value: github.repos.filter(r => r.archived).length,
              tooltip: "Archived or deprecated repositories",
              color: "text-muted-foreground",
              bg: "bg-muted"
            },
          ].map((stat, index) => (
            <Tooltip key={stat.label}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="metric-card cursor-help"
                >
                  <span className={`metric-value ${stat.color}`}>{stat.value}</span>
                  <span className="metric-label">{stat.label}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background">
                <p className="max-w-xs">{stat.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Language Distribution (with Pie Chart) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6"
      >
        <h3 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          Programming Languages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Pie Chart Component (fetches /languages.json if no prop) */}
          <LanguagePieChart data={github.languages} />

          {/* Language list (keeps existing UI) */}
          <div className="space-y-4">
            {github.languages.slice(0, 6).map((lang, index) => (
              <div key={lang.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: languageColors[lang.name] || "#6e7681" }}
                    />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: languageColors[lang.name] || "#6e7681" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Repository List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h3 className="font-display font-semibold text-lg flex items-center gap-2">
          <GitFork className="w-5 h-5 text-accent" />
          Your Repositories
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {displayedRepos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="premium-card p-5 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <a 
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2 group-hover:gap-3"
                  >
                    <span className="truncate">{repo.name}</span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                  {repo.fork && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded ml-2">
                      Fork
                    </span>
                  )}
                </div>
              </div>
              
              {repo.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {repo.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {repo.language && (
                  <span className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: languageColors[repo.language] || "#6e7681" }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {repo.forks_count}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeAgo(repo.pushed_at)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {github.repos.length > 6 && (
          <button
            onClick={() => setShowAllRepos(!showAllRepos)}
            className="flex items-center gap-2 mx-auto text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {showAllRepos ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More ({github.repos.length - 6} more) <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </motion.div>

      {/* Repo contributors (new) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        <RepoContributorsSection username={github.user.login} />
      </motion.div>

      {/* Followers Section */}
      {github.followers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-success" />
            Community Following
            <span className="text-sm font-normal text-muted-foreground">
              ({github.user.followers} followers)
            </span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {github.followers.slice(0, 12).map((follower) => (
              <a
                key={follower.id}
                href={`https://github.com/${follower.login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary hover:bg-muted transition-colors group"
              >
                <img
                  src={follower.avatar_url}
                  alt={follower.login}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {follower.login}
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
            {github.user.followers > 12 && (
              <span className="flex items-center px-3 py-2 text-sm text-muted-foreground">
                +{github.user.followers - 12} more
              </span>
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
