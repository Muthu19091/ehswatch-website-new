# FE Handoff — CMS-consumption + hardcoded content fixes

Consolidated list of issues surfaced during the July CMS content audit
that need **frontend code changes**. In every case the CMS payload is
correct — the FE is either ignoring the CMS response, hardcoding copy
directly in the component, or missing a rendering slot.

**URLs**
- Stage: `https://stage.odigma.ooo/ehswatch-stage`
- Prod:  `https://ehswatch.com`
- CMS API: `https://stage.odigma.ooo/ehswatch-cms/api/v1/pages/{slug}`

---

## Ownership summary

| Category | Count |
|---|---|
| Home page — 10 items | FE dev |
| About page — 6 items | FE dev |
| Product page — 3 items | FE dev |
| IRIS page — 1 item | FE dev |
| Industries page — 3 items | FE dev |
| Solutions-v2 route — cleanup | FE dev |
| Missing videos — upload to CMS | Client / content team |
| Session-expiry redirect | Backend (CMS) — separate task |

---

## Universal fix pattern

Every page component should consume the CMS payload passed as props from the parent `app/{page}/page.tsx`.

```jsx
// Parent (app/product/page.tsx)
const page = await fetch(`${API}/pages/product`).then(r => r.json());
const hero = page.data.attributes.content.find(b => b.type === 'hero');
const imageText = page.data.attributes.content.find(b => b.type === 'image_text');

return (
  <>
    <ProductHero cms={hero.data} />
    <ProductOverview cms={imageText.data} />
  </>
);

// Component (components/sections/ProductOverview.tsx)
export default function ProductOverview({ cms }) {
  return (
    <section>
      {cms.heading && <h2 dangerouslySetInnerHTML={{__html: cms.heading}} />}
      {cms.subheading && <p>{cms.subheading}</p>}
      {cms.body && <div dangerouslySetInnerHTML={{__html: cms.body}} />}
      {cms.cta && <Link href={resolveCta(cms.cta)}>{cms.cta.label}</Link>}
    </section>
  );
}

// Helper: resolve CMS cta object → URL that respects Next.js basePath
function resolveCta(cta) {
  if (cta.type === 'url') return cta.url;
  if (cta.type === 'internal') return `/${cta.page_slug || cta.slug || ''}`;
  if (cta.type === 'anchor') return cta.anchor;
  if (cta.type === 'external') return cta.url;
  return '#';
}
```

**Critical**: wrap CTA links in Next.js `<Link>` — it auto-prepends `basePath` from `next.config.js` so `/about` becomes `/ehswatch-stage/about/` on stage and `/about/` on prod. Raw `<a href>` doesn't do this.

---

## Home page (`/`)

### 1. Testimonials — heading + subheading + cards ignore CMS

**File:** `components/sections/Testimonials.tsx`

- Line ~90 hardcodes heading fallback: `{title ?? <>What Our Customers Say</>}` (parent passes no `title` prop → fallback always fires)
- Lines 5-42 hardcode a `TESTIMONIALS` array — ignores CMS testimonials pool

**CMS payload:**
- `pages.home.content[testimonials].data.heading` + `.subheading`
- `/api/v1/testimonials` returns 9 real client testimonials with `author_name`, `author_role`, `author_company`, `quote`

### 2. Trusted Logos — heading missing on FE

Component renders logos but never renders `data.heading`. CMS has `"Trusted by Teams Across Industries"`.

### 3. Hero — 3rd CTA "Pricing" not rendered

Currently reads only `primary_cta` + `secondary_cta`. CMS now has `tertiary_cta` (Pricing button pointing to page_id 19).

### 4. Tab CTAs render `href="null"` / `href="#"`

**File:** `OnePlatform.tsx` (or the `tabs_carousel` renderer)

CMS has each tab's `cta.url` set — the renderer just doesn't consume it.

### 5. Image+Text CTA "Explore AI Modules" renders `href="#"`

**File:** `AISection.tsx` — doesn't consume `data.cta.url`.

### 6. Solution Carousel — section CTA missing

