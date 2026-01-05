---
title: "Building DSA Dojo: A CLI-Driven Approach to Learning Data Structures and Algorithms"
date: "2026-01-04"
summary: "I'm building my own data structures and algorithms course—a CLI-driven, ladder-based system where mastery comes through doing, not watching. Here's a first look at DSA Dojo."
tags: ["AI", "LLMs", "Developer Tooling", "Python", "Teaching", "Personal"]
---

![DSA Dojo curriculum tree](/assets/2026/01/dsa-dojo-curriculum-tree.png)

I've always been a tinkerer. There are so many projects I've half-started and never finished. With the advent of GenAI, I'm increasingly able to push these projects across the finish line and enjoy the fruits of this creative labor.

But I've never been very open about what these projects are. Generally, it's because I perceived them to be too bespoke to share with wider audiences. Or because I simply didn't know if I'd finish them.

In the past months, I've noticed more and more conversations about what impact AI will have on software engineering jobs. Few people have invested more in this question than those of us at Workhelix, where the entire value proposition is being able to measure this impact. But in my free time, I try not to worry too much about this—not when I can be building incredible projects I'd never otherwise have the time to build instead.

This year, I'm going to share the projects I'm working on more widely, the thought and reasoning behind them, and the GenAI tooling I'm using to build them.

## DSA Dojo

Over my winter break, I began working on a project called "DSA Dojo."

I've never been satisfied with standard data structures and algorithms courses. They're either too sporadic—like Leetcode, where you're jumping between disconnected problems. Or too information-heavy, where I don't have a chance to learn for myself and iterate on solutions.

So I've finally started to build my own solution based on how I taught myself DS&A. If it's any good, I'll open-source it.

The conceit is that, for learners like me, mastering DS&A should come in small, digestible chunks. The emphasis should be on tinkering and failing by *doing*, rather than reading long explanations or watching videos. Get into the code as soon as possible. Climb ladders of code where each rung adds *just a little* more information worth knowing for the problem. Until, by the time you've reached the end of the ladder, you've summited the problem by *doing*.

The project isn't done yet. It may not surprise you to learn that creating an actual, useful course that is well-crafted and intentional takes time, thought, and effort. But I've made good progress. For example, the whole thing is CLI-driven with a terminal UI for navigating the curriculum. You can see your progress at a glance—how many exercises you've completed, how many competencies you've mastered, and what's still locked.

![The curriculum tree showing exercise dependencies](/assets/2026/01/dsa-dojo-curriculum-tree.png)
*The curriculum tree. Exercises are locked until you complete their prerequisites. You can see "Two Sum" requires "Counting" which requires "Set Membership" which requires the "Accumulator" warmup. This is the ladder system in action, where each rung builds from the rung below.*

![Stats overview showing 268 exercises](/assets/2026/01/dsa-dojo-stats-overview.png)
*A stats overview. 268 exercises across topics like dynamic programming, graphs, binary search, strings, and more—each broken into sub-competencies.*

There's much more I'm not showing. Mostly because so much ends up on the cutting room floor. But I'm happy with what's come of this project so far. I hope to have more to update next week.
