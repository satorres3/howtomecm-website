# Frontend Content System (BMAD Method Alignment)

## 1. Brief

- **Goal**: Provide a CMS-friendly structure that keeps the existing visual
  design intact while enabling rapid iteration through BMAD workflows.
- **Scope**: Navigation, hero sections, static pages (`about`, `contact`),
  homepage, blog hero, taxonomy, and footer content.
- **Key Benefits**:
  - All user-facing copy lives in `content/` JSON files and MDX posts.
  - Navigation/footer context now flows through `SiteProvider` →
    `Header`/`Footer`.
  - Every page can be edited without touching components, supporting BMAD
    "Design → Dev → QA" loops.

## 2. Map (Content Architecture)

```
content/
├── site/
│   ├── settings.json        # Global metadata, social links, branding
│   ├── homepage.json        # Homepage hero, video highlights, CTA panel, SEO
│   ├── blog.json            # Blog hero & empty-state CTA copy
│   ├── navigation.json      # Primary & secondary navigation links
│   └── footer.json          # Footer intro text + CTA labels
├── pages/
│   ├── about.json           # About page hero + story/metrics/connect cards
│   └── contact.json         # Contact hero, methods, form fields
└── taxonomy/
    ├── categories.json      # Category names, slugs, icons, gradients
    └── tags.json            # Tag metadata
```

- MDX blog posts stay in `content/posts/*.mdx` (no change).
- Author profiles remain JSON under `content/authors/`.

## 3. Act (Implementation Notes)

- **Loader**: `src/lib/site-content.ts`
  - Uses `zod` to validate JSON and supply typed fallbacks.
  - Exposes helpers: `loadSiteSettings`, `loadNavigation`,
    `loadHomepageContent`, `loadBlogPageContent`, `loadAboutPageContent`,
    `loadContactPageContent`, `loadFooterContent`, `loadCategories`, `loadTags`.
- **Context**: `SiteProvider` now tracks `navigation` and `footerContent`
  alongside `homepageContent`.
- **Components Updated**:
  - `Header` pulls navigation links from context; fallback list preserved.
  - `Footer` receives navigation + footer intro CTA copy from layout.
  - `Home`, `Blog`, `About`, `Contact` pages read from JSON-driven content.
- **Forms**:
  - Contact form fields iterate over JSON configuration (`type`:
    `text`/`email`/`textarea`/`select`).
  - Layout classes preserved; column span logic driven by field IDs.
- **Fallback Strategy**: Each loader and page has defaults mirroring the
  previous hard-coded copy to keep first-run experience identical.

## 4. Deliver (How to Use / Extend)

1. **Update Global Copy**
   - Edit `content/site/settings.json` for site name, tagline, social handles.
   - Adjust homepage hero/CTA text in `content/site/homepage.json`.
2. **Navigation Changes**
   - Modify `content/site/navigation.json` and `content/site/footer.json`; no
     component edits required.
3. **Static Pages**
   - `content/pages/about.json`: update hero, story paragraphs, expertise cards,
     connect links.
   - `content/pages/contact.json`: adjust hero text, contact methods, form
     fields.
4. **Blog Hero / Empty State**
   - `content/site/blog.json` controls badges, headings, CTA labels.
5. **Taxonomy**
   - Categories/tags (including icon + gradient) defined in
     `content/taxonomy/*.json` and consumed by both MDX + demo data.
6. **Add New Content**
   - Duplicate an existing JSON file, update fields, and hydrate via new loader
     if needed.
   - MDX posts continue to live under `content/posts/` with frontmatter.

## QA Checklist (BMAD)

- [x] JSON schema validation through `zod` in loaders.
- [x] Context propagation verified (`Header`, `Footer`, hero sections).
- [x] Default fallbacks mirror previous UI copy.
- [x] Contact form renders all configured fields with preserved styling.
- [x] Navigation/CTA links honor `_blank` targets and analytics-friendly URLs.
