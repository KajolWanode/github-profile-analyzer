import { motion } from "framer-motion";
import { 
  Github, 
  Users, 
  GitFork, 
  Star, 
  Code2,
  TrendingUp,
  Target
} from "lucide-react";
import { ProfileAnalysis } from "@/types/profile";

interface OverviewSectionProps {
  analysis: ProfileAnalysis;
}

export function OverviewSection({ analysis }: OverviewSectionProps) {
  const github = analysis.github;
  
  if (!github) return null;

  const totalStars = github.repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = github.repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const metrics = [
    {
      icon: Code2,
      label: "Repositories",
      value: github.user.public_repos,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Star,
      label: "Total Stars",
      value: totalStars,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: GitFork,
      label: "Total Forks",
      value: totalForks,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: Users,
      label: "Followers",
      value: github.user.followers,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-8"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <img
            src={github.user.avatar_url}
            alt={github.user.name || github.user.login}
            className="w-24 h-24 rounded-2xl ring-4 ring-primary/20 shadow-xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold">
                {github.user.name || github.user.login}
              </h1>
              <span className="px-3 py-1 rounded-full bg-github text-github-foreground text-xs font-semibold">
                @{github.user.login}
              </span>
            </div>
            {github.user.bio && (
              <p className="text-muted-foreground text-lg mb-3">{github.user.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {github.user.location && (
                <span className="flex items-center gap-1">📍 {github.user.location}</span>
              )}
              {github.user.company && (
                <span className="flex items-center gap-1">🏢 {github.user.company}</span>
              )}
              {github.user.blog && (
                <a 
                  href={github.user.blog.startsWith('http') ? github.user.blog : `https://${github.user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  🔗 Website
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`https://github.com/${github.user.login}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-github text-github-foreground text-sm font-medium hover:bg-github/90 transition-colors"
            >
              <Github className="w-4 h-4" />
              View Profile
            </a>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="metric-card"
          >
            <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <span className="metric-value">{metric.value.toLocaleString()}</span>
            <span className="metric-label">{metric.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold">Activity Status</h3>
              <p className="text-sm text-muted-foreground">Last 6 months</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Repositories</span>
              <span className="font-semibold text-success">{github.contributionStats.activeRepos}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Recent Activity Events</span>
              <span className="font-semibold">{github.contributionStats.recentActivity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Inactive Repositories</span>
              <span className="font-semibold text-muted-foreground">{github.contributionStats.inactiveRepos}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Profile Completeness</h3>
              <p className="text-sm text-muted-foreground">Key profile elements</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Profile Photo", complete: !!github.user.avatar_url },
              { label: "Bio", complete: !!github.user.bio },
              { label: "Location", complete: !!github.user.location },
              { label: "Website/Blog", complete: !!github.user.blog },
              { label: "Company", complete: !!github.user.company },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-medium ${item.complete ? 'text-success' : 'text-muted-foreground'}`}>
                  {item.complete ? '✓ Complete' : '○ Missing'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
