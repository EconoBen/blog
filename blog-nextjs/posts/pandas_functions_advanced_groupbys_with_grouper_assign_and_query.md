---
title: "Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query"
date: "2021-06-26"
tags: ["Pandas", "Groupby", "Python", "Data Science", "Time Series", "Covid19"]
summary: "A technical walkthrough on advanced uses of Pandas groupbys, showcasing time-based aggregations, lambda expressions, and inline data manipulation with assign, all framed around real-world Covid19 data."
---


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
