(()=>{var e={};e.id=115,e.ids=[115],e.modules={116:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>s});let s=(0,i(2907).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/blabaschin/Documents/GitHub/blog/app/code-ai/page.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/blabaschin/Documents/GitHub/blog/app/code-ai/page.tsx","default")},517:(e,t,i)=>{Promise.resolve().then(i.bind(i,116))},846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3669:(e,t,i)=>{Promise.resolve().then(i.bind(i,5243))},3873:e=>{"use strict";e.exports=require("path")},4675:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>o.a,__next_app__:()=>h,pages:()=>d,routeModule:()=>p,tree:()=>c});var s=i(5239),a=i(8088),n=i(8170),o=i.n(n),r=i(893),l={};for(let e in r)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>r[e]);i.d(t,l);let c={children:["",{children:["code-ai",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,116)),"/Users/blabaschin/Documents/GitHub/blog/app/code-ai/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,8014)),"/Users/blabaschin/Documents/GitHub/blog/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,7398,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(i.t.bind(i,9999,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(i.t.bind(i,5284,23)),"next/dist/client/components/unauthorized-error"]}]}.children,d=["/Users/blabaschin/Documents/GitHub/blog/app/code-ai/page.tsx"],h={require:i,loadChunk:()=>Promise.resolve()},p=new s.AppPageRouteModule({definition:{kind:a.RouteKind.APP_PAGE,page:"/code-ai/page",pathname:"/code-ai",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},5243:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>c});var s=i(687),a=i(3210),n=i(5814),o=i.n(n);let r=[{id:"all",name:"All Categories",icon:"\uD83D\uDCDA"},{id:"shell",name:"Shell & Terminal",icon:"\uD83D\uDCBB"},{id:"productivity",name:"Productivity",icon:"⚡"},{id:"automation",name:"Automation",icon:"\uD83E\uDD16"},{id:"development",name:"Development Tools",icon:"\uD83D\uDEE0️"},{id:"ai",name:"AI & LLM",icon:"\uD83E\uDDE0"},{id:"data",name:"Data Processing",icon:"\uD83D\uDCCA"},{id:"other",name:"Other",icon:"\uD83D\uDCE6"}],l=[{id:"gist-87fc6542ad202b489e9b078bafa5e0fd",slug:"interactive-help-system-shell",title:"Interactive Help System for Shell Configurations",description:"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content.",category:"shell",tags:["documentation","help","productivity","shell"],language:"bash",content:`#!/bin/bash
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
# ~/.zsh_help.md    - Comprehensive help documentation`,date:new Date("2025-06-29T06:24:54.000Z"),gistUrl:"https://gist.github.com/EconoBen/86b5d3c5b5a6ec9283ae63bcdf555b4f",gistId:"86b5d3c5b5a6ec9283ae63bcdf555b4f",filename:"zsh-config.sh"}];function c(){let[e,t]=(0,a.useState)("all"),[i,n]=(0,a.useState)(""),[o,c]=(0,a.useState)("grid"),h=(0,a.useMemo)(()=>[...l].sort((e,t)=>{let i=e.date?new Date(e.date).getTime():0;return(t.date?new Date(t.date).getTime():0)-i}),[]),p=(0,a.useMemo)(()=>h.filter(t=>{let s="all"===e||t.category===e,a=""===i||t.title.toLowerCase().includes(i.toLowerCase())||t.description.toLowerCase().includes(i.toLowerCase())||t.tags.some(e=>e.toLowerCase().includes(i.toLowerCase()));return s&&a}),[h,e,i]),u=(0,a.useMemo)(()=>{let e={};return h.forEach(t=>{e[t.category]=(e[t.category]||0)+1}),r.map(t=>({...t,count:e[t.id]||0}))},[h]),m=h.length;return(0,s.jsxs)("div",{className:"code-ai-page",children:[(0,s.jsxs)("div",{className:"page-header",children:[(0,s.jsx)("h1",{className:"page-title",children:"Code & AI"}),(0,s.jsx)("p",{className:"page-subtitle",children:"Practical code snippets, ML/AI insights, and productivity tools"})]}),(0,s.jsxs)("div",{className:"code-ai-controls",children:[(0,s.jsxs)("div",{className:"code-ai-filters",children:[(0,s.jsxs)("button",{className:`filter-button ${"all"===e?"active":""}`,onClick:()=>t("all"),children:["All (",m,")"]}),u.map(i=>(0,s.jsxs)("button",{className:`filter-button ${e===i.id?"active":""}`,onClick:()=>t(i.id),children:[i.icon," ",i.name," (",i.count,")"]},i.id))]}),(0,s.jsxs)("div",{className:"code-ai-search-and-view",children:[(0,s.jsx)("input",{type:"text",placeholder:"Search snippets...",value:i,onChange:e=>n(e.target.value),className:"code-ai-search"}),(0,s.jsxs)("div",{className:"view-mode-toggle",children:[(0,s.jsx)("button",{className:`view-mode-button ${"grid"===o?"active":""}`,onClick:()=>c("grid"),title:"Grid view",children:(0,s.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[(0,s.jsx)("rect",{x:"1",y:"1",width:"6",height:"6"}),(0,s.jsx)("rect",{x:"9",y:"1",width:"6",height:"6"}),(0,s.jsx)("rect",{x:"1",y:"9",width:"6",height:"6"}),(0,s.jsx)("rect",{x:"9",y:"9",width:"6",height:"6"})]})}),(0,s.jsx)("button",{className:`view-mode-button ${"list"===o?"active":""}`,onClick:()=>c("list"),title:"List view",children:(0,s.jsxs)("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"currentColor",children:[(0,s.jsx)("rect",{x:"1",y:"2",width:"14",height:"2"}),(0,s.jsx)("rect",{x:"1",y:"7",width:"14",height:"2"}),(0,s.jsx)("rect",{x:"1",y:"12",width:"14",height:"2"})]})})]})]})]}),0===p.length?(0,s.jsx)("div",{className:"no-results",children:(0,s.jsx)("p",{children:"No snippets found matching your criteria."})}):(0,s.jsx)("div",{className:`code-ai-items ${o}`,children:p.map(e=>(0,s.jsx)(d,{item:e,viewMode:o},e.id))})]})}function d({item:e,viewMode:t}){let i=r.find(t=>t.id===e.category);return(0,s.jsxs)("article",{className:`code-ai-card ${t}`,children:[(0,s.jsxs)("div",{className:"code-ai-card-header",children:[(0,s.jsxs)("div",{className:"code-ai-meta",children:[(0,s.jsxs)("span",{className:"code-ai-category",children:[i?.icon," ",i?.name||e.category]}),(0,s.jsx)("time",{className:"code-ai-date",children:e.date?new Date(e.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"No date"})]}),(0,s.jsx)("h3",{className:"code-ai-title",children:e.title})]}),(0,s.jsx)("p",{className:"code-ai-description",children:e.description}),(0,s.jsx)("div",{className:"code-ai-tags",children:e.tags.map(e=>(0,s.jsx)("span",{className:"code-ai-tag",children:e},e))}),(0,s.jsxs)("div",{className:"code-ai-footer",children:[e.gistUrl&&(0,s.jsx)("a",{href:e.gistUrl,target:"_blank",rel:"noopener noreferrer",className:"code-ai-link",children:"View on GitHub →"}),(0,s.jsx)(o(),{href:`/code-ai/${e.id}`,className:"code-ai-link primary",children:"View Details →"})]})]})}},9121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),s=t.X(0,[447,463,308],()=>i(4675));module.exports=s})();