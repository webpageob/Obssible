# CLAUDE.md — Obssible Website

This workspace is **the landing page only**. Content production (YouTube, ebook,
courses) lives in `../obssible-content` and is managed in its own session.

Design and screenshot rules: `brand_assets/CLAUDE.md`.
Brand framework, voice, and decision history: `../obssible-content/`.

---

## What Obssible is

Obssible helps people turn what they know and experience into something useful,
ship it into the real world, learn from what actually happens, and get better
through repeated execution.

**Audience: global. Site language: English.** The user and Claude converse in
Korean; all site copy is English.

Owner: Junwoo Park — digital education entrepreneur, based in Korea, sole proprietor.

---

## Non-negotiable rules for site copy

**Never invent** revenue, results, customer counts, testimonials, case studies, or
authority. He has not yet earned significant revenue from Obssible and has not
completed a sale. Copy must present him as someone building it, not someone who
has arrived.

**Banned vocabulary:** secret, hack, nobody talks about this, changed my life,
guaranteed, effortless, overnight, get rich quick. The brand reads honest,
practical, calm, ambitious, evidence-driven.

**Never link to something that doesn't exist** — no product pages, lead magnets,
or signup flows until they are real.

**Never state payment-provider availability, legal status, tax treatment, or fees
without verifying them now.** This area changes and past answers go stale.

## How to work with this user

- Plain language, no jargon.
- **Make the next action obvious. Don't bury the decision in a long explanation.**
- State costs and numbers explicitly.
- When comparing options: key numbers, main trade-off, one recommendation.
- Don't over-engineer. Smallest useful thing first.

---

## Stack and deploy

- Single `index.html`, Tailwind via CDN, all styles inline. No build step.
- `node serve.mjs` → serves project root at `http://localhost:3000`
- `node screenshot.mjs http://localhost:3000 [label]` → saves to `temporary screenshots/`
- Push to `master` on `webpageob/Obssible` (private) → Netlify auto-deploys to
  obssible.com. `netlify.toml` publishes the root as-is.

`serve.mjs` blocks `temporary screenshots/` from being served. `.gitignore`
excludes it along with `node_modules/` and `server.log`. Keep both that way —
working screenshots must never ship.

## Current state — 2026-08-11

- obssible.com live over HTTPS (Let's Encrypt via Netlify, auto-renews). Domain
  registered at Porkbun.
- Design: Apple-homepage structure — white, SF Pro stack, blue pill CTAs,
  alternating white/gray/gradient/black sections. Content is all Obssible's own.
- CTAs now resolve. The closing `#join` section holds a Netlify Forms email capture
  (form name `updates`, AJAX submit, inline success). Every `href="#"` dead link is
  gone; buttons read "Get updates", not "Join Obssible" — there is nothing to join.
- **Open gap: no product, and no privacy policy** even though the site now collects
  email addresses from a global audience. Legal footer column was removed rather
  than left pointing nowhere.
- After any deploy touching the form: confirm Netlify picked it up (Forms tab) and
  check whether the account is legacy (100 submissions/month) or credit-based.
