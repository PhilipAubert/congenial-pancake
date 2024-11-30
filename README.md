# Task

Create an API-wrapper that manages concurrent requests to reduce network load and active threads.

## Technology choices

I wanted to accomplish this with a client based application using Typescript at it is more relevant to the current discussion with Mimir.
Since I am not that familiar with Vue.JS, and I've done some variations of fetching hooks and fetching interceptors in React, I decided
to minimize time spent by using what I am more familiar with.

## Approach

During my career I've had two cases that I could look back to that could help me with my approach here.

Firstly; I had written a useFetch hook for TV2 that implemented an AbortController and attached some standard headers to the request. I wanted to
use a similiar approach, as I find the use of hooks / helper functions quite developer friendly as it is usually quite easy to use and maintain.

Secondly: DNB wanted me to make a request interceptor that would overwrite the window.fetch() API to implement custom logic on how to handle certain status codes, 
especially 302 Redirects - but I find this approach to be extensively complex and it would require a lot more time and finesse had I chosen this approach.
note: it's a lot easier to intercept XMLHttpRequests than standard fetches for some reason.

Seeing as the first approach felt a lot more maintainable, easy to use, and a lot less complex, I decided to use a similiar approach after a bit of research.

## Research

Seeing as I hadn't implemented this exact feature before, I wanted to see what others had done to implement similiar things. I decided to paste the whole 
assignment into ChatGPT to see what it would cook up. It cooked up a python script where it explained that by using **semaphores** it could easily create
a function to achieve the desired result. 

I then moved on to googling 'Javascript semaphores', and found an article on medium.com (https://medium.com/swlh/semaphores-in-javascript-e415b0d684bc)
that showed a possible implementation of semaphores in javascript. I spent some time wrapping my head around what it did and what the purpose was, and 
came across some article explaining that semaphores are in fact just a fancy word for creating lock/release mechanics to handle concurrent actions.

Wanting a simpler implementation than the one I found on the medium article, I checked some things on stackoverflow and found an example of a semaphore
implementation using **queues** (https://stackoverflow.com/questions/17528749/semaphore-like-queue-in-javascript), which sounded perfect for the assignment. 

## Issues

Most of the time spent coding was trying to implement a minimal approach to semaphores including a queue, and getting this to work properly with my desired
react hook flow. I wanted the useFetch hook to return a promise so that the developer could resolve the promise on their own terms - but that caused
some issues with returning the same promise to several requests, as it can only be resolved once. I figiured I could implement some logic to clone the promise and return
that instead, but I ran out of available time so I put that on hold for another time. For future implementations I would like to return a Promise instead of string.

## Running it locally

Clone repository, open terminal, run command `npm install`, and when that is done you can just write `npm run dev` to test it out. 
The view in the client shows one URL per request that has received a response - but I recommend also opening the browser dev tools
and add some throttling to see that the semaphore logic is working. If you for example spam one request, you will see a lot of responses
in the client view - but in the dev tool you should see that they all got the response from the same request.
