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
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","posts","pandas_functions_advanced_groupbys_with_grouper_assign_and_query"],"i":false,"f":[[["",{"children":["posts",{"children":[["slug","pandas_functions_advanced_groupbys_with_grouper_assign_and_query","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["posts",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","pandas_functions_advanced_groupbys_with_grouper_assign_and_query","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","CE0nixARCPv-ZxGsDmYLHv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
8:null
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],""]
14:I[4372,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
15:I[1778,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
16:T241a,

<link href="themes/prism.css" rel="stylesheet" />
<script src="prism.js"></script>

## Introduction

Pandas groupbys are some of the most useful functions in a data scientist's toolkit. And yet, time and again I have found that colleagues do not realize the flexibility these ubiquitous functions can grant them. In the following post, I will demonstrate some of my favorite uses of groupbys in the hope that it will help others in the future.

## The Data

Let's start with a simple example and work our way up in difficulty. We'll start with reading in Covid19 data that Johns Hopkins University aggregated from the World Health Organization. The dataset contains approximately 300,000 observations from different countries and regions of the world on Covid19 cases, recoveries, and deaths.

<pre><code class="language-python">from pandas as import read_csv, Grouper
from datetime import timedelta

covid_ts = read_csv("covid_19_data.csv").dropna()
covid_ts['ObservationDate'] = pd.to_datetime(covid_ts['ObservationDate']
</code></pre>

Now that we've loaded our data, we can take a look.

<pre><code class="language-python">covid_ts.head()
</code></pre>

[table id=1 /]

Here we can confirm that we have seven columns of regional and national-level disease data. ObservationDate and Last Update don't differ by much, so for our purposes we'll simply stick with Observation Date, dropping the other. 

Since we'll be leveraging the temporality of our dataset, let's quickly check the range of our data.

<pre><code class="language-python">
start = min(covid_ts['ObservationDate'])
end = max(covid_ts['ObservationDate'])
range_ = end - start + timedelta(days=1) # inclusive range

print(f"Observations range form {str(start.date())} to {str(end.date())}, or {range_.days} days"
</code></pre>
Observations range from 2020-01-22 to 2021-05-29, or 494 days.

Okay, with that let's jump into some groupbys.

## Advanced Groupbys

Being Covid timeseries data, the first thing we can do is check how the disease has progressed over the weeks. Enter pandas.Grouper, a groupby-specific function that allows users to control how their data will be grouped at a time-based level. All we have to do is invoke Grouper within a typical groupby function, provide an offset alias (e.g. D for daily, W for weekly, Y for yearly), and an aggregation metric (e.g. sum, mean, count) such as is done in the following lines of code:

## Multiline functions can be surrounded with () for readability

<pre><code class="language-python">
(
 covid_ts.groupby(Grouper(key="ObservationDate", freq="1W"))
         [['Confirmed']]
         .sum()
         .reset_index()
)
</code></pre>

Resulting in the Weekly Aggregate Covid19 Cases table below:

[table id=2 /]


By grouping "confirmed" cases in covid_ts using Grouper, the offset alias 1W, and sum, we have easily aggregated weekly confirmed cases over the date range of our data. If we wanted more granular aggregations we could have easily changed our offsets to _D, where _ is any number of day offets. But this is only step one of what we can achieve with Grouper, and groupby aggregations in general.

The convenience of Grouper is extended by its ability to aggregate subgroups by the offsets it's provided—all that matters is the placement of Grouper relative to other groupby columns. For example, in the groupby snippet below, "Country/Region" is placed in a list before our Grouper function at the 1M (one month) offset, producing the National/Regional Covid Cases By Month table below.

<pre><code class="language-python">
(
   covid_ts
   .groupby(["Country/Region", Grouper(key="ObservationDate", freq="1M")])
   [['Confirmed']]
   .sum()
   .reset_index()
)
</code></pre>

[table id=3 /]

Whereas, by placing "Country/Region" in a list after Grouper, one can get a similar, but slightly different aggregation of the data: Monthly Covid Cases by Country/Region.
<pre><code class="language-python">
(
    covid_ts
    .groupby([
    Grouper(key="ObservationDate", freq="1M"), "Country/Region"])
    [['Confirmed']]
    .sum()
    .reset_index()
)
</code></pre>

[table id=4 /]

Note here that as we progress down our table, we pass the total number of covid cases for each country reporting, whereas previously we would pass through the entire history of reported covid cases per country. As ever, the order our data is listed as is determined by the placement of columns in our groupby. With Grouper, our options are simply extended to aggregations of date-values—and the extensibility does not end there.

## Complementary Functions

After grouping our data, we often want to operate on the values we have derived. Luckily, pandas provides us with assign, a function for manipulating newly derived columns in place. To use assign, most often one will also want to be comfortable with lambda expressions, so we'll be sure to implement them here as a reminder. Let's return to our National/Regional Covid Cases By Month for a use-case.

First, we'll rename our columns with some named aggregations for clarity, replacing "Confirmed" with the more accurate "Total_Cases".
<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    .Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Cases=("Confirmed", "sum"),
            )
    .reset_index()
    .head()
)
</code></pre>

[table id=5 /]

Next, we'll add additional data to our table by inserting a named aggregation for "Total_Deaths" per country per month.
<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    .Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Deaths=("Deaths", "sum"),
    	 Total_Cases=("Confirmed", "sum"),
         )
    .reset_index()
    .head()
   )
