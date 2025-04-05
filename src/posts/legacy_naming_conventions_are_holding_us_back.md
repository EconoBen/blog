---
title: "Legacy Naming Conventions Are Holding Us Back"
date: "2021-12-08"
tags: ["Service Design", "Developer Experience", "Naming Conventions", "Engineering Culture", "Internal Tools"]
summary: "A case for naming internal services with intention—favoring names that are intuitive, easy, and specific over clever or obscure references. A little clarity can go a long way in reducing cognitive overhead and improving team communication."
---


# Introduction

Let's see if this sounds familiar: It's your first day at Finch—an e-commerce startup that sells bird food and supplies. As you're onboarded you're gradually introduced to the company's internal services. First there's Macaw, a wrapper around Airflow DAGs; then there's Senegal, which leverages Terraform; of course, you'll need Falcon which ingests avro files from Redis; also there's Junco, Starling, Kestrel...are you keeping up?

Flash forward three months, and it's turned out that you haven't even needed most of those services you heard about your first week. Some services have been mentioned in passing, but you haven't had to touch them. Except, oh, today you're in a meeting with engineering and they're talking about how in order to deploy your model to production, you need to connect Kestrel to Macaw, but to do that you've got to modify protobufs so that Junco reads in, which is where Starling comes in handy…

You see where this is going.

Why are these services named after birds? Well, as most of us know, it’s a norm in tech that the person or people who’ve created a project have the right to name it. Very often, the names will be thematic to your company's "culture"—services will be named in reference to the company name, or mascot, or business area. Except often these names are not only confusing as hell—they actively add to the significant cognitive load that tech workers have to balance on a daily basis. 

So here’s the truth: just because someone creates a useful internal service does not mean they're the best people to name them. The services we build are for others, not ourselves, and therefore, just like a good presentation or book, we should think of our audience. If your project is initially just for you, sure go ahead and use a funny stand-in name. But if your audience will be expansive, then consider abiding by reasonable naming standards. 

To me, no matter the company, service names should be:

- **Intuitive**
- **Easy**
- **Specific**

## Intuitive Service Names 

The primary function of a service should be the central theme of its naming. Why? Because then people will remember it... When people don't have to do extra work connecting a name to a function, you can spend more time solving and less time explaining. If your service is the order data pipeline for e-commerce, call it Finch Order Data Pipeline. If you've built a model that predicts customer churn: Finch Churn Model. It's that easy.

## Easy (to type, to say, ...) Service Names

Sometimes you'll have an engineer create a service who's something of an ornithologist themselves. They just so happen to love the Stresemann's bristlefront (Merulaxis stresemanni), one of the rarest birds on earth. So, they've taken it upon themselves to name their services Merulaxis. What, it's bird themed!  

Service names should be easy. Though the above example may seem overly eccentric, there truly are people who, without a thought for utilitarianism, will name services like this when given the chance. But let us not cast aspersions—it's hard to balk at the opportunity to name things that might outlast us. Let us instead point to naming standards and say, "Sorry that's not easy." 

Though "easy" is relative, I suggest the following guidelines when determining whether a service name is easy. 

It is simple to type.
It is reasonably easy for most people to say.
It doesn't contain uncommon letters or symbols.

## Specific Service Names

A service name should ideally be associated with one, and only one, function. For example, data-centric organizations often have many pipelines that process and transfer data from one state and service to another state and service. It therefore doesn't make much sense to call a service Finch Data Pipeline. Which pipeline, for what data? Better to take a moment to specify the name (e.g. Millet Shipping Data Pipeline), than to regret it later.

## But What About Fun?

At this point—or perhaps as soon as you started reading—you may protest. What about fun names? Don’t take the heart out of tech! Fair enough. If you are set on choosing a fun name, then I’ll point out there are libraries and services that meet the standards I listed above that are also fun. Plotly, the open-source visualization library, has a fun name that is intuitive, easy (by many standards), and specific—it’s a plotting library. NumPy allows for efficient, numerical operations in Python—it’s very straightforward. 

You get the idea. The point is, it’s not that names shouldn’t be fun, it’s that service names should also convey intuitive, easy, and specific meaning to internal audiences who use them.

One last note on this: “Maybe,” you might respond, “names are unfamiliar at first but with adoption they can grow into ubiquity.” My counter to that claim is that most people believe this to be true when they name their services, and very few achieve their goal. Most of the time service names just remain confusing.

## Additional Points
### Acronyms

Too many acronyms are already used in business, and unless it is a patently obvious, commonly used acronym, avoid names-as-acronyms when possible.

### Jargon and Insider Knowledge

Do not use names that assume shared context or use unreasonable jargon when perfectly straightforward alternatives exist. For example, say you create a fancy Transformer Reinforcement Learning model that calculates Customer Lifetime Value. Since you're very proud of it you name it TRTL. Except the model isn’t for you, it’s for Product. So, why not simply call it the Customer Lifetime Value service, since that's its function? 

### Rename Services

Finally, let’s say you’re part of a company that has confusing naming conventions such as those I wrote about above. Why not push to apply some standards to the names of existing services? While renaming the legacy services of your organization's may be difficult at first, I'm confident it will improve communication within your company moving forward. 
