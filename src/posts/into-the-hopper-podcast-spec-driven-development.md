---
title: "Tools and Strategies for Agentic Development (Into the Hopper Podcast)"
date: "2026-01-12"
tags: ["AI Agents", "Podcast", "Spec-Driven Development", "Developer Tooling", "Reflection"]
summary: "A conversation with Tim Hopper on spec-driven development, Beads for task tracking, and how AI agents have changed my planning habits."
image: "/posts/into-the-hopper-podcast-cover.png"
---

![Planning in the forest](/posts/into-the-hopper-podcast-cover.png)

It's been a busy week. I've been hard at work building an internal agent/LLM platform at Workhelix. But I was able to step away to have an introspective conversation with Tim Hopper on his Into the Hopper Podcast. It was a great opportunity to reflect on my use of spec-driven development, Steve Yegge's [Beads](https://github.com/steveyegge/beads) for tracking tasks while using coding agents, and my [work and research into managing agent memory](https://www.oreilly.com/library/view/managing-memory-for/9798341661257/). I took some time this weekend to share some of the code snippets and ideas I use every day in the [Code and Tools](/code-ai) section of this site.

Tim and I discussed how AI has changed our work patterns. We often hear that coding agents and GenAI are instilling bad habits in software engineers. To my surprise, I've actually become a *much* more intentional planner with agents. Pre-agents, I would be told I had to plan out every step thoroughly, yet beyond the architecture, I hesitated to over-specify my projects.

With agentic development, that's no longer the case. Agents have pushed me to become a firm believer in spec-driven development—the idea that larger projects should have a thorough architecture doc, a tasks doc fully breaking down different epics into atomic tasks, and thorough session logging. This shift has made me a much more intentional coder, and I believe my work has benefited from it.

*Here's an example of my spec-driven workflow using Beads. See more in [Code and Tools](/code-ai).*

```bash
# Create tasks with dependencies
bd create "T1: Project Structure" -t task -p 0 -d "Set up package structure" --json
bd create "T2: Core Client" -t task -p 1 -d "Implement client class" --json
bd dep add <T2-id> <T1-id> --type blocks

# Find ready work and claim it
bd ready
bd update <id> --status in_progress

# Close and sync
bd close <id> --reason implemented
bd sync -m "Close T1: Project Structure"
```

One thing I'm curious about, with the advent of agentic coding, is how the complexity, maturity, or elegance of codebases is shifting. I haven't seen much research into this subject, but I intend to speak to other veteran software engineers to see if they've also improved some of their habits.

If any of these subjects interest you, I've embedded Tim's podcast below.

<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/2IcWcUKJRdjaXsLKh2J4ca?utm_source=generator" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
