import { GitHubUser, GitHubRepo, GitHubEvent, GitHubContributor, GitHubAnalysis } from "@/types/profile";

const GITHUB_API_BASE = "https://api.github.com";

async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    if (response.status === 403) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchGitHub<GitHubUser>(`/users/${username}`);
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await fetchGitHub<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
  return repos;
}

export async function fetchGitHubEvents(username: string): Promise<GitHubEvent[]> {
  try {
    return await fetchGitHub<GitHubEvent[]>(`/users/${username}/events?per_page=100`);
  } catch {
    return [];
  }
}

export async function fetchRepoContributors(owner: string, repo: string): Promise<GitHubContributor[]> {
  try {
    return await fetchGitHub<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=30`);
  } catch {
    return [];
  }
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    return await fetchGitHub<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
  } catch {
    return {};
  }
}

export async function fetchGitHubFollowers(username: string): Promise<GitHubUser[]> {
  try {
    return await fetchGitHub<GitHubUser[]>(`/users/${username}/followers?per_page=30`);
  } catch {
    return [];
  }
}

export async function analyzeGitHubProfile(username: string): Promise<GitHubAnalysis> {
  // Fetch all data in parallel
  const [user, repos, events, followers] = await Promise.all([
    fetchGitHubUser(username),
    fetchGitHubRepos(username),
    fetchGitHubEvents(username),
    fetchGitHubFollowers(username),
  ]);

  // Calculate language distribution from repos
  const languageBytes: Record<string, number> = {};
  
  // Fetch languages for top repos (limit to avoid rate limiting)
  const topRepos = repos.slice(0, 10);
  await Promise.all(
    topRepos.map(async (repo) => {
      const languages = await fetchRepoLanguages(user.login, repo.name);
      for (const [lang, bytes] of Object.entries(languages)) {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      }
    })
  );

  const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
  const languages = Object.entries(languageBytes)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 8);

  // Calculate contribution stats
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const activeRepos = repos.filter(
    (repo) => new Date(repo.pushed_at) > sixMonthsAgo
  ).length;
  
  const inactiveRepos = repos.filter(
    (repo) => new Date(repo.pushed_at) < oneYearAgo
  ).length;

  const recentEvents = events.filter(
    (event) => new Date(event.created_at) > sixMonthsAgo
  );

  // Calculate strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Analyze repositories
  if (repos.length > 20) {
    strengths.push("Prolific repository creator with diverse projects");
  } else if (repos.length < 5) {
    weaknesses.push("Limited public repository presence");
  }

  if (activeRepos > repos.length * 0.5) {
    strengths.push("Maintains active development on most repositories");
  } else if (activeRepos < repos.length * 0.2) {
    weaknesses.push("Many repositories appear abandoned or inactive");
  }

  // Analyze followers
  if (followers.length > 50) {
    strengths.push("Strong community following indicating influence");
  } else if (followers.length < 5) {
    weaknesses.push("Limited community visibility and followers");
  }

  // Analyze languages
  if (languages.length > 4) {
    strengths.push("Polyglot developer with diverse language skills");
  } else if (languages.length < 2) {
    weaknesses.push("Limited language diversity in public projects");
  }

  // Analyze stars
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  if (totalStars > 100) {
    strengths.push("Projects have gained community recognition (stars)");
  }

  // Analyze recent activity
  if (recentEvents.length > 50) {
    strengths.push("Highly active contributor with consistent engagement");
  } else if (recentEvents.length < 10) {
    weaknesses.push("Recent GitHub activity is low");
  }

  // Check for documentation
  const hasReadme = repos.some((repo) => repo.description && repo.description.length > 20);
  if (hasReadme) {
    strengths.push("Good project documentation practices");
  } else {
    weaknesses.push("Projects lack detailed descriptions");
  }

  return {
    user,
    repos,
    languages,
    contributionStats: {
      totalCommits: recentEvents.filter((e) => e.type === "PushEvent").length,
      recentActivity: recentEvents.length,
      activeRepos,
      inactiveRepos,
    },
    events,
    followers,
    strengths,
    weaknesses,
  };
}
