
<img src="assets/readme/hero.svg" width="100%" alt="UX Archeologist — an agent that excavates UI bugs from screen recordings and hands you a failing Playwright test plus the fix" />

<p align="center">
  <img src="https://img.shields.io/badge/model-Gemini_3_Flash_%2B_Pro-f59e0b?style=for-the-badge&labelColor=0f172a" alt="Gemini 3 Flash + Pro" />
  <img src="https://img.shields.io/badge/output-Playwright_%2B_Fix-10b981?style=for-the-badge&labelColor=0f172a" alt="Playwright script + code fix" />
  <img src="https://img.shields.io/badge/stack-React_19_%2B_Vite-334155?style=for-the-badge&labelColor=0f172a" alt="React 19 + Vite" />
</p>

## What it is

Bug reports are usually a screen recording and a shrug: "it does this weird thing sometimes." Someone still has to watch the clip, figure out the exact frame where things go wrong, write a test that reproduces it, then write the fix.

**UX Archeologist** does that triage for you. Upload the clip. It digs through the footage frame by frame, marks the exact moment the UI diverges from expected behavior, and comes back with a Playwright script that reproduces the bug on demand plus a suggested code fix.

## How it works

<img src="assets/readme/divider.svg" width="100%" alt="" />

<img src="assets/readme/flow.svg" width="100%" alt="Pipeline: video goes to Gemini 3 Flash for fast frame-by-frame analysis with thinking disabled, producing a report and thought signature, which is handed to Gemini 3 Pro with a high thinking budget to produce a Playwright script, a code fix, and an explanation" />

It's a two-model relay, not one big prompt:

- **Gemini 3 Flash** does the first pass — thinking disabled, optimized for speed — scanning the recording frame by frame and logging a timestamped event trail. The moment it spots the divergence, it writes a `thoughtSignature`: a compact technical description of what it saw and why, built specifically to carry context into the next call.
- **Gemini 3 Pro** picks up that signature — thinking budget cranked up — and does the actual engineering: writes a Playwright test that fails exactly the way your bug does, drafts a fix, and explains the root cause in plain language.

Splitting it this way means you're not paying deep-reasoning cost for the part of the job that's just pattern-matching pixels, and you're not asking a fast model to reason about root causes it can't actually verify.

## What you get back

<img src="assets/readme/divider.svg" width="100%" alt="" />

- **A timestamped timeline** of the recording — what happened, what was observed, and which moment is flagged as the failure.
- **A Playwright script (TypeScript)** that reproduces the bug, ready to drop into a test suite.
- **A suggested code fix** for a typical React/Next.js component.
- **A plain-language explanation** of the root cause, so the fix isn't a black box.

## Stack

<img src="assets/readme/divider.svg" width="100%" alt="" />

Verified against `package.json` and the source:

| Layer | Tech |
|---|---|
| Framework | React 19, Vite |
| Language | TypeScript |
| AI | `@google/genai` — Gemini 3 Flash (analysis) + Gemini 3 Pro (reasoning) |
| Output target | Playwright (TypeScript) |

## Run it locally

<img src="assets/readme/divider.svg" width="100%" alt="" />

**Prerequisites:** Node.js, a Gemini API key.

```bash
git clone https://github.com/akhilreddy59/UX-Archeologist.git
cd UX-Archeologist
npm install
```

Set your key as `API_KEY` in the environment (the app reads `process.env.API_KEY`), then:

```bash
npm run dev
```

## Limits worth knowing

<img src="assets/readme/divider.svg" width="100%" alt="" />

- Video uploads are capped around 20MB (inline base64 to the API) — compress or trim before uploading.
- Best results on clips under a minute; longer or corrupted files get rejected before the API call.
- This is a diagnosis tool, not a guarantee — the generated fix is a *suggestion* to review, not a patch to merge blind.

## Status

<img src="assets/readme/divider.svg" width="100%" alt="" />

Solo project, active development. No license file yet — treat the code as all-rights-reserved until one is added.