</code></pre>

[table id=6 /]

Finally, we'll leverage assign by referencing our new "Total_Deaths" and "Total_Cases" in-line, using them to create an entirely new column of data: "Death_Case_Ratio", or "Total_Deaths" divided by "Total_Cases". By multiplying our new ratio by 100 we can derive an informative metric: the percentage of infected individuals who die each month in a given country/region. Finally, we'll rename our columns to more aesthetic titles, as spaces aren't allowed in named aggregations.

<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    pd.Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Deaths=("Deaths", "sum"),
         Total_Cases=("Confirmed", "sum")
        )
    .assign(
Death_Case_Ratio=lambda x: round(x['Total_Deaths']/x['Total_Cases']*100,2)           )
    .reset_index()
    .rename({'Total_Deaths':'Total Deaths',
             'Total_Cases':'Total Cases',
             'Death_Case_Ratio':'Death/Case Ratio (%)'},
             axis=1)
)
</code></pre>
And wala we have the following National/Regional Death/Case Ratio By Month table.

[table id=7 /]

## Aggregating Text and Filtering

Groupbys are not simply convenient for aggregating numerical data—they are also useful for summarizing text data too. Let's return again to our National/Regional Death/Case Ratio by Month table. This time, we'll leverage a lambda function within  our agg function, expanding its flexibility to its fullest extent.
<pre><code class="language-python">
(
   covid_ts
   .groupby(["Country/Region",
   pd.Grouper(key="ObservationDate", freq="1M"), ])
   .agg(Total_Deaths=("Deaths", "sum"),
        Total_Cases=("Confirmed", "sum"),
        City_States=('Province/State', lambda x: ', '.join(set(x)))
           )
   .assign(
Death_Case_Ratio=lambda x: round(x['Total_Deaths']/x['Total_Cases']*100,2)           )
   .reset_index()
   .rename({'Total_Deaths':'Total Deaths',
            'Total_Cases':'Total Cases',
            'City_States':'City/States',
            'Death_Case_Ratio':'Death/Case Ratio (%)'},
            axis=1)
   .query(""" `Country/Region` == 'US'""")
       )
</code></pre>

Here we generate a "City_States" column (subsequently renamed to "City/States") in which we aggregate "Province/State" text data to the monthly and country level. By implementing a join function, and filtering redundant data with set, we are instructing pandas to list out which cities and towns comprise our data. To visualize this, a filter was also added in the form of Pandas' powerful query function, which allows us to filter columns in place using boolean expressions. Here we filtered "Country/Region" to only include the United States. The result of our work can be seen in the US Death/Case Ratio by Month table below. 

[table id=8 /]

## Summary

