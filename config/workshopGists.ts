/**
 * Auto-generated from GitHub Gists
 * 
 * To add a new snippet:
 * 1. Create a gist with description format:
 *    [workshop] category:shell tags:bash,productivity - Your title here
 * 2. Run: npm run fetch-gists
 */

export interface WorkshopItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  language?: string;
  content: string;
  date?: Date;
  featured?: boolean;
  gistUrl?: string;
  gistId?: string;
  filename?: string;
}

export const gistCategories = [
  { id: 'all', name: 'All Categories', icon: '📚' },
  { id: 'shell', name: 'Shell & Terminal', icon: '💻' },
  { id: 'productivity', name: 'Productivity', icon: '⚡' },
  { id: 'automation', name: 'Automation', icon: '🤖' },
  { id: 'development', name: 'Development Tools', icon: '🛠️' },
  { id: 'ai', name: 'AI & LLM', icon: '🧠' },
  { id: 'data', name: 'Data Processing', icon: '📊' },
  { id: 'other', name: 'Other', icon: '📦' },
];

export const gistItems: WorkshopItem[] = [
  {
    "id": "gist-87fc6542ad202b489e9b078bafa5e0fd",
    "slug": "interactive-help-system-shell",
    "title": "Interactive Help System for Shell Configurations",
    "description": "A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content.",
    "category": "shell",
    "tags": [
      "documentation",
      "help",
      "productivity",
      "shell"
    ],
    "language": "bash",
    "content": `#!/bin/bash
# Interactive Help System for Shell Configurations
# Create a searchable, topic-based documentation system for your terminal

# The help() function - add to ~/.zshrc or ~/.bashrc
help() {
    local help_file="$HOME/.zsh_help.md"
    
    # Check if help file exists
    if [[ ! -f "$help_file" ]]; then
        echo "Help file not found. Creating template at $help_file"
        create_help_template
        return 1
    fi
    
    # If no argument, show full help with glow (or fallback to less)
    if [[ -z "$1" ]]; then
        if command -v glow >/dev/null 2>&1; then
            glow -p "$help_file"
        elif command -v bat >/dev/null 2>&1; then
            bat --style=plain --paging=always "$help_file"
        else
            less "$help_file"
        fi
    else
        # Search for specific topic
        local section
        case "$1" in
            nav|navigation) section="## 🧭 Navigation" ;;
            fzf|fuzzy) section="## 🔍 FZF" ;;
            git) section="## 🛠️ Git" ;;
            tools|cli) section="## 📁 File System Tools" ;;
            sql|db|database) section="## 📀 SQL and Database" ;;
            aws|cloud) section="## 🚀 AWS" ;;
            ai|llm) section="## 🤖 AI/LLM Tools" ;;
            network|ssh) section="## 🌐 Network" ;;
            *) section="## .*$1" ;;  # Regex search for any section
        esac
        
        # Use glow to render and less to search
        if command -v glow >/dev/null 2>&1; then
            glow "$help_file" | less -R +/"$section"
        else
            less +/"$section" "$help_file"
        fi
    fi
}

# Quick aliases for common help topics
alias h='help'
alias h-nav='help navigation'
alias h-git='help git'
alias h-fzf='help fzf'
alias h-aws='help aws'
alias h-ai='help ai'`,
    "date": new Date("2025-06-29T07:05:32.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/87fc6542ad202b489e9b078bafa5e0fd",
    "gistId": "87fc6542ad202b489e9b078bafa5e0fd",
    "filename": "shell-help-system.sh"
  },
  {
    "id": "gist-86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "slug": "zsh-configuration-patterns",
    "title": "ZSH Configuration Patterns & Productivity Enhancements",
    "description": "A modular ZSH configuration script with essential options, path management, CLI tool replacements, productivity aliases, an interactive help system, and FZF productivity functions.",
    "category": "shell",
    "tags": [
      "zsh",
      "productivity",
      "shell-config"
    ],
    "language": "bash",
    "content": `#!/bin/zsh
# Modern ZSH Configuration - Modular Architecture & Productivity Patterns
# This is a condensed version focusing on patterns you can adopt

#----------------------------------
# 1. MODULAR ARCHITECTURE PATTERN
#----------------------------------
# Main ~/.zshrc loads configuration in specific order:
# 1. Base settings (history, navigation, completion)
# 2. PATH management (organized by category)
# 3. External tool initialization
# 4. Sourced files (aliases, improvements, secrets)
# 5. Plugin loading (order matters - syntax highlighting last)

# Example structure:
# ~/.zshrc          - Main configuration
# ~/.zsh_aliases    - Command aliases and functions
# ~/.zsh_secrets    - API keys, tokens (gitignored)
# ~/.zsh_help.md    - Comprehensive help documentation`,
    "date": new Date("2025-06-29T06:24:54.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "gistId": "86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "filename": "zsh-config.sh"
  }
];