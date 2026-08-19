# Arabic Translations — How to Add or Edit

This guide explains how Arabic wording is controlled on the EHSWatch site, and how to
provide or change the Arabic for specific English words.

---

## Where Arabic comes from — two sources

When a visitor switches the site to Arabic, the Arabic text comes from **two** places:

### 1. Page & content text → the CMS  *(no developer needed, goes live instantly)*
Marketing copy — page headings, body text, blog posts, case studies, module
descriptions, testimonials, footer text — is translated **in the CMS admin** using the
Arabic (`_ar`) field on each record. Edits here are **live immediately**: no code change,
no deploy. **This is where the bulk of translation belongs.**

### 2. Fixed UI words & translation corrections → one code file
A small set of fixed interface strings (buttons, form labels, some headings) and any place
where you want to **override the automatic (Google) translation** with your own wording
live in a single code file:

```
components/layout/ArabicOverrides.tsx
```

Anything **not** listed in that file is auto-translated by Google Translate. Entries in the
file **override** that machine translation with your authored Arabic.

> ⚠️ Because this is code, changes here need a **rebuild + redeploy** (a developer applies
> them) — they do **not** update instantly like the CMS.

---

## How the code overrides behave
- Each entry maps the **exact English text → your Arabic**.
- When Arabic is active the site shows your Arabic; back on English it shows the English.
  Fully reversible.
- Delete an entry → that string goes back to automatic translation.
- Brand names (EHSWatch, IRIS, …) are kept in English inside translated content
  automatically — **no action needed**.

---

## Which list to use (inside `ArabicOverrides.tsx`)

| If the word is… | Add it to this list | Example line to add |
|---|---|---|
| A normal word / phrase / heading / button / nav label / FAQ | `EN_TO_AR` | `"Explore": "استكشاف",` |
| A **form field label** | `LABEL_EN_TO_AR` | `"Full Name": "الاسم الكامل",` |
| A string that contains **HTML** (line breaks, coloured spans) | `EN_TO_AR_HTML` | copy the format of an existing row |
| A string whose **direction** looks wrong (brand-first phrases) | add the English to `FORCE_LTR` or `FORCE_RTL` | `"EHSWatch: One Platform for Everyday Safety",` |

**Rule:** the English on the left must match the wording on the page (punctuation included;
extra spaces are fine).

---

## Glossary — list your words here for the developer

Fill in the **English exactly as it appears on the site** and the **Arabic** you want.
Hand this back and a developer will add them to `EN_TO_AR` in `ArabicOverrides.tsx` and
redeploy. (For full page copy, use the CMS Arabic fields instead — see source #1 above.)

| English (exact) | Arabic | Where it appears / notes |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
| *(add more rows as needed)* |  |  |

---

## Quick reference for the developer
- File: `components/layout/ArabicOverrides.tsx` (mounted globally in `app/layout.tsx`).
- Maps: `EN_TO_AR` (general), `LABEL_EN_TO_AR` (form labels), `EN_TO_AR_HTML` (HTML strings),
  `FORCE_LTR` / `FORCE_RTL` (direction), `AR_FIX` (match on machine-Arabic when there is no
  stable English source).
- Matching is on the whitespace-normalised English source; entries tag the element
  `translate="no"` so Google leaves it alone and inject the authored Arabic when Arabic is
  active.
- Brand-in-English behaviour: `lib/text.ts → keepBrandsEnglish()`.
- Changes require build → deploy (they are compiled into the app, unlike CMS `_ar` content).