As we can see, pandas groupbys are far more flexible than they are typically used for. We have seen that when we leverage functions such as Grouper, we are able to aggregate timeseries data using offset aliases. By implementing the agg function with named aggregations, we can reference and manipulate these new columns in place by appending an assign function to our code. Finally, we have seen that even text need not be ignored, thanks to our ability to use lambda functions within agg functions as well. To top it off, we saw that Pandas' powerful query function allows us to filter our data to whatever granularity we'd like using boolean expressions.
5:["$","article",null,{"className":"post-detail","children":[["$","header",null,{"className":"post-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/posts","children":"← Back to all posts"}]}],["$","h1",null,{"className":"post-title","children":"Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query"}],["$","div",null,{"className":"post-meta","children":[["$","time",null,{"className":"post-date","children":"June 25, 2021"}],["$","span",null,{"className":"post-separator","children":"•"}],["$","span",null,{"className":"post-reading-time","children":[7," min read"]}]]}],["$","div",null,{"className":"post-tags","children":[["$","$L13","Pandas",{"href":"/tags/Pandas","className":"post-tag","children":"Pandas"}],["$","$L13","Groupby",{"href":"/tags/Groupby","className":"post-tag","children":"Groupby"}],["$","$L13","Python",{"href":"/tags/Python","className":"post-tag","children":"Python"}],["$","$L13","Data Science",{"href":"/tags/Data Science","className":"post-tag","children":"Data Science"}],["$","$L13","Time Series",{"href":"/tags/Time Series","className":"post-tag","children":"Time Series"}],["$","$L13","Covid19",{"href":"/tags/Covid19","className":"post-tag","children":"Covid19"}]]}]]}],"$undefined",["$","div",null,{"className":"post-audio-section","children":["$","$L14",null,{"audioUrl":"https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/pandas_functions_advanced_groupbys_with_grouper_assign_and_query.mp3","title":"Listen to this post","className":"post-audio-player"}]}],["$","div",null,{"className":"post-content","children":["$","$L15",null,{"content":"$16"}]}],["$","footer",null,{"className":"post-footer","children":[["$","div",null,{"className":"post-footer-tags","children":[["$","h3",null,{"children":"Tagged with:"}],["$","div",null,{"className":"post-tags","children":[["$","$L13","Pandas",{"href":"/tags/Pandas","className":"post-tag","children":"Pandas"}],["$","$L13","Groupby",{"href":"/tags/Groupby","className":"post-tag","children":"Groupby"}],["$","$L13","Python",{"href":"/tags/Python","className":"post-tag","children":"Python"}],["$","$L13","Data Science",{"href":"/tags/Data Science","className":"post-tag","children":"Data Science"}],["$","$L13","Time Series",{"href":"/tags/Time Series","className":"post-tag","children":"Time Series"}],["$","$L13","Covid19",{"href":"/tags/Covid19","className":"post-tag","children":"Covid19"}]]}]]}],["$","div",null,{"className":"post-navigation","children":["$","$L13",null,{"href":"/posts","className":"back-to-posts","children":"← View all posts"}]}]]}]]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query | Economic Notes"}],["$","meta","1",{"name":"description","content":"A technical walkthrough on advanced uses of Pandas groupbys, showcasing time-based aggregations, lambda expressions, and inline data manipulation with assign, all framed around real-world Covid19 data."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query"}],["$","meta","6",{"property":"og:description","content":"A technical walkthrough on advanced uses of Pandas groupbys, showcasing time-based aggregations, lambda expressions, and inline data manipulation with assign, all framed around real-world Covid19 data."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev/posts/pandas_functions_advanced_groupbys_with_grouper_assign_and_query"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:image","content":"https://econoben.dev/api/og?title=Pandas+Functions%3A+Advanced+Groupbys+with+Grouper%2C+Assign%2C+and+Query&date=2021-06-26T00%3A00%3A00.000Z&tags=Pandas%2CGroupby%2CPython%2CData+Science%2CTime+Series%2CCovid19&summary=A+technical+walkthrough+on+advanced+uses+of+Pandas+groupbys%2C+showcasing+time-based+aggregations%2C+lambda+expressions%2C+and+inline+data+manipulation+with+assign%2C+all+framed+around+real-world+Covid19+data."}],["$","meta","10",{"property":"og:type","content":"article"}],["$","meta","11",{"property":"article:published_time","content":"2021-06-26T00:00:00.000Z"}],["$","meta","12",{"property":"article:author","content":"Benjamin Labaschin"}],["$","meta","13",{"property":"article:tag","content":"Pandas"}],["$","meta","14",{"property":"article:tag","content":"Groupby"}],["$","meta","15",{"property":"article:tag","content":"Python"}],["$","meta","16",{"property":"article:tag","content":"Data Science"}],["$","meta","17",{"property":"article:tag","content":"Time Series"}],["$","meta","18",{"property":"article:tag","content":"Covid19"}],["$","meta","19",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","20",{"name":"twitter:title","content":"Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query"}],["$","meta","21",{"name":"twitter:description","content":"A technical walkthrough on advanced uses of Pandas groupbys, showcasing time-based aggregations, lambda expressions, and inline data manipulation with assign, all framed around real-world Covid19 data."}],["$","meta","22",{"name":"twitter:image","content":"https://econoben.dev/api/og?title=Pandas+Functions%3A+Advanced+Groupbys+with+Grouper%2C+Assign%2C+and+Query&date=2021-06-26T00%3A00%3A00.000Z&tags=Pandas%2CGroupby%2CPython%2CData+Science%2CTime+Series%2CCovid19&summary=A+technical+walkthrough+on+advanced+uses+of+Pandas+groupbys%2C+showcasing+time-based+aggregations%2C+lambda+expressions%2C+and+inline+data+manipulation+with+assign%2C+all+framed+around+real-world+Covid19+data."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