No section-level CTA rendered. CMS has `data.cta = { label: "See How EHSWatch Fits Your Industry", type: "internal", page_id: "30" }`.

### 7. basePath prefix missing on internal CTAs

Renders `<a href="/about">` instead of `<a href="/ehswatch-stage/about/">`. Fix: use Next.js `<Link>`.

---

## About page (`/about`)

**All 6 items are hardcoded copy in About components. CMS is already correct.**

### 1. Hero subhead
**File:** `AboutHero.tsx:85`
`<p>The intelligent EHSQ platform trusted by 25K+ teams — making safety faster, simpler and more visible.</p>`
CMS: `"The intelligent EHSQ platform trusted by 25K+ teams worldwide."`

### 2. "Two decades of building better safety."
**File:** `AboutStory.tsx:72` — hardcoded subheading. CMS `image_text.subheading` is null.

### 3. About EHSWatch body
**File:** `AboutContent.tsx` (or similar) — hardcoded short body. CMS has full 4-paragraph body.

### 4. "Purpose Behind Every Feature" → "What Drives Us"
Heading hardcoded. CMS already has `"What Drives Us"`.

### 5. Mission trailing "across every team and site."
Hardcoded suffix. CMS description doesn't have it.

### 6. Vision trailing "— where protection is built into every process..."
Hardcoded suffix. CMS description doesn't have it.

---

## Product page (`/product`)

### 1. "No gaps. No silos. No workarounds." subheading
**File:** `ProductOverview.tsx:13` — hardcoded. CMS `image_text.subheading` is null.

### 2. Intro body — 2-paragraph old version
**File:** `ProductOverview.tsx:20` — hardcoded old 2-paragraph body. CMS has single-paragraph client-approved version.

### 3. How-It-Works subheading
**File:** `ProductHowItWorks.tsx:645` — hardcoded old em-dash version. CMS has updated comma version with "Once your forms, workflows and sites are set up…" appended.

---

## IRIS page (`/iris`)

### 1. "Human attention, manual processes and scattered data create dangerous gaps."
**File:** `IrisPage.tsx` lines **1225 and 1586** (two occurrences)
Both hardcoded. CMS `icon_features.subheading` is null.

---

## Industries page (`/industries`)

### 1. Section heading not rendered
**File:** Industries `solution_carousel` renderer
CMS `data.heading` is populated but component ignores it.

### 2. Industry card names hardcoded (Home fixed, Industries page didn't)
- `Industries.tsx:31, 45` — "Logistics, Warehousing" + "Utilities and Public Services"
- `SolutionsIndustries.tsx:57, 79` — same
- `WorkEnvironments.tsx:46, 53` — same

**Should be (per CMS + design doc):**
- `Logistics, Ports & Transport`
- `Energy & Utilities`
- `Construction & Infrastructure Projects` (add "Projects" suffix)

### 3. Videos hardcoded to public folder
**File:** `SolutionsZigzag.tsx:6` — `const VID = basePath + "/images/Solutions_/Videos/";`

Each industry card references a hardcoded `.mp4` path.

**6 videos exist**: construction, manufacturing, oil-gas-energy, logistics-warehousing-transport, facilities-property-management, utilities-and-public-services

**4 missing** (doc says 10 industries, FE has only 6):
- `aviation.mp4`
- `mining-metals.mp4`
- `healthcare-medical-centres.mp4`
- `food-beverage.mp4`

**Ownership**: content team uploads videos to CMS Media Library; FE dev updates `VID` references OR refactors to consume `pages.industries.content[solution_carousel].cards[i].video`.

---

## Solutions-v2 route (`/solutions-v2`)

**`solutions` → `industries` is the canonical name going forward.**

- `/solutions-v2` has NO CMS entry — the entire route is hardcoded FE.
- **Actions:**
  1. Delete `app/solutions-v2/` route
  2. Add redirect: `/solutions-v2` + `/solutions` → `/industries`
  3. Point nav/footer links from `/solutions` → `/industries`
  4. Rename FE files: `SolutionsHero.tsx` → `IndustriesHero.tsx`, `SolutionsZigzag.tsx` → `IndustriesGrid.tsx`, etc.
  5. Refactor renamed components to consume `pages.industries` from CMS

