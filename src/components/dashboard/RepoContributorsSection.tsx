import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Calendar, GitFork } from "lucide-react";

interface RepoInfo {
  id: number;
  name: string;
  html_url: string;
  created_at: string;
  description: string | null;
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions?: number;
}

interface Props {
  username: string;
  maxRepos?: number; // how many repos to fetch/show
  contributorsPerRepo?: number; // how many contributors to fetch per repo
}

export default function RepoContributorsSection({ username, maxRepos = 8, contributorsPerRepo = 5 }: Props) {
  const [repos, setRepos] = useState<RepoInfo[] | null>(null);
  const [contributors, setContributors] = useState<Record<string, Contributor[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const token = sessionStorage.getItem("githubToken") || undefined;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
        if (token) headers["Authorization"] = `token ${token}`;

        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=${maxRepos}&sort=updated`, { headers });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch repos: ${res.status} ${txt}`);
        }
        const json = await res.json();
        if (!mounted) return;
        const mapped: RepoInfo[] = json.map((r: any) => ({
          id: r.id,
          name: r.name,
          html_url: r.html_url,
          created_at: r.created_at,
          description: r.description,
        }));
        setRepos(mapped);

        // fetch contributors for each repo (limited)
        const contribs: Record<string, Contributor[]> = {};
        await Promise.all(
          mapped.map(async (repo) => {
            try {
              const cRes = await fetch(
                `https://api.github.com/repos/${username}/${repo.name}/contributors?per_page=${contributorsPerRepo}`,
                { headers }
              );
              if (!cRes.ok) return;
              const cJson = await cRes.json();
              contribs[repo.name] = cJson.map((c: any) => ({
                id: c.id,
                login: c.login,
                avatar_url: c.avatar_url,
                html_url: c.html_url,
                contributions: c.contributions,
              }));
            } catch (e) {
              // ignore per-repo contributor errors
            }
          })
        );
        if (!mounted) return;
        setContributors(contribs);
      } catch (e: any) {
        if (!mounted) return;
        setError(e.message || "Failed to load repos");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [username, maxRepos, contributorsPerRepo]);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card p-6">
        <div className="text-muted-foreground">Loading repositories...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card p-6">
        <div className="text-destructive">{error}</div>
      </motion.div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="premium-card p-6">
        <div className="text-muted-foreground">No repositories found for {username}.</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
      <div className="flex items-center gap-2">
        <GitFork className="w-5 h-5 text-accent" />
        <h3 className="font-display font-semibold text-lg">Repository Contributors</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {repos.map((repo) => (
          <motion.div key={repo.id} className="premium-card p-4">
            <div className="flex items-start justify-between mb-2">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-primary">
                {repo.name}
              </a>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(repo.created_at).toLocaleDateString()}
              </div>
            </div>

            {repo.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{repo.description}</p>}

            <div className="flex items-center gap-2 flex-wrap">
              {(contributors[repo.name] || []).map((c) => (
                <a key={c.id} href={c.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-2 py-1 rounded-lg bg-secondary hover:bg-muted transition-colors group">
                  <img src={c.avatar_url} alt={c.login} className="w-6 h-6 rounded-full" />
                  <span className="text-sm font-medium group-hover:text-primary">{c.login}</span>
                </a>
              ))}
              {(contributors[repo.name] || []).length === 0 && (
                <span className="text-sm text-muted-foreground">No contributors found</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
