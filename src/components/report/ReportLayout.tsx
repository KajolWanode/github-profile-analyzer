import React, { useEffect, useState } from "react";
import { ProfileAnalysis } from "@/types/profile";
import LanguagePieChart from "@/components/dashboard/LanguagePieChart";

interface Props {
  analysis?: ProfileAnalysis | null;
  maxContributorsPerRepo?: number;
  className?: string;
}

interface ContributorShort {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export default function ReportLayout({ analysis = null, maxContributorsPerRepo = 5, className = "" }: Props) {
  const [data, setData] = useState<ProfileAnalysis | null>(analysis);
  const [repoContribs, setRepoContribs] = useState<Record<string, ContributorShort[]>>({});

  useEffect(() => {
    if (analysis) {
      setData(analysis);
    } else {
      const stored = sessionStorage.getItem("profileAnalysis");
      if (stored) setData(JSON.parse(stored));
    }
  }, [analysis]);

  useEffect(() => {
    let mounted = true;
    async function fetchContribs() {
      if (!data || !data.github) return;
      const token = sessionStorage.getItem("githubToken") || undefined;
      const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json" };
      if (token) headers["Authorization"] = `token ${token}`;

      const contribMap: Record<string, ContributorShort[]> = {};
      await Promise.all(
        data.github.repos.slice(0, 12).map(async (repo) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/${data.github.user.login}/${repo.name}/contributors?per_page=${maxContributorsPerRepo}`,
              { headers }
            );
            if (!res.ok) return;
            const json = await res.json();
            if (!mounted) return;
            contribMap[repo.name] = json.map((c: any) => ({ id: c.id, login: c.login, avatar_url: c.avatar_url, html_url: c.html_url }));
          } catch (e) {
            // ignore per-repo errors
          }
        })
      );
      if (mounted) setRepoContribs(contribMap);
    }
    fetchContribs();
    return () => { mounted = false; };
  }, [data, maxContributorsPerRepo]);

  if (!data || !data.github) {
    return (
      <div className={`bg-white p-6 ${className}`}>
        <div className="text-sm text-muted-foreground">No analysis data available to generate report.</div>
      </div>
    );
  }

  const user = data.github.user;

  return (
    <div className={`prose max-w-none bg-white text-foreground p-8 ${className}`} style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <header className="mb-6">
        <h1 className="text-4xl font-bold leading-tight">{user.name || user.login}</h1>
        <p className="text-sm text-muted-foreground mt-1">GitHub Account Analysis Report</p>
      </header>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
          <div>
            <div className="text-xs text-muted-foreground">Total Public Repositories</div>
            <div className="text-xl font-medium">{data.github.repos.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Followers</div>
            <div className="text-xl font-medium">{data.github.user.followers}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Active Repos (6mo)</div>
            <div className="text-xl font-medium">{data.contributionStats?.activeRepos ?? "N/A"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Total Commits (estimate)</div>
            <div className="text-xl font-medium">{data.contributionStats?.totalCommits ?? "N/A"}</div>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Language Usage</h2>
        <div className="mt-3 md:flex md:items-start md:gap-6">
          <div className="md:w-1/2 w-full">
            <LanguagePieChart data={data.github.languages} height={220} />
          </div>
          <div className="md:flex-1 mt-4 md:mt-0">
            <ul className="list-none">
              {data.github.languages.map((l) => (
                <li key={l.name} className="flex justify-between py-1 border-b border-border/50">
                  <span className="font-medium">{l.name}</span>
                  <span className="text-sm text-muted-foreground">{l.percentage}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Repositories (concise)</h2>
        <div className="mt-3 space-y-3">
          {data.github.repos.slice(0, 20).map((repo) => (
            <div key={repo.id} className="p-3 border border-border/50 rounded">
              <div className="flex items-center justify-between">
                <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-md font-medium text-primary">{repo.name}</a>
                <div className="text-sm text-muted-foreground">{new Date(repo.created_at).toLocaleDateString()}</div>
              </div>
              {repo.description && <div className="text-sm text-muted-foreground mt-2">{repo.description}</div>}
              <div className="mt-2 text-sm">
                Contributors: {repoContribs[repo.name] ? repoContribs[repo.name].map(c => c.login).join(", ") : "(not fetched or none)"}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">AI Recommendations & Roadmap (summary)</h2>
        <div className="mt-3 space-y-2">
          {data.recommendations.slice(0, 5).map((r) => (
            <div key={r.id} className="p-3 border border-border/50 rounded">
              <div className="font-medium">{r.title} <span className="text-xs text-muted-foreground">({r.priority})</span></div>
              <div className="text-sm text-muted-foreground mt-1">{r.description}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-xs text-muted-foreground mt-8">
        Report generated: {new Date().toLocaleString()} — Generated by Profile Analysis Tool
      </footer>
    </div>
  );
}
