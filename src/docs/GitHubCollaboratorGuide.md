# GitHub Collaborator Guide

Follow these step-by-step instructions to make a collaborator work directly inside your repository (no changes to your app required). Execute only what you need; this is a guidance document only.

1. Invite the collaborator to your repository: open your repo on GitHub → `Settings` → `Manage access` → `Invite a collaborator`. Enter their GitHub username and send the invite. The collaborator must accept the invite before they appear in your repo's access list and can push or create branches.

2. Choose the correct permission level when inviting: `Write` lets them push branches and open PRs; `Maintain` grants extra repo management ability without full admin; `Admin` gives full control and should only be used for trusted owners. Do not grant `Admin` unless necessary.

3. For organization-owned repositories, add collaborators via Teams or Organization People: prefer adding them to a Team (Organization → Teams → add user) and give the Team repo access. Teams scale better for multiple collaborators and make permission changes easier.

4. Protect your `main` (or default) branch: Settings → Branches → Add branch protection rule for `main`. Recommended protections: enable `Require pull request reviews before merging`, `Require status checks to pass`, and `Include administrators` if you want the rule to apply universally. If you want certain users to be able to push directly to `main`, use `Restrict who can push` and add those specific users or teams.

5. Recommended workflow (safe and collaborative): Give collaborators `Write` access so they can push feature branches to your repo, but keep `main` protected and require PR reviews. This lets collaborators work directly in your repo (create branches, push code) while preventing direct merges into `main` without review.

6. If you need contributors to appear in your app's “Collaborations/Your Repositories” listing, ensure your app reads GitHub's official endpoints (no app change needed if it already does): `GET /repos/{owner}/{repo}/collaborators` lists collaborators; to show user repo membership, use `GET /user/repos` (authenticated) or `GET /users/{username}/repos` for public repos. Once a user accepts the invite, GitHub’s data will reflect their collaborator status.

7. If a collaborator currently works in a fork or separate repo and you want them to move into direct collaboration, have them accept your invite and then push their branch to your repo:

   - Locally, they can add your repo as a remote and push:

     ```bash
     git remote add upstream git@github.com:YOUR_USERNAME/YOUR_REPO.git
     git push upstream feature-branch
     ```

   - Then they open a PR in your repo from `feature-branch` to `main` (or the target branch).

8. Rate limits & tokens: client-side requests to the GitHub API are rate-limited (60 requests/hour unauthenticated). For heavier use, generate a Personal Access Token (PAT) and use it server-side. For quick testing you may temporarily store a PAT in `sessionStorage` (e.g., `sessionStorage.setItem('githubToken', 'ghp_xxx')`) but do NOT store secrets in client-side code for production.

9. Verify collaborator access (quick checks): after invite acceptance, verify they are listed at `Settings` → `Manage access`. Ask them to create a branch and push — you should see their branch in the repo activity. If they cannot push, check branch protection rules and the `Restrict who can push` list.

10. Security & process best practices: do NOT grant `Admin` unless required; use `CODEOWNERS` to require reviews for critical areas; require CI status checks before merge; use Teams for group permission management; and prefer making the repo private and disabling forks (organization setting) if you absolutely must prevent external forks.

11. Small `CODEOWNERS` example to enforce reviewers for core folders (add to `.github/CODEOWNERS`):

```
# Require review from @your-org/core-team for src/critical/**
src/critical/ @your-org/core-team
*.md @your-username
```

12. Minimal `CONTRIBUTING.md` starter (place at repo root to document workflow):

```
# Contributing

1. Accept the repository invite.
2. Create a local branch from `main`: `git checkout -b feature/your-feature`.
3. Push the branch to this repo: `git push origin feature/your-feature`.
4. Open a Pull Request against `main` and request reviewers.
5. After approval and passing CI checks, a maintainer will merge.
```

Follow these instructions to make collaborators work directly in your repository without changing the app. If you want, I can also add a ready-to-copy `CONTRIBUTING.md` and `.github/CODEOWNERS` file to the repo — tell me if you want me to create those files.