---

## Media inventory — what content team should upload to CMS

| Video | Status |
|---|---|
| construction-infrastructure.mp4 | ✅ have (rename to match new naming?) |
| manufacturing-engineering.mp4 | ✅ have |
| oil-gas-energy.mp4 | ✅ have |
| logistics-warehousing-transport.mp4 | ✅ have (rename to `logistics-ports-transport` per new naming) |
| facilities-property-management.mp4 | ✅ have |
| utilities-and-public-services.mp4 | ✅ have (rename to `energy-and-utilities` per new naming) |
| **aviation.mp4** | ❌ missing |
| **mining-metals.mp4** | ❌ missing |
| **healthcare-medical-centres.mp4** | ❌ missing |
| **food-beverage.mp4** | ❌ missing |

---

## Content components that ignore CMS — refactor priority

| Component | CMS source | Priority |
|---|---|---|
| **Testimonials.tsx** | `/api/v1/testimonials` + `pages.home.content[testimonials]` | **High** |
| **AboutHero.tsx** | `pages.about.content[hero]` | **High** |
| **AboutStory.tsx** | `pages.about.content[image_text]` | **High** |
| **AboutDrives.tsx** | `pages.about.content[icon_features]` | **High** |
| **ProductOverview.tsx** | `pages.product.content[image_text]` | **High** |
| **ProductHowItWorks.tsx** | `pages.product.content[number_steps]` | **High** |
| **ProductModules.tsx** | `/api/v1/product-modules` + `pages.product.content[product_modules]` | **High** |
| **IrisPage.tsx** | `pages.iris` (all blocks) | **High** — 180 hardcoded items |
| **IRISChatShowcase.tsx** | tie to `pages.iris.content[number_steps]` | Medium |
| **OnePlatform.tsx** | `pages.home.content[tabs_carousel]` | Medium |
| **AISection.tsx** | `pages.home.content[image_text]` | Medium |
| **SolutionsHero.tsx** | refactor to consume `pages.industries.content[hero]` | High |
| **SolutionsZigzag.tsx** | refactor to consume `pages.industries.content[solution_carousel]` | High |
| **SolutionsIndustries.tsx** | Same as above | High |
| **PricingOverview.tsx** | needs CMS block wiring | Medium |
| **PricingFAQ.tsx** | Same | Medium |
| **Blogs.tsx** | `pages.home.content[blog_highlights]` + `/api/v1/blog-posts` | High |
| **BlogGrid.tsx** | `/api/v1/blog-posts` | High |
| **BlogPost.tsx** | `/api/v1/blog-posts/{slug}` | High |
| **CaseStudiesGrid.tsx** | `/api/v1/case-studies` | High |
| **ContactPage.tsx** | `/api/v1/forms/contact` + `pages.contact-us` | Medium |
| **SupportContact.tsx** | `pages.support` | Medium |
| **ActionTrackerPage.tsx** | `/api/v1/product-modules/action-tracker` | Medium |
| **PainPoints.tsx** | `/api/v1/pain-points` | Low |
| **Industries.tsx** | Same as SolutionsIndustries | High |

**No action needed** — pure UI: `HeroDashboard.tsx`, icon SVGs, section backgrounds, `HeroLight.tsx`.

---

## Test URLs

- Home:       `https://stage.odigma.ooo/ehswatch-stage/`
- About:      `https://stage.odigma.ooo/ehswatch-stage/about`
- Product:    `https://stage.odigma.ooo/ehswatch-stage/product`
- IRIS:       `https://stage.odigma.ooo/ehswatch-stage/iris`
- Industries: `https://stage.odigma.ooo/ehswatch-stage/industries`

- CMS API base: `https://stage.odigma.ooo/ehswatch-cms/api/v1`
- Page envelope: `GET /pages/{slug}` → returns `content` array of blocks
- Testimonials: `GET /testimonials`
- Blog posts:   `GET /blog-posts`
- Modules:      `GET /product-modules`

After fixes, hard-refresh each page and confirm rendered copy matches
the CMS payload — not the old hardcoded copy.
