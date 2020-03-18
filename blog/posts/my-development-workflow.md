---
title: How I develop Unity games partially on my phone
date: 2020-03-12
layout: post.html
draft: true
---

Developing games mostly in my spare time has lead me to automize certain aspects of my development workflow. I want to be able to work on and test my games without Unity at hand. That being said, while the title suggests, I'm making games on my phone, I am actually still working mostly in Unity. It's just that I can develop some parts of my Unity games on a phone and I mostly use this to create levels for puzzle games.

With this post I want to share my typical Unity project setup and how it allows me to make games partially on my phone.

## 1. Use a monorepo
I put everything that belongs to a project into one repository, preferably in the cloud. With everything I mean all assets, like source code, graphics, sound effects, music, fonts, marketing material, todo lists, etc. That also includes the backend and website code.

I prefer private repositories on GitHub where there are a ton of integrations with other cloud services available and you can edit files in the browser.

## 2. Use Unity Cloud Build
95% of all builds I install on my test device are built by Cloud Build. Sure, it does take longer to have a running build (25 minutes on average in the cloud vs. 12 minutes on average on my dev machine) but when I'm developing on my phone it's usually ok to wait. The most prominent use case for me is testing new levels, which doesn't require a new build for each level, as we'll see now. Nevertheless I always setup the automatic build for every new project. It only takes one to two minutes and I get free builds for every push to the master branch.

## 3. Store levels human-readable
This is essential. If I can serialize my levels in a human-readable format it means that I can edit them in the browser. That is also one reason I prefer to store my graphics as SVG files. With GitHub and Cloud Build this already enables me to work on levels on my phone and even playtest them.

## 4. Load levels from a server when on phone, otherwise from Resources
When levels can be stored human-readable, I will store them on a server, so pre-release they can be loaded from the server when running on a phone. That is not necessary when the game is running in the editor.

## 5. Automatic backend deployment (including levels)
Not every game I make requires a backend to work, but almost every game I make has a website and as #1 suggest I keep my backends/websites in the same repository. It allows for automatic deployments triggered by pushes to the master branch. And although I don't need a backend deployment for every push, I do want the latest levels file to be available on the server and therefore it's ok to have the backend deployed automatically. Automation is key when you want to be productive with only your phone.

My hoster is [Zeit](https://zeit.co), which is a serverless platform, which means I don't have to administrate any servers. They focus on developer productivity which is why they have a GitHub integration that not only handles the auto deployment but also automatically creates projects in Zeit for every GitHub repository I create. So when I start a new project from my unity-starter-project, the backend is already there. Next step is automatic game development without the need for developers.

## Introducing unity-starter
