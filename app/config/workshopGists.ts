/**
 * Auto-generated from GitHub Gists
 * Generated on: 2025-06-29T07:06:36.671Z
 *
 * To add a new snippet:
 * 1. Create a gist with description format:
 *    [workshop] category:shell tags:bash,productivity - Your title here
 * 2. Run: npm run fetch-gists
 */

import { WorkshopItem } from './workshopConfig';

export const gistItems: (WorkshopItem & { gistUrl: string; gistId: string })[] = [
  {
    "id": "gist-87fc6542ad202b489e9b078bafa5e0fd",
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
    "content": "#!/bin/bash\n# Interactive Help System for Shell Configurations\n# Create a searchable, topic-based documentation system for your terminal\n\n# The help() function - add to ~/.zshrc or ~/.bashrc\nhelp() {\n    local help_file=\"$HOME/.zsh_help.md\"\n    \n    # Check if help file exists\n    if [[ ! -f \"$help_file\" ]]; then\n        echo \"Help file not found. Creating template at $help_file\"\n        create_help_template\n        return 1\n    fi\n    \n    # If no argument, show full help with glow (or fallback to less)\n    if [[ -z \"$1\" ]]; then\n        if command -v glow >/dev/null 2>&1; then\n            glow -p \"$help_file\"\n        elif command -v bat >/dev/null 2>&1; then\n            bat --style=plain --paging=always \"$help_file\"\n        else\n            less \"$help_file\"\n        fi\n    else\n        # Search for specific topic\n        local section\n        case \"$1\" in\n            nav|navigation) section=\"## 🧭 Navigation\" ;;\n            fzf|fuzzy) section=\"## 🔍 FZF\" ;;\n            git) section=\"## 🛠️ Git\" ;;\n            tools|cli) section=\"## 📁 File System Tools\" ;;\n            sql|db|database) section=\"## 📀 SQL and Database\" ;;\n            aws|cloud) section=\"## 🚀 AWS\" ;;\n            ai|llm) section=\"## 🤖 AI/LLM Tools\" ;;\n            network|ssh) section=\"## 🌐 Network\" ;;\n            *) section=\"## .*$1\" ;;  # Regex search for any section\n        esac\n        \n        # Use glow to render and less to search\n        if command -v glow >/dev/null 2>&1; then\n            glow \"$help_file\" | less -R +/\"$section\"\n        else\n            less +/\"$section\" \"$help_file\"\n        fi\n    fi\n}\n\n# Quick aliases for common help topics\nalias h='help'\nalias h-nav='help navigation'\nalias h-git='help git'\nalias h-fzf='help fzf'\nalias h-aws='help aws'\nalias h-ai='help ai'\n\n# Create a template help file\ncreate_help_template() {\n    cat << 'EOF' > \"$HOME/.zsh_help.md\"\n# 🚀 Shell Configuration Help\n\nQuick access: `help` or `h` | Search: `help <topic>` | Edit: `help-edit`\n\n## 📋 Table of Contents\n\n- [Navigation](#-navigation)\n- [FZF Commands](#-fzf)\n- [Git Integration](#-git-integration)\n- [File System Tools](#-file-system-tools)\n- [SQL and Database](#-sql-and-database)\n- [AWS Commands](#-aws)\n- [AI/LLM Tools](#-aillm-tools)\n- [Network & SSH](#-network--ssh)\n\n---\n\n## 🧭 Navigation\n\n### Directory Shortcuts\n- `..` - Go up one directory\n- `...` - Go up two directories\n- `....` - Go up three directories\n- `z <partial-name>` - Jump to frequently used directory\n- `d` - Show directory stack\n- `1-9` - Jump to directory in stack\n\n### File Operations\n- `ll` - Detailed list with icons\n- `la` - Show all files including hidden\n- `lt` - Tree view with icons\n- `lsg` - List with git status\n\n---\n\n## 🔍 FZF\n\n### Key Bindings\n- `Ctrl+R` - Search command history\n- `Ctrl+T` - Find files and insert path\n- `Alt+C` - Change to directory\n\n### Custom Functions\n- `fe` - Find and edit file\n- `fd` - Find and cd to directory\n- `fkill` - Find and kill process\n- `fbr` - Checkout git branch\n\n---\n\n## 🛠️ Git Integration\n\n### Quick Commands\n- `gs` - Git status\n- `gd` - Git diff\n- `gl` - Pretty git log\n- `gco` - Git checkout\n- `gcm` - Git commit with message\n- `gp` - Git push\n- `gpl` - Git pull\n\n### Advanced\n- `lg` - Launch lazygit\n- `ghpr` - Create PR to main branch\n- `gh dash` - GitHub dashboard\n\n---\n\n## 📁 File System Tools\n\n### Modern Replacements\n| Traditional | Modern | Description |\n|------------|---------|-------------|\n| `ls` | `eza` | File listing with icons |\n| `cat` | `bat` | Syntax highlighting |\n| `find` | `fd` | User-friendly find |\n| `grep` | `rg` | Ripgrep - faster search |\n| `top` | `btop` | Beautiful process monitor |\n| `df` | `duf` | Disk usage with clarity |\n| `du` | `dust` | Directory sizes visualized |\n\n---\n\n## 📀 SQL and Database\n\n### PostgreSQL\n- `pgcli` - Enhanced PostgreSQL client\n- `psql-local` - Connect to local database\n- `format-sql <file>` - Format SQL file\n\n### Universal SQL\n- `usql` - Connect to any database\n- Supports: PostgreSQL, MySQL, SQLite, etc.\n\n---\n\n## 🚀 AWS\n\n### EC2 Management\n- `ec2-list` - List all instances\n- `ec2-start <id>` - Start instance\n- `ec2-stop <id>` - Stop instance\n- `ec2-ssh <id>` - SSH to instance\n\n### Profiles\n- `aws-profile` - Switch AWS profile\n- `aws-whoami` - Current AWS identity\n\n---\n\n## 🤖 AI/LLM Tools\n\n### Command Line AI\n- `gm` - Google Gemini CLI\n- `gmc` - Continue Gemini conversation\n- `@` - Quick Ollama query\n- `??` - GitHub Copilot suggestion\n- `?!` - GitHub Copilot explanation\n\n---\n\n## 🌐 Network & SSH\n\n### SSH Shortcuts\n- `ssh-key-copy <host>` - Copy SSH key\n- `ssh-tunnel <port> <host>` - Create tunnel\n- `ports` - Show listening ports\n- `myip` - Show public IP\n\n### Tailscale\n- `ts-status` - Tailscale status\n- `ts-up` - Connect Tailscale\n- `ts-down` - Disconnect Tailscale\n\n---\n\n## ⚙️ Configuration\n\n### Reload & Edit\n- `reload` - Reload shell config\n- `zshconfig` - Edit ~/.zshrc\n- `aliasconfig` - Edit ~/.zsh_aliases\n- `help-edit` - Edit this help file\n\n### Performance\n- `zsh-stats` - Show zsh statistics\n- `timezsh` - Profile zsh startup time\n\n---\n\n## 🎯 Pro Tips\n\n1. **Use `take`** - Create and enter directory: `take new-project`\n2. **Glob Operators** - `**/*.js` finds all JS files recursively\n3. **Parameter Expansion** - `!!` last command, `!$` last argument\n4. **Background Jobs** - `&` to background, `jobs` to list, `fg` to foreground\n\n---\n\n*Generated: $(date)*\nEOF\n    echo \"Created help template at $HOME/.zsh_help.md\"\n}\n\n# Edit help file\nhelp-edit() {\n    ${EDITOR:-nano} \"$HOME/.zsh_help.md\"\n}\n\n# Search help for specific content\nhelp-search() {\n    if [[ -z \"$1\" ]]; then\n        echo \"Usage: help-search <term>\"\n        return 1\n    fi\n    \n    if command -v rg >/dev/null 2>&1; then\n        rg -i \"$1\" \"$HOME/.zsh_help.md\"\n    else\n        grep -i \"$1\" \"$HOME/.zsh_help.md\"\n    fi\n}\n\n# List all help topics\nhelp-topics() {\n    echo \"Available help topics:\"\n    grep \"^##\" \"$HOME/.zsh_help.md\" | sed 's/## /  /' | grep -v \"Table of Contents\"\n}",
    "date": new Date("2025-06-29T07:05:32.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/87fc6542ad202b489e9b078bafa5e0fd",
    "gistId": "87fc6542ad202b489e9b078bafa5e0fd",
    "filename": "shell-help-system.sh"
  },
  {
    "id": "gist-86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "title": "ZSH Configuration Patterns & Productivity Enhancements",
    "description": "A modular ZSH configuration script with essential options, path management, CLI tool replacements, productivity aliases, an interactive help system, and FZF productivity functions.",
    "category": "shell",
    "tags": [
      "zsh",
      "productivity",
      "shell-config"
    ],
    "language": "bash",
    "content": "#!/bin/zsh\n# Modern ZSH Configuration - Modular Architecture & Productivity Patterns\n# This is a condensed version focusing on patterns you can adopt\n\n#----------------------------------\n# 1. MODULAR ARCHITECTURE PATTERN\n#----------------------------------\n# Main ~/.zshrc loads configuration in specific order:\n# 1. Base settings (history, navigation, completion)\n# 2. PATH management (organized by category)\n# 3. External tool initialization\n# 4. Sourced files (aliases, improvements, secrets)\n# 5. Plugin loading (order matters - syntax highlighting last)\n\n# Example structure:\n# ~/.zshrc          - Main configuration\n# ~/.zsh_aliases    - Command aliases and functions\n# ~/.zsh_secrets    - API keys, tokens (gitignored)\n# ~/.zsh_help.md    - Comprehensive help documentation\n\n#----------------------------------\n# 2. ESSENTIAL ZSH OPTIONS\n#----------------------------------\n# History Configuration\nHISTSIZE=50000\nSAVEHIST=50000\nsetopt HIST_IGNORE_ALL_DUPS      # Remove older duplicate entries\nsetopt HIST_REDUCE_BLANKS        # Remove superfluous blanks\nsetopt SHARE_HISTORY             # Share history between sessions\nsetopt EXTENDED_HISTORY          # Record timestamps\n\n# Directory Navigation\nsetopt AUTO_CD                   # Type directory name to cd\nsetopt AUTO_PUSHD               # Make cd push old directory to stack\nsetopt PUSHD_IGNORE_DUPS        # Don't push duplicates\nDIRSTACKSIZE=8                  # Limit directory stack size\n\n# Completion Improvements\nsetopt MENU_COMPLETE            # Cycle through completions with tab\nsetopt COMPLETE_IN_WORD         # Complete from both ends of word\nzstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'  # Case-insensitive\nzstyle ':completion:*' menu select                    # Interactive menu\n\n#----------------------------------\n# 3. PATH MANAGEMENT BEST PRACTICES\n#----------------------------------\n# Set base PATH first\nexport PATH=\"/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin\"\n\n# Add paths by category (easier to maintain)\n# Package managers\nexport PATH=\"/opt/homebrew/bin:/opt/homebrew/sbin:$PATH\"\n\n# User binaries\nexport PATH=\"$HOME/.local/bin:$HOME/bin:$PATH\"\n\n# Development tools\nexport PATH=\"$HOME/.cargo/bin:$PATH\"\nexport PATH=\"$HOME/go/bin:$PATH\"\n\n# Remove duplicates from PATH\ntypeset -U PATH path\n\n#----------------------------------\n# 4. MODERN CLI TOOL REPLACEMENTS\n#----------------------------------\n# File system navigation with icons and git integration\nalias ls=\"eza --icons\"\nalias ll=\"eza -la --icons\"\nalias la=\"eza -a --icons\"\nalias lt=\"eza --tree --icons\"\nalias lsg=\"eza -la --git --icons\"\n\n# Better system monitoring\nalias top='btop'                # Beautiful TUI system monitor\nalias df='duf'                  # Modern disk usage viewer\nalias cat='bat'                 # Syntax highlighting, git integration\n\n# Ripgrep for fast searching\nalias rg='rg --smart-case'      # Smart case by default\nalias rgf='rg --files'          # List files\nalias rgi='rg --no-ignore'      # Include ignored files\nalias rgh='rg --hidden'         # Search hidden files\n\n# Database CLI improvements\nalias psql='pgcli'              # PostgreSQL with auto-completion\nalias sql='usql'                # Universal SQL client\n\n#----------------------------------\n# 5. PRODUCTIVITY ALIASES & FUNCTIONS\n#----------------------------------\n# Quick navigation\nalias ..='cd ..'\nalias ...='cd ../..'\nalias ....='cd ../../..'\n\n# Configuration shortcuts\nalias reload='source ~/.zshrc'\nalias zshconfig='${EDITOR:-nano} ~/.zshrc'\nalias aliasconfig='${EDITOR:-nano} ~/.zsh_aliases'\n\n# Git productivity\nalias git-hash=\"git log -1 --format=%h\"\nalias lg=\"lazygit\"              # Interactive Git UI\nalias ghpr=\"gh pr create --base main -f -a @me\"\n\n# SQL formatter function\nformat-sql() {\n    if [ -z \"$1\" ]; then\n        echo \"Usage: format-sql <file.sql>\"\n        return 1\n    fi\n    pg_format -s 2 \"$1\" > \"$1.formatted\" && mv \"$1.formatted\" \"$1\"\n    echo \"Formatted: $1\"\n}\n\n#----------------------------------\n# 6. INTERACTIVE HELP SYSTEM\n#----------------------------------\n# Create a comprehensive help system using markdown and glow\nhelp() {\n    if [ -z \"$1\" ]; then\n        # Show interactive help menu\n        echo \"Help topics: nav, fzf, git, tools, sql, aws\"\n        echo \"Usage: help <topic> or press Enter for full docs\"\n        read -r choice\n        \n        if [ -z \"$choice\" ]; then\n            glow -p ~/.zsh_help.md\n        else\n            help \"$choice\"\n        fi\n    else\n        # Jump to specific section\n        case \"$1\" in\n            nav) section=\"## 🧭 Navigation\" ;;\n            fzf) section=\"## 🔍 FZF\" ;;\n            git) section=\"## 🛠️ Git\" ;;\n            tools) section=\"## 📁 File System Tools\" ;;\n            sql) section=\"## 📀 SQL and Database\" ;;\n            aws) section=\"## 🚀 AWS EC2 Management\" ;;\n            *) section=\"## .*$1\" ;;\n        esac\n        glow ~/.zsh_help.md | less -R +/\"$section\"\n    fi\n}\n\n#----------------------------------\n# 7. FZF PRODUCTIVITY\n#----------------------------------\n# FZF provides these keybindings by default:\n# Ctrl+R - Fuzzy search command history\n# Ctrl+T - Fuzzy search files and insert path\n# Alt+C  - Fuzzy search and cd to directory\n\n# Custom FZF functions\n# Find and edit file\nfe() {\n    local file\n    file=$(fzf --preview 'bat --style=numbers --color=always {}')\n    [ -n \"$file\" ] && ${EDITOR:-vim} \"$file\"\n}\n\n# Find and cd to directory\nfd() {\n    local dir\n    dir=$(find ${1:-.} -type d 2> /dev/null | fzf +m)\n    [ -n \"$dir\" ] && cd \"$dir\"\n}",
    "date": new Date("2025-06-29T06:24:54.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "gistId": "86b5d3c5b5a6ec9283ae63bcdf555b4f",
    "filename": "zsh-config.sh"
  },
  {
    "id": "gist-d76b41f70c9f5dc10f50ea49a26051ad",
    "title": "JSON Formatting and Extraction",
    "description": "Aliases for formatting and extracting data from JSON using Python and jq, suitable for command-line usage.",
    "category": "shell",
    "tags": [
      "json",
      "cli",
      "formatting",
      "productivity"
    ],
    "language": "bash",
    "content": "# Using Python (almost always available)\nalias jsonpp='python -m json.tool'\n\n# Using jq (more powerful, needs installation)\n# brew install jq\nalias json='jq .'\n\n# Pretty print with colors\nalias jsonc='jq . -C'\n\n# Usage examples:\n# curl api.example.com/data | jsonpp\n# cat data.json | json\n# echo '{\"name\":\"test\"}' | jsonc\n\n# Extract specific fields with jq\n# cat data.json | jq '.users[].name'\n# curl api.example.com | jq '.data.items[] | {id, name}'",
    "date": new Date("2025-06-29T05:18:35.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/d76b41f70c9f5dc10f50ea49a26051ad",
    "gistId": "d76b41f70c9f5dc10f50ea49a26051ad",
    "filename": "json-helpers.sh"
  },
  {
    "id": "gist-b564a2a9498eea12df0fad5fd1aea19f",
    "title": "Python Virtual Environment Helpers",
    "description": "Functions to create, activate, upgrade, deactivate, and remove Python virtual environments.",
    "category": "python",
    "tags": [
      "python",
      "virtualenv",
      "productivity",
      "bash"
    ],
    "language": "bash",
    "content": "# Add to ~/.bashrc or ~/.zshrc\n\n# Create and activate a Python virtual environment\nvenv() {\n    local env_name=\"${1:-venv}\"\n    \n    if [ -d \"$env_name\" ]; then\n        echo \"Activating existing environment: $env_name\"\n        source \"$env_name/bin/activate\"\n    else\n        echo \"Creating new environment: $env_name\"\n        python3 -m venv \"$env_name\"\n        source \"$env_name/bin/activate\"\n        pip install --upgrade pip\n    fi\n}\n\n# Deactivate and remove virtual environment\nvenv-remove() {\n    local env_name=\"${1:-venv}\"\n    \n    if [ -n \"$VIRTUAL_ENV\" ]; then\n        deactivate\n    fi\n    \n    if [ -d \"$env_name\" ]; then\n        rm -rf \"$env_name\"\n        echo \"Removed environment: $env_name\"\n    else\n        echo \"Environment not found: $env_name\"\n    fi\n}",
    "date": new Date("2025-06-29T05:18:34.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/b564a2a9498eea12df0fad5fd1aea19f",
    "gistId": "b564a2a9498eea12df0fad5fd1aea19f",
    "filename": "venv-helpers.sh"
  },
  {
    "id": "gist-0a09d84947062d7928bb726d07329a59",
    "title": "Useful Git Aliases",
    "description": "Defines helpful Git aliases for cleaning up branches, viewing recent branches, interactive rebasing, pretty logging, undoing commits, amending commits, and listing aliases.",
    "category": "git",
    "tags": [
      "git",
      "bash",
      "productivity",
      "version-control"
    ],
    "language": "git config",
    "content": "# Add to ~/.gitconfig\n[alias]\n    # Delete merged branches\n    cleanup = \"!git branch --merged | grep -v '\\*' | xargs -n 1 git branch -d\"\n    \n    # Show branches by last commit date\n    recent = \"!git for-each-ref --sort='-committerdate' --format='%(refname:short)' refs/heads | head -20\"\n    \n    # Interactive rebase for last n commits\n    fixup = \"!f() { git rebase -i HEAD~$1; }; f\"\n    \n    # Show a pretty log\n    lg = \"log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit\"\n    \n    # Undo last commit but keep changes\n    undo = \"reset HEAD~1 --soft\"\n    \n    # Amend last commit without editing message\n    amend = \"commit --amend --no-edit\"\n    \n    # List aliases\n    aliases = \"config --get-regexp alias\"",
    "date": new Date("2025-06-29T05:18:33.000Z"),
    "gistUrl": "https://gist.github.com/EconoBen/0a09d84947062d7928bb726d07329a59",
    "gistId": "0a09d84947062d7928bb726d07329a59",
    "filename": "git-aliases.gitconfig"
  }
];

export const gistCategories = [
  {
    "id": "shell",
    "label": "Shell",
    "icon": "🐚"
  },
  {
    "id": "python",
    "label": "Python",
    "icon": "🐍"
  },
  {
    "id": "git",
    "label": "Git",
    "icon": "📦"
  }
];
