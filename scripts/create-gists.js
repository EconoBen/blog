#!/usr/bin/env node

/**
 * Script to help create GitHub gists from workshop items
 * Generates curl commands to create gists via GitHub API
 */

const workshopItems = [
  {
    title: 'Pandas DataFrame Memory Optimization',
    category: 'data-science',
    tags: ['pandas', 'python', 'optimization', 'memory'],
    difficulty: 'intermediate',
    filename: 'optimize_df.py',
    content: `import numpy as np
import pandas as pd

def optimize_df(df):
    """
    Reduce memory usage by optimizing data types.
    
    Args:
        df: pandas DataFrame to optimize
        
    Returns:
        Optimized DataFrame with reduced memory footprint
    """
    start_mem = df.memory_usage().sum() / 1024**2
    
    for col in df.columns:
        col_type = df[col].dtype
        
        if col_type != 'object':
            c_min = df[col].min()
            c_max = df[col].max()
            
            if str(col_type)[:3] == 'int':
                if c_min > np.iinfo(np.int8).min and c_max < np.iinfo(np.int8).max:
                    df[col] = df[col].astype(np.int8)
                elif c_min > np.iinfo(np.int16).min and c_max < np.iinfo(np.int16).max:
                    df[col] = df[col].astype(np.int16)
                elif c_min > np.iinfo(np.int32).min and c_max < np.iinfo(np.int32).max:
                    df[col] = df[col].astype(np.int32)
            else:
                if c_min > np.finfo(np.float16).min and c_max < np.finfo(np.float16).max:
                    df[col] = df[col].astype(np.float16)
                elif c_min > np.finfo(np.float32).min and c_max < np.finfo(np.float32).max:
                    df[col] = df[col].astype(np.float32)
    
    end_mem = df.memory_usage().sum() / 1024**2
    print(f'Memory usage reduced from {start_mem:.2f} MB to {end_mem:.2f} MB ({100 * (start_mem - end_mem) / start_mem:.1f}% reduction)')
    
    return df`
  },
  {
    title: 'Git Cleanup Aliases',
    category: 'git',
    tags: ['git', 'bash', 'productivity', 'version-control'],
    difficulty: 'beginner',
    filename: 'git-aliases.gitconfig',
    content: `# Add to ~/.gitconfig
[alias]
    # Delete merged branches
    cleanup = "!git branch --merged | grep -v '\\*' | xargs -n 1 git branch -d"
    
    # Show branches by last commit date
    recent = "!git for-each-ref --sort='-committerdate' --format='%(refname:short)' refs/heads | head -20"
    
    # Interactive rebase for last n commits
    fixup = "!f() { git rebase -i HEAD~$1; }; f"
    
    # Show a pretty log
    lg = "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
    
    # Undo last commit but keep changes
    undo = "reset HEAD~1 --soft"
    
    # Amend last commit without editing message
    amend = "commit --amend --no-edit"
    
    # List aliases
    aliases = "config --get-regexp alias"`
  },
  {
    title: 'Python Virtual Environment Quick Setup',
    category: 'python',
    tags: ['python', 'virtualenv', 'productivity', 'bash'],
    difficulty: 'beginner',
    filename: 'venv-helpers.sh',
    content: `# Add to ~/.bashrc or ~/.zshrc

# Create and activate a Python virtual environment
venv() {
    local env_name="\${1:-venv}"
    
    if [ -d "$env_name" ]; then
        echo "Activating existing environment: $env_name"
        source "$env_name/bin/activate"
    else
        echo "Creating new environment: $env_name"
        python3 -m venv "$env_name"
        source "$env_name/bin/activate"
        pip install --upgrade pip
    fi
}

# Deactivate and remove virtual environment
venv-remove() {
    local env_name="\${1:-venv}"
    
    if [ -n "$VIRTUAL_ENV" ]; then
        deactivate
    fi
    
    if [ -d "$env_name" ]; then
        rm -rf "$env_name"
        echo "Removed environment: $env_name"
    else
        echo "Environment not found: $env_name"
    fi
}`
  },
  {
    title: 'Quick JSON Pretty Print',
    category: 'shell',
    tags: ['json', 'cli', 'formatting', 'productivity'],
    difficulty: 'beginner',
    filename: 'json-helpers.sh',
    content: `# Using Python (almost always available)
alias jsonpp='python -m json.tool'

# Using jq (more powerful, needs installation)
# brew install jq
alias json='jq .'

# Pretty print with colors
alias jsonc='jq . -C'

# Usage examples:
# curl api.example.com/data | jsonpp
# cat data.json | json
# echo '{"name":"test"}' | jsonc

# Extract specific fields with jq
# cat data.json | jq '.users[].name'
# curl api.example.com | jq '.data.items[] | {id, name}'`
  }
];

// Function to escape JSON for shell
function escapeForShell(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
}

// Generate the gist creation commands
console.log('# GitHub Gist Creation Commands');
console.log('# First, create a personal access token at: https://github.com/settings/tokens');
console.log('# The token needs the "gist" scope');
console.log('# Export your token: export GITHUB_TOKEN="your_token_here"');
console.log('');

workshopItems.forEach((item, index) => {
  const description = `[workshop] category:${item.category} tags:${item.tags.join(',')} difficulty:${item.difficulty} - ${item.title}`;
  
  const gistData = {
    description: description,
    public: true,
    files: {
      [item.filename]: {
        content: item.content
      }
    }
  };
  
  console.log(`# ${index + 1}. ${item.title}`);
  console.log(`curl -X POST -H "Authorization: token $GITHUB_TOKEN" \\`);
  console.log(`  -H "Accept: application/vnd.github.v3+json" \\`);
  console.log(`  https://api.github.com/gists \\`);
  console.log(`  -d '${JSON.stringify(gistData)}'`);
  console.log('');
});

console.log('# After creating gists, run: npm run fetch-gists');