(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[115],{1091:(e,i,t)=>{Promise.resolve().then(t.bind(t,2378))},2378:(e,i,t)=>{"use strict";t.r(i),t.d(i,{default:()=>r});var a=t(5155),s=t(2115),l=t(6874),n=t.n(l);let o=[{id:"all",name:"All Categories",icon:"\uD83D\uDCDA"},{id:"shell",name:"Shell & Terminal",icon:"\uD83D\uDCBB"},{id:"productivity",name:"Productivity",icon:"⚡"},{id:"automation",name:"Automation",icon:"\uD83E\uDD16"},{id:"development",name:"Development Tools",icon:"\uD83D\uDEE0️"},{id:"ai",name:"AI & LLM",icon:"\uD83E\uDDE0"},{id:"data",name:"Data Processing",icon:"\uD83D\uDCCA"},{id:"other",name:"Other",icon:"\uD83D\uDCE6"}],c=[{id:"gist-87fc6542ad202b489e9b078bafa5e0fd",slug:"interactive-help-system-shell",title:"Interactive Help System for Shell Configurations",description:"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content.",category:"shell",tags:["documentation","help","productivity","shell"],language:"bash",content:`#!/bin/bash
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
alias h-ai='help ai'`,date:new Date("2025-06-29T07:05:32.000Z"),gistUrl:"https://gist.github.com/EconoBen/87fc6542ad202b489e9b078bafa5e0fd",gistId:"87fc6542ad202b489e9b078bafa5e0fd",filename:"shell-help-system.sh"},{id:"gist-86b5d3c5b5a6ec9283ae63bcdf555b4f",slug:"zsh-configuration-patterns",title:"ZSH Configuration Patterns & Productivity Enhancements",description:"A modular ZSH configuration script with essential options, path management, CLI tool replacements, productivity aliases, an interactive help system, and FZF productivity functions.",category:"shell",tags:["zsh","productivity","shell-config"],language:"bash",content:`#!/bin/zsh
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
# ~/.zsh_help.md    - Comprehensive help documentation`,date:new Date("2025-06-29T06:24:54.000Z"),gistUrl:"https://gist.github.com/EconoBen/86b5d3c5b5a6ec9283ae63bcdf555b4f",gistId:"86b5d3c5b5a6ec9283ae63bcdf555b4f",filename:"zsh-config.sh"}];function r(){let[e,i]=(0,s.useState)("all"),[t,l]=(0,s.useState)(""),[n,r]=(0,s.useState)("grid"),h=(0,s.useMemo)(()=>[...c].sort((e,i)=>{let t=e.date?new Date(e.date).getTime():0;return(i.date?new Date(i.date).getTime():0)-t}),[]),m=(0,s.useMemo)(()=>h.filter(i=>{let a="all"===e||i.category===e,s=""===t||i.title.toLowerCase().includes(t.toLowerCase())||i.description.toLowerCase().includes(t.toLowerCase())||i.tags.some(e=>e.toLowerCase().includes(t.toLowerCase()));return a&&s}),[h,e,t]),g=(0,s.useMemo)(()=>{let e={};return h.forEach(i=>{e[i.category]=(e[i.category]||0)+1}),o.map(i=>({...i,count:e[i.id]||0}))},[h]),p=h.length;return(0,a.jsxs)("div",{className:"code-ai-page",children:[(0,a.jsxs)("div",{className:"page-header",children:[(0,a.jsx)("h1",{className:"page-title",children:"Code & AI"}),(0,a.jsx)("p",{className:"page-subtitle",children:"Practical code snippets, ML/AI insights, and productivity tools"})]}),(0,a.jsxs)("div",{className:"code-ai-controls",children:[(0,a.jsxs)("div",{className:"code-ai-filters",children:[(0,a.jsxs)("button",{className:`filter-button ${"all"===e?"active":""}`,onClick:()=>i("all"),children:["All (",p,")"]}),g.map(t=>(0,a.jsxs)("button",{className:`filter-button ${e===t.id?"active":""}`,onClick:()=>i(t.id),children:[t.icon," ",t.name," (",t.count,")"]},t.id))]}),(0,a.jsxs)("div",{className:"code-ai-search-and-view",children:[(0,a.jsx)("input",{type:"text",placeholder:"Search snippets...",value:t,onChange:e=>l(e.target.value),className:"code-ai-search"}),(0,a.jsxs)("div",{className:"view-mode-toggle",children:[(0,a.jsx)("button",{className:`view-mode-button ${"grid"===n?"active":""}`,onClick:()=>r("grid"),title:"Grid view",children:(0,a.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[(0,a.jsx)("rect",{x:"1",y:"1",width:"6",height:"6"}),(0,a.jsx)("rect",{x:"9",y:"1",width:"6",height:"6"}),(0,a.jsx)("rect",{x:"1",y:"9",width:"6",height:"6"}),(0,a.jsx)("rect",{x:"9",y:"9",width:"6",height:"6"})]})}),(0,a.jsx)("button",{className:`view-mode-button ${"list"===n?"active":""}`,onClick:()=>r("list"),title:"List view",children:(0,a.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[(0,a.jsx)("rect",{x:"1",y:"2",width:"14",height:"2"}),(0,a.jsx)("rect",{x:"1",y:"7",width:"14",height:"2"}),(0,a.jsx)("rect",{x:"1",y:"12",width:"14",height:"2"})]})})]})]})]}),0===m.length?(0,a.jsx)("div",{className:"no-results",children:(0,a.jsx)("p",{children:"No snippets found matching your criteria."})}):(0,a.jsx)("div",{className:`code-ai-items ${n}`,children:m.map(e=>(0,a.jsx)(d,{item:e,viewMode:n},e.id))})]})}function d(e){let{item:i,viewMode:t}=e,s=o.find(e=>e.id===i.category);return(0,a.jsxs)("article",{className:`code-ai-card ${t}`,children:[(0,a.jsxs)("div",{className:"code-ai-card-header",children:[(0,a.jsxs)("div",{className:"code-ai-meta",children:[(0,a.jsxs)("span",{className:"code-ai-category",children:[s?.icon," ",s?.name||i.category]}),(0,a.jsx)("time",{className:"code-ai-date",children:i.date?new Date(i.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"No date"})]}),(0,a.jsx)("h3",{className:"code-ai-title",children:i.title})]}),(0,a.jsx)("p",{className:"code-ai-description",children:i.description}),(0,a.jsx)("div",{className:"code-ai-tags",children:i.tags.map(e=>(0,a.jsx)("span",{className:"code-ai-tag",children:e},e))}),(0,a.jsxs)("div",{className:"code-ai-footer",children:[i.gistUrl&&(0,a.jsx)("a",{href:i.gistUrl,target:"_blank",rel:"noopener noreferrer",className:"code-ai-link",children:"View on GitHub →"}),(0,a.jsx)(n(),{href:`/code-ai/${i.id}`,className:"code-ai-link primary",children:"View Details →"})]})]})}}},e=>{var i=i=>e(e.s=i);e.O(0,[874,441,684,358],()=>i(1091)),_N_E=e.O()}]);