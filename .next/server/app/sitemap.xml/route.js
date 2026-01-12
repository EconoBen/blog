(()=>{var e={};e.id=475,e.ids=[475],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2127:(e,t,i)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{resolveManifest:function(){return n},resolveRobots:function(){return r},resolveRouteData:function(){return s},resolveSitemap:function(){return a}});let o=i(7341);function r(e){let t="";for(let i of Array.isArray(e.rules)?e.rules:[e.rules]){for(let e of(0,o.resolveArray)(i.userAgent||["*"]))t+=`User-Agent: ${e}
`;if(i.allow)for(let e of(0,o.resolveArray)(i.allow))t+=`Allow: ${e}
`;if(i.disallow)for(let e of(0,o.resolveArray)(i.disallow))t+=`Disallow: ${e}
`;i.crawlDelay&&(t+=`Crawl-delay: ${i.crawlDelay}
`),t+="\n"}return e.host&&(t+=`Host: ${e.host}
`),e.sitemap&&(0,o.resolveArray)(e.sitemap).forEach(e=>{t+=`Sitemap: ${e}
`}),t}function a(e){let t=e.some(e=>Object.keys(e.alternates??{}).length>0),i=e.some(e=>{var t;return!!(null==(t=e.images)?void 0:t.length)}),o=e.some(e=>{var t;return!!(null==(t=e.videos)?void 0:t.length)}),r="";for(let l of(r+='<?xml version="1.0" encoding="UTF-8"?>\n',r+='<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',i&&(r+=' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'),o&&(r+=' xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"'),t?r+=' xmlns:xhtml="http://www.w3.org/1999/xhtml">\n':r+=">\n",e)){var a,n,s;r+="<url>\n",r+=`<loc>${l.url}</loc>
`;let e=null==(a=l.alternates)?void 0:a.languages;if(e&&Object.keys(e).length)for(let t in e)r+=`<xhtml:link rel="alternate" hreflang="${t}" href="${e[t]}" />
`;if(null==(n=l.images)?void 0:n.length)for(let e of l.images)r+=`<image:image>
<image:loc>${e}</image:loc>
</image:image>
`;if(null==(s=l.videos)?void 0:s.length)for(let e of l.videos)r+=["<video:video>",`<video:title>${e.title}</video:title>`,`<video:thumbnail_loc>${e.thumbnail_loc}</video:thumbnail_loc>`,`<video:description>${e.description}</video:description>`,e.content_loc&&`<video:content_loc>${e.content_loc}</video:content_loc>`,e.player_loc&&`<video:player_loc>${e.player_loc}</video:player_loc>`,e.duration&&`<video:duration>${e.duration}</video:duration>`,e.view_count&&`<video:view_count>${e.view_count}</video:view_count>`,e.tag&&`<video:tag>${e.tag}</video:tag>`,e.rating&&`<video:rating>${e.rating}</video:rating>`,e.expiration_date&&`<video:expiration_date>${e.expiration_date}</video:expiration_date>`,e.publication_date&&`<video:publication_date>${e.publication_date}</video:publication_date>`,e.family_friendly&&`<video:family_friendly>${e.family_friendly}</video:family_friendly>`,e.requires_subscription&&`<video:requires_subscription>${e.requires_subscription}</video:requires_subscription>`,e.live&&`<video:live>${e.live}</video:live>`,e.restriction&&`<video:restriction relationship="${e.restriction.relationship}">${e.restriction.content}</video:restriction>`,e.platform&&`<video:platform relationship="${e.platform.relationship}">${e.platform.content}</video:platform>`,e.uploader&&`<video:uploader${e.uploader.info&&` info="${e.uploader.info}"`}>${e.uploader.content}</video:uploader>`,`</video:video>
`].filter(Boolean).join("\n");if(l.lastModified){let e=l.lastModified instanceof Date?l.lastModified.toISOString():l.lastModified;r+=`<lastmod>${e}</lastmod>
`}l.changeFrequency&&(r+=`<changefreq>${l.changeFrequency}</changefreq>
`),"number"==typeof l.priority&&(r+=`<priority>${l.priority}</priority>
`),r+="</url>\n"}return r+"</urlset>\n"}function n(e){return JSON.stringify(e)}function s(e,t){return"robots"===t?r(e):"sitemap"===t?a(e):"manifest"===t?n(e):""}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3090:(e,t,i)=>{"use strict";i.d(t,{m:()=>d});var o=i(9021),r=i.n(o),a=i(3873),n=i.n(a),s=i(9379),l=i.n(s);class c{async getAllPosts(){return r().existsSync(this.postsDirectory)?r().readdirSync(this.postsDirectory).filter(e=>e.endsWith(".md")).map(e=>this.getPostBySlug(e.replace(/\.md$/,""))).filter(e=>null!==e).sort((e,t)=>t.date.getTime()-e.date.getTime()):(console.warn("Posts directory not found:",this.postsDirectory),[])}getPostBySlug(e){try{let t=n().join(this.postsDirectory,`${e}.md`);if(!r().existsSync(t))return console.warn(`Post not found: ${e}`),null;let i=r().readFileSync(t,"utf8"),{data:o,content:a}=l()(i),s=a.split(/\s+/).length,c=Math.ceil(s/200);return{slug:e,title:o.title||e,date:new Date(o.date||Date.now()),summary:o.summary||o.description||"",tags:o.tags||[],content:a,coverImage:o.coverImage||o.image||void 0,readingTime:c}}catch(t){return console.error(`Error reading post ${e}:`,t),null}}async getPostsByTag(e){return(await this.getAllPosts()).filter(t=>t.tags.some(t=>t.toLowerCase()===e.toLowerCase()))}async getAllTags(){let e=await this.getAllPosts(),t=new Map;return e.forEach(e=>{e.tags.forEach(e=>{t.set(e,(t.get(e)||0)+1)})}),Array.from(t.entries()).map(([e,t])=>({tag:e,count:t})).sort((e,t)=>t.count-e.count)}async searchPosts(e){let t=await this.getAllPosts(),i=e.toLowerCase();return t.filter(e=>e.title.toLowerCase().includes(i)||e.summary?.toLowerCase().includes(i)||e.tags.some(e=>e.toLowerCase().includes(i))||e.content.toLowerCase().includes(i))}async getRecentPosts(e){return(await this.getAllPosts()).slice(0,e)}async getArchiveByMonth(){let e=await this.getAllPosts(),t=new Map;return e.forEach(e=>{let i=new Date(e.date).toLocaleDateString("en-US",{year:"numeric",month:"long"});t.set(i,(t.get(i)||0)+1)}),Array.from(t.entries()).map(([e,t])=>({month:e,count:t})).sort((e,t)=>{let i=new Date(e.month);return new Date(t.month).getTime()-i.getTime()})}constructor(){this.postsDirectory=n().join(process.cwd(),"src","posts")}}let d=new c},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},3873:e=>{"use strict";e.exports=require("path")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5937:(e,t,i)=>{"use strict";i.r(t),i.d(t,{patchFetch:()=>w,routeModule:()=>g,serverHooks:()=>v,workAsyncStorage:()=>m,workUnitAsyncStorage:()=>y});var o={};i.r(o),i.d(o,{default:()=>u});var r={};i.r(r),i.d(r,{GET:()=>h});var a=i(6559),n=i(8088),s=i(7719),l=i(2190),c=i(3090);let d=[{id:"gist-87fc6542ad202b489e9b078bafa5e0fd",slug:"interactive-help-system-shell",title:"Interactive Help System for Shell Configurations",description:"A script to create a searchable, topic-based documentation system for terminal shell configurations, allowing users to access help topics and search for specific content.",category:"shell",tags:["documentation","help","productivity","shell"],language:"bash",content:`#!/bin/bash
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
# ~/.zsh_help.md    - Comprehensive help documentation`,date:new Date("2025-06-29T06:24:54.000Z"),gistUrl:"https://gist.github.com/EconoBen/86b5d3c5b5a6ec9283ae63bcdf555b4f",gistId:"86b5d3c5b5a6ec9283ae63bcdf555b4f",filename:"zsh-config.sh"}];async function u(){let e="http://localhost:3000",t=await c.m.getAllPosts(),i=[{url:e,lastModified:new Date,changeFrequency:"daily",priority:1},{url:`${e}/posts`,lastModified:new Date,changeFrequency:"daily",priority:.9},{url:`${e}/code-ai`,lastModified:new Date,changeFrequency:"weekly",priority:.8},{url:`${e}/tags`,lastModified:new Date,changeFrequency:"weekly",priority:.7},{url:`${e}/archive`,lastModified:new Date,changeFrequency:"monthly",priority:.6},{url:`${e}/talks`,lastModified:new Date,changeFrequency:"monthly",priority:.6},{url:`${e}/about`,lastModified:new Date,changeFrequency:"monthly",priority:.5}],o=t.map(t=>({url:`${e}/posts/${t.slug}`,lastModified:t.date,changeFrequency:"monthly",priority:.7}));return[...i,...o,...d.map(t=>({url:`${e}/code-ai/${t.slug}`,lastModified:t.date?new Date(t.date):new Date,changeFrequency:"monthly",priority:.6})),...(await c.m.getAllTags()).map(({tag:t})=>({url:`${e}/tags/${encodeURIComponent(t)}`,lastModified:new Date,changeFrequency:"weekly",priority:.5}))]}var p=i(2127);let f={...o}.default;if("function"!=typeof f)throw Error('Default export is missing in "/Users/blabaschin/Documents/GitHub/blog/app/sitemap.ts"');async function h(e,t){let{__metadata_id__:i,...o}=await t.params||{},r=!!i&&i.endsWith(".xml");if(i&&!r)return new l.NextResponse("Not Found",{status:404});let a=i&&r?i.slice(0,-4):void 0,n=await f({id:a}),s=(0,p.resolveRouteData)(n,"sitemap");return new l.NextResponse(s,{headers:{"Content-Type":"application/xml","Cache-Control":"public, max-age=0, must-revalidate"}})}let g=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/sitemap.xml/route",pathname:"/sitemap.xml",filename:"sitemap",bundlePath:"app/sitemap.xml/route"},resolvedPagePath:"next-metadata-route-loader?filePath=%2FUsers%2Fblabaschin%2FDocuments%2FGitHub%2Fblog%2Fapp%2Fsitemap.ts&isDynamicRouteExtension=1!?__next_metadata_route__",nextConfigOutput:"",userland:r}),{workAsyncStorage:m,workUnitAsyncStorage:y,serverHooks:v}=g;function w(){return(0,s.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:y})}},6487:()=>{},7341:(e,t)=>{"use strict";function i(e){return Array.isArray(e)?e:[e]}function o(e){if(null!=e)return i(e)}function r(e){let t;if("string"==typeof e)try{t=(e=new URL(e)).origin}catch{}return t}Object.defineProperty(t,"__esModule",{value:!0}),!function(e,t){for(var i in t)Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}(t,{getOrigin:function(){return r},resolveArray:function(){return i},resolveAsArrayOrUndefined:function(){return o}})},8335:()=>{},9021:e=>{"use strict";e.exports=require("fs")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},9428:e=>{"use strict";e.exports=require("buffer")}};var t=require("../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),o=t.X(0,[447,379,580],()=>i(5937));module.exports=o})();