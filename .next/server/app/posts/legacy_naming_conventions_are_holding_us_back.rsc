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
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","posts","legacy_naming_conventions_are_holding_us_back"],"i":false,"f":[[["",{"children":["posts",{"children":[["slug","legacy_naming_conventions_are_holding_us_back","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["posts",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","legacy_naming_conventions_are_holding_us_back","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","JT_Wo0pf1eiKSiwP8Uw1uv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
8:null
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],""]
14:I[4372,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
15:I[1778,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
16:T17af,

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
5:["$","article",null,{"className":"post-detail","children":[["$","header",null,{"className":"post-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/posts","children":"← Back to all posts"}]}],["$","h1",null,{"className":"post-title","children":"Legacy Naming Conventions Are Holding Us Back"}],["$","div",null,{"className":"post-meta","children":[["$","time",null,{"className":"post-date","children":"December 7, 2021"}],["$","span",null,{"className":"post-separator","children":"•"}],["$","span",null,{"className":"post-reading-time","children":[5," min read"]}]]}],["$","div",null,{"className":"post-tags","children":[["$","$L13","Service Design",{"href":"/tags/Service Design","className":"post-tag","children":"Service Design"}],["$","$L13","Developer Experience",{"href":"/tags/Developer Experience","className":"post-tag","children":"Developer Experience"}],["$","$L13","Naming Conventions",{"href":"/tags/Naming Conventions","className":"post-tag","children":"Naming Conventions"}],["$","$L13","Engineering Culture",{"href":"/tags/Engineering Culture","className":"post-tag","children":"Engineering Culture"}],["$","$L13","Internal Tools",{"href":"/tags/Internal Tools","className":"post-tag","children":"Internal Tools"}]]}]]}],"$undefined",["$","div",null,{"className":"post-audio-section","children":["$","$L14",null,{"audioUrl":"https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/legacy_naming_conventions_are_holding_us_back.mp3","title":"Listen to this post","className":"post-audio-player"}]}],["$","div",null,{"className":"post-content","children":["$","$L15",null,{"content":"$16"}]}],["$","footer",null,{"className":"post-footer","children":[["$","div",null,{"className":"post-footer-tags","children":[["$","h3",null,{"children":"Tagged with:"}],["$","div",null,{"className":"post-tags","children":[["$","$L13","Service Design",{"href":"/tags/Service Design","className":"post-tag","children":"Service Design"}],["$","$L13","Developer Experience",{"href":"/tags/Developer Experience","className":"post-tag","children":"Developer Experience"}],["$","$L13","Naming Conventions",{"href":"/tags/Naming Conventions","className":"post-tag","children":"Naming Conventions"}],["$","$L13","Engineering Culture",{"href":"/tags/Engineering Culture","className":"post-tag","children":"Engineering Culture"}],["$","$L13","Internal Tools",{"href":"/tags/Internal Tools","className":"post-tag","children":"Internal Tools"}]]}]]}],["$","div",null,{"className":"post-navigation","children":["$","$L13",null,{"href":"/posts","className":"back-to-posts","children":"← View all posts"}]}]]}]]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Legacy Naming Conventions Are Holding Us Back | Economic Notes"}],["$","meta","1",{"name":"description","content":"A case for naming internal services with intention—favoring names that are intuitive, easy, and specific over clever or obscure references. A little clarity can go a long way in reducing cognitive overhead and improving team communication."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Legacy Naming Conventions Are Holding Us Back"}],["$","meta","6",{"property":"og:description","content":"A case for naming internal services with intention—favoring names that are intuitive, easy, and specific over clever or obscure references. A little clarity can go a long way in reducing cognitive overhead and improving team communication."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev/posts/legacy_naming_conventions_are_holding_us_back"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:image","content":"https://econoben.dev/api/og?title=Legacy+Naming+Conventions+Are+Holding+Us+Back&date=2021-12-08T00%3A00%3A00.000Z&tags=Service+Design%2CDeveloper+Experience%2CNaming+Conventions%2CEngineering+Culture%2CInternal+Tools&summary=A+case+for+naming+internal+services+with+intention%E2%80%94favoring+names+that+are+intuitive%2C+easy%2C+and+specific+over+clever+or+obscure+references.+A+little+clarity+can+go+a+long+way+in+reducing+cognitive+overhead+and+improving+team+communication."}],["$","meta","10",{"property":"og:type","content":"article"}],["$","meta","11",{"property":"article:published_time","content":"2021-12-08T00:00:00.000Z"}],["$","meta","12",{"property":"article:author","content":"Benjamin Labaschin"}],["$","meta","13",{"property":"article:tag","content":"Service Design"}],["$","meta","14",{"property":"article:tag","content":"Developer Experience"}],["$","meta","15",{"property":"article:tag","content":"Naming Conventions"}],["$","meta","16",{"property":"article:tag","content":"Engineering Culture"}],["$","meta","17",{"property":"article:tag","content":"Internal Tools"}],["$","meta","18",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","19",{"name":"twitter:title","content":"Legacy Naming Conventions Are Holding Us Back"}],["$","meta","20",{"name":"twitter:description","content":"A case for naming internal services with intention—favoring names that are intuitive, easy, and specific over clever or obscure references. A little clarity can go a long way in reducing cognitive overhead and improving team communication."}],["$","meta","21",{"name":"twitter:image","content":"https://econoben.dev/api/og?title=Legacy+Naming+Conventions+Are+Holding+Us+Back&date=2021-12-08T00%3A00%3A00.000Z&tags=Service+Design%2CDeveloper+Experience%2CNaming+Conventions%2CEngineering+Culture%2CInternal+Tools&summary=A+case+for+naming+internal+services+with+intention%E2%80%94favoring+names+that+are+intuitive%2C+easy%2C+and+specific+over+clever+or+obscure+references.+A+little+clarity+can+go+a+long+way+in+reducing+cognitive+overhead+and+improving+team+communication."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
