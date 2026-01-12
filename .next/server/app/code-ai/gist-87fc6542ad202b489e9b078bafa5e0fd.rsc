1:"$Sreact.fragment"
2:I[2848,["874","static/chunks/874-218abc435b2ae46c.js","177","static/chunks/app/layout-04a0c423dc4c7100.js"],"default"]
3:I[7555,[],""]
4:I[1295,[],""]
6:I[9665,[],"OutletBoundary"]
9:I[4911,[],"AsyncMetadataOutlet"]
b:I[9665,[],"ViewportBoundary"]
d:I[9665,[],"MetadataBoundary"]
f:I[6614,[],""]
:HL["/_next/static/media/e4af272ccee01ff0-s.p.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/css/e67a3fef1494970c.css","style"]
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","code-ai","gist-87fc6542ad202b489e9b078bafa5e0fd"],"i":false,"f":[[["",{"children":["code-ai",{"children":[["id","gist-87fc6542ad202b489e9b078bafa5e0fd","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["code-ai",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["id","gist-87fc6542ad202b489e9b078bafa5e0fd","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","JX4rZXGXUJMMEQEj-yu2Fv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","915","static/chunks/app/code-ai/%5Bid%5D/page-787557e4546db574.js"],""]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
14:T706,#!/bin/bash
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
alias h-ai='help ai'5:["$","article",null,{"className":"code-ai-detail","children":[["$","div",null,{"className":"code-ai-detail-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/code-ai","children":"← Back to Code & AI"}]}],["$","div",null,{"className":"code-ai-detail-meta","children":[["$","span",null,{"className":"code-ai-detail-category","children":["💻"," ","Shell & Terminal"]}],["$","time",null,{"className":"code-ai-detail-date","children":"June 29, 2025"}]]}],["$","h1",null,{"className":"code-ai-detail-title","children":"Interactive Help System for Shell Configurations"}],["$","p",null,{"className":"code-ai-detail-description","children":"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content."}],["$","div",null,{"className":"code-ai-detail-tags","children":[["$","span","documentation",{"className":"code-ai-detail-tag","children":"documentation"}],["$","span","help",{"className":"code-ai-detail-tag","children":"help"}],["$","span","productivity",{"className":"code-ai-detail-tag","children":"productivity"}],["$","span","shell",{"className":"code-ai-detail-tag","children":"shell"}]]}],["$","div",null,{"className":"code-ai-detail-actions","children":["$","a",null,{"href":"https://gist.github.com/EconoBen/87fc6542ad202b489e9b078bafa5e0fd","target":"_blank","rel":"noopener noreferrer","className":"action-button github-button","children":[["$","svg",null,{"className":"icon","viewBox":"0 0 16 16","width":"16","height":"16","fill":"currentColor","children":["$","path",null,{"d":"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"}]}],"View on GitHub"]}]}]]}],["$","div",null,{"className":"code-ai-detail-content","children":["$","pre",null,{"className":"code-block","children":["$","code",null,{"className":"language-bash","children":"$14"}]}]}],["$","div",null,{"className":"code-ai-detail-footer","children":["$","p",null,{"className":"footer-note","children":["This snippet is part of the Code & AI collection.",[" ","You can also"," ",["$","a",null,{"href":"https://gist.github.com/EconoBen/87fc6542ad202b489e9b078bafa5e0fd","target":"_blank","rel":"noopener noreferrer","children":"star or fork it on GitHub"}],"."]]}]}]]}]
8:null
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Interactive Help System for Shell Configurations | Code & AI | Economic Notes"}],["$","meta","1",{"name":"description","content":"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Interactive Help System for Shell Configurations"}],["$","meta","6",{"property":"og:description","content":"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content."}],["$","meta","7",{"property":"og:type","content":"article"}],["$","meta","8",{"property":"article:published_time","content":"2025-06-29T07:05:32.000Z"}],["$","meta","9",{"property":"article:tag","content":"documentation"}],["$","meta","10",{"property":"article:tag","content":"help"}],["$","meta","11",{"property":"article:tag","content":"productivity"}],["$","meta","12",{"property":"article:tag","content":"shell"}],["$","meta","13",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","14",{"name":"twitter:title","content":"Economic Notes"}],["$","meta","15",{"name":"twitter:description","content":"A blog about economics, technology, and personal experiences."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
