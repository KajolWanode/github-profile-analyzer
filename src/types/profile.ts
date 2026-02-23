export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  contributions: number;
  type: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: {
    id: number;
    name: string;
  };
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface GitHubAnalysis {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: { name: string; percentage: number; bytes: number }[];
  contributionStats: {
    totalCommits: number;
    recentActivity: number;
    activeRepos: number;
    inactiveRepos: number;
  };
  events: GitHubEvent[];
  followers: GitHubUser[];
  strengths: string[];
  weaknesses: string[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'github' | 'general';
  impact: string;
}

export interface RoadmapItem {
  phase: '7-day' | '30-day' | '90-day';
  items: {
    task: string;
    howTo: string;
    expectedOutcome: string;
  }[];
}

export interface CareerPrediction {
  role: string;
  confidence: number;
  reasoning: string;
  skillsNeeded: string[];
}

export interface ProfileAnalysis {
  github: GitHubAnalysis | null;
  recommendations: AIRecommendation[];
  roadmap: RoadmapItem[];
  careerPredictions: CareerPrediction[];
  overallStrengths: string[];
  overallWeaknesses: string[];
  generatedAt: string;
}

export interface AnalysisInput {
  githubUsername: string;
}
