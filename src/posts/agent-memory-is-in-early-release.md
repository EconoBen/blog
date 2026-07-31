---
title: "Agent Memory Is in Early Release"
date: "2026-07-30T12:00:00-07:00"
tags: ["O'Reilly", "Agent Memory", "AI Agents", "LLMs", "Publishing"]
summary: "My new O'Reilly book, Agent Memory, is now in Early Release. Chapters 1 and 2 are live, new chapters land every four to six weeks, and the version you read now is the one your feedback can still change."
image: "/assets/agent-memory-early-release-banner.jpg"
---

My third O'Reilly project—and my first full-length book—went into Early Release today. It's called [*Agent Memory: Building Stateful AI Agents That Remember, Adapt, and Work Across Time*](https://www.oreilly.com/library/view/agent-memory/0642572370473/?utm_source=econoben&utm_medium=post&utm_campaign=early_release), and Chapters 1 and 2 are live on the O'Reilly platform right now.

Back in 2023, O'Reilly reached out to me to write a report on AI agents when the concept itself was still unclear. That work became [*What Are AI Agents?*](https://www.oreilly.com/library/view/what-are-ai/9781098159726/) Three years later, practitioners aren't asking what agents are. They're too busy integrating generative AI into their organizations and wiring agentic workflows into production. Over the last five years, I have spent much of my time integrating analytics platforms into Fortune 50 companies to measure how generative AI actually affects productivity across large and medium-sized organizations.

While there is no silver bullet that solves every issue with agentic systems, I've come to believe that organizational agent-memory ecosystems are among the most impactful—and least addressed—improvements AI-forward organizations can adopt.

That's what *Agent Memory* is about.

## What the first two chapters do

Chapter 1 is about the distinction between context and memory. A context window is what an agent is holding right now. Memory is what it can retrieve. Treating the first as though it were the second is why teams keep stuffing more tokens into a prompt and calling it state.

I make the point with a bug rather than a definition. An agent is handed a purchase service that times out against a vendor API. With no memory, it reads the failure as a generic HTTP timeout and does the obvious thing: it adds a retry. That retry replays purchases that already went through, and the company double-charges its customers. It's a fine answer, but prompting won't fix it, because the missing piece is not reasoning. A previous incident already documented exactly this failure, and the agent could not reach it.

Chapter 2 is where the work starts. If the fix in Chapter 1 is "let the agent read organizational incidents," the obvious follow-up is: read them from where? Real organizations keep knowledge in Google Drive, GitHub, Asana, Slack, Jira, and a dozen other systems. The naive answer is to connect everything and let retrieval sort it out. But this produces a very expensive way to drown an agent in noise.

So Chapter 2 builds the pipeline one layer at a time, with each layer solving something the last one left open:

- **Mapping.** Give the agent a map of where memory might live so it can decide where to look instead of searching blindly. The map also tells it where *not* to look, which can matter just as much.
- **Connecting.** Make those sources actually reachable. This is a connector contract, an MCP server exposing it, and `dlt` underneath doing the extraction so you aren't hand-maintaining an API wrapper per source.
- **Normalizing.** Make the records legible. A shared schema gets you the same *shape* from every source, but not the same *meaning*. An agent still needs to know how fresh a record is, who owns it, what kind of claim it makes, and how far the organization vouches for it.
- **Curating.** Decide what belongs in the store at all. A memory system that holds everything reachable isn't a memory system; it's a data lake with a schema on top.
- **Routing.** Surface the most trustworthy records first, and only the ones this agent should see.

The chapter runs on real connectors against real GitHub, Drive, and Asana data, and I let it fail on purpose. Fifteen records come back, and several of them are junk. These failures build the argument for the next layer. You can watch each one break before you see the thing that fixes it.

## What Early Release means

Early Release chapters ship before copyedit. You're getting the material a year or more before the finished book, and you're seeing the rough edges that come with that.

Right now is the only window where what you tell me still changes what ships. Once the book is typeset, that's it. But today, if a chapter is thin, an example isn't intuitive, or I've asserted something that's wrong, I want to hear it—because I can still do something about it.

## How to read it

The book lives on the [O'Reilly platform](https://www.oreilly.com/library/view/agent-memory/0642572370473/?utm_source=econoben&utm_medium=post&utm_campaign=early_release). If you don't have access, a [free 10-day trial](https://www.oreilly.com/start-trial/?type=individual&utm_source=econoben&utm_medium=post&utm_campaign=early_release) will get you through what's live. It's also worth checking whether you already have access and don't know it. A lot of companies and universities carry O'Reilly subscriptions, and most people at those places have never used them.

The rest of the book isn't standing still. I've already submitted Chapter 3, "Choosing What Becomes Memory," to my incredible editor. Now I'm working on Chapter 4, "How Memory Gets Written." New chapters land roughly every four to six weeks, and there are ten in total across three parts. If you want to know when each one arrives, [subscribe here](/book#subscribe) and I'll tell you.

And please do reach out and tell me what you're enjoying—and what you'd like to see in the book. I can't wait to hear from you.
