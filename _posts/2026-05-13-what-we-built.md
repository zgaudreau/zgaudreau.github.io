---
layout: post
page_class: page-post
title: "What We Built"
date: 2026-05-13
category: dev
excerpt: "A retrospective on five projects made in collaboration with Claude — from a mining game to a living chemistry simulation."
---

There's a particular satisfaction to building something small and complete. Not a startup, not a product — just a thing that runs, that does what it's supposed to do, that you can point at and say *I made that.*

Over the past several months, working out of a GitHub repository called **deep-mine** and later a separate Python lab, I've shipped five projects in collaboration with Claude. This is a record of what they were, how they came together, and what made each one interesting.

---

## 01 / Deep Mine — Incremental Mining Game

**JavaScript · Game · HTML / CSS**

The first project was also the one that set the tone for everything that followed. Deep Mine is a browser-based incremental game — the kind where you click to collect resources, unlock upgrades, and watch numbers climb while you're not looking.

What makes incrementals compelling as a first project is that they require you to think about systems: resource loops, upgrade trees, progression pacing. There's no single piece of logic that's complicated, but the interplay between all of them has to feel right. Too slow and it's tedious. Too fast and there's nothing to anticipate.

> The whole thing lives in plain HTML, CSS, and JavaScript — no framework, no build step. Open the file, play the game.

It was the right starting point. A contained scope, a clear win condition, and enough complexity under the hood to make building it genuinely interesting.

---

## 02 / Catenary Curve Visualizer

**JavaScript · Math Viz · HTML / CSS**

A hanging chain, a suspension bridge cable, a power line sagging between two poles — they all trace the same curve. Not a parabola, as it's often assumed, but a *catenary*: the shape defined by the hyperbolic cosine function.

This project is a browser tool that lets you input parameters — anchor points, cable length, tension — and watch the curve redraw in real time. It's the kind of thing that makes math tactile. You pull the endpoints apart and the chain flattens; you let them drift together and it droops into a deep arc.

It also marked a shift in the hub's character. The mining game was entertainment; this was something more like an instrument. A tool for understanding something that actually exists in the physical world.

---

## 03 / Sand Particle Simulator

**JavaScript · Simulation · Physics**

Drop sand. Watch it fall. Watch it pile. Pour it into a corner. Block it with a wall and watch it redirect. This simulator runs a cellular automaton where each grain of sand follows a few simple rules — fall down, slide diagonally if blocked, settle when it can't move — and the emergent behavior is weirdly satisfying to watch.

The canvas runs at 60fps. You paint with your cursor. The physics are deliberately approximate — this isn't fluid dynamics, it's a grid, and the charm is that it *feels* right even when it's technically not.

> There's something philosophically interesting about simple rules producing complex-looking behavior. The sand doesn't know it's sand. It's just following three conditions on a grid.

This was the most purely meditative of the browser projects. No goals, no win state. Just falling particles and the occasional avalanche.

---

## 04 / Gray-Scott Reaction-Diffusion Simulator

**Python · Simulation · NumPy**

The first Python project, and a deliberate departure from the browser. This one runs as a desktop application — a `matplotlib` window with live sliders — and it simulates the **Gray-Scott model**: two chemical species, U and V, reacting and diffusing across a grid.

At certain parameter settings, the simulation spontaneously organizes into spots. At others, stripes. At others still, coral-like branching structures that look like something from biology. The chemicals don't know they're making patterns. The math just works out that way.

The sliders let you tune feed rate, kill rate, and diffusion coefficients in real time without resetting the grid. Watch a spot field slowly evolve into worm-like filaments as you drag a single parameter. It's hypnotic in a way that static images can't fully convey.

> The output looks like living organisms. That's not a metaphor — reaction-diffusion is thought to underlie actual animal coat patterns. Turing proposed it in 1952.

This was also the project that proved Python was worth adding to the toolkit. NumPy's vectorized operations make the grid math fast enough to run interactively, which wouldn't be easy to replicate in pure JavaScript.

---

## 05 / Personal Skills Tracker

**React · Persistent Storage · App**

The most personal of the five, and the furthest from simulation. The Skills Tracker is a React application that treats real-world abilities like a role-playing game — each skill has ten well-defined levels, and you advance through them by actually doing the thing.

Cooking goes from *boiling water* to *advanced pastry and live fire techniques*. Hiking runs from short flat trails to multi-day alpine crossings. Rock climbing follows the grade system. Running tracks time-over-distance milestones. You can add custom skills on top of the preloaded library.

The idea behind it is simple and a little subversive: most productivity apps are about tasks. This one is about *becoming* — accumulating capability over months and years, and having a record of it.

---

Five projects down. Each one a little different in character — a game, a math tool, a physics toy, a chemistry simulation, a personal tracker. What they share is that they were all built to be *finished*, which is rarer than it sounds.

The pipeline that made it work: short prompts with clear scope, a willingness to iterate, and Claude doing the heavy lifting while I pointed the direction. The result is a small portfolio I'm genuinely proud of, built in hours instead of weeks.

More to come.
