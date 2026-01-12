/**
 * Code & Tools configuration containing code snippets, ML/AI insights, and productivity tools
 */

export interface WorkshopItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  language?: string;
  content: string;
  date: Date;
  featured?: boolean;
  gistUrl?: string;
  gistId?: string;
  filename?: string;
  /** Optional markdown writeup displayed above the code block */
  writeup?: string;
}

export const workshopConfig = {
  title: 'Code & Tools',
  subtitle: 'Code snippets, configurations, and developer tools I\'ve collected. Shell scripts, workflows, and practical solutions.',

  categories: [
    { id: 'all', label: 'All', icon: '🔧' },
    { id: 'tools', label: 'Tools', icon: '🛠️' },
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'git', label: 'Git', icon: '📦' },
    { id: 'shell', label: 'Shell', icon: '🐚' },
    { id: 'data-science', label: 'Data Science', icon: '📊' },
    { id: 'devops', label: 'DevOps', icon: '🚀' },
    { id: 'productivity', label: 'Productivity', icon: '⚡' },
  ],

  items: [
    {
      id: 'beads-spec-driven-dev',
      title: 'Spec-Driven Development with Beads',
      description: 'A lightweight, git-backed task tracking system that models dependencies and surfaces ready work. Perfect for agent-assisted development and TDD workflows.',
      category: 'tools',
      tags: ['beads', 'task-tracking', 'tdd', 'spec-driven', 'git', 'productivity', 'agents'],
      language: 'bash',
      date: new Date('2026-01-11'),
      featured: true,
      gistUrl: 'https://gist.github.com/EconoBen/c7d13109d1f7208c310abc8d647330d5',
      gistId: 'c7d13109d1f7208c310abc8d647330d5',
      filename: 'beads-spec-driven-dev.sh',
      writeup: `[Beads](https://github.com/steveyegge/beads) is a git-backed task tracker by Steve Yegge. Tasks are stored as JSONL in your repo, so state is versioned and available to AI assistants.

External trackers (GitHub Issues, Jira) require context switching and can't be read by local tools. Beads keeps task state in the repo, so you stay in your editor and AI assistants can query it directly.

The key command is \`bd ready\`, which returns unblocked tasks based on dependency modeling. For projects with 30+ tasks and complex dependencies, this removes the overhead of manually tracking what's actionable.

I use Beads for spec-driven development: \`tasks.md\` defines what to do, \`architecture.md\` captures design decisions, \`log.md\` tracks session history, and Beads tracks task status.`,
      content: `# Installation
brew install beads
bd init
echo ".beads/*.db" >> .gitignore

# Create tasks
bd create "T1: Project Structure" -t task -p 0 \\
  -l "project:myapp,phase:1,tdd" \\
  -d "Set up package structure" --json

bd create "T2: Core Client" -t task -p 1 \\
  -l "project:myapp,phase:1,tdd" \\
  -d "Implement client class" --json

# Model dependencies
bd dep add <T2-id> <T1-id> --type blocks

# Find ready work
bd ready
bd show <id>
bd dep tree <id>

# Claim and link to GitHub
bd update <id> --status in_progress
gh issue create --title "T1: Project Structure" \\
  --body "See tasks.md#T1" \\
  --label "project:myapp" --label "tdd"

# TDD loop
git switch -c feat/1-project-structure
uv run pytest -k test_project_structure -v
git add -A && git commit -m "feat: implement T1"
gh pr create --title "feat(1): Project Structure" --body "Closes #1"

# Close and sync
bd close <id> --reason implemented
bd sync -m "Close T1: Project Structure"
git pull
bd ready`
    },
    {
      id: 'beads-agent-workflow',
      title: 'Beads + AI Agents: Session Continuity',
      description: 'How to use Beads with AI coding agents (Claude, Cursor, etc.) for persistent task context across sessions.',
      category: 'tools',
      tags: ['beads', 'agents', 'claude', 'cursor', 'ai', 'workflow', 'context'],
      language: 'bash',
      date: new Date('2026-01-11'),
      featured: true,
      gistUrl: 'https://gist.github.com/EconoBen/25219aebb1f70382af2fc5d6fcc0b7e7',
      gistId: '25219aebb1f70382af2fc5d6fcc0b7e7',
      filename: 'beads-agent-workflow.sh',
      writeup: `AI assistants like Claude Code and Cursor lose context between sessions. You end up re-explaining what you were working on, what's blocked, and what's next.

This is what I add to my CLAUDE.md, AGENTS.md, and .cursorrules to leverage Beads while using my coding agent. It tells the agent what to run at session start, how to update task status during work, and how to sync state at session end.`,
      content: `# End of session
bd sync -m "End of session: T3 in progress, T4-T6 ready"

# Start of next session
bd ready
bd show <current-task-id>
bd dep tree <id>

# CLAUDE.md instructions (add to your project)
## Task Tracking with Beads

Before starting work:
  bd ready
  bd show <id>

While working:
  bd update <id> --status in_progress

After completing:
  bd close <id> --reason implemented
  bd sync -m "Completed: <task summary>"

If you discover new work:
  bd create "New task" -t task -p 2 --json
  bd dep add <new-id> <parent-id> --type discovered-from

# Session handoff
bd sync -m "Session end: $(date +%Y-%m-%d)"
git add -A && git commit -m "docs: update session log"
git push`
    }
  ] as WorkshopItem[]
};
