# Mobile Polish Pass — ECONOBEN.DEV

## Context

A Playwright-based mobile audit at 390x844 (iPhone 14 Pro) revealed pervasive spacing, redundancy, and density issues across the site. The desktop redesign work from the April 11-12 session is solid, but mobile was not audited during that pass. This plan addresses every mobile-specific issue found.

**Branch**: `feat/site-current-review`
**Base**: current HEAD on `feat/site-current-review`
**Review server**: `http://localhost:3000` with `npx next dev --webpack -p 3000`

## Validation Commands
- `npx next dev --webpack -p 3000`
- Visual verification at 390px viewport width in browser

## Constraints
- Do NOT change desktop layout (all changes must be behind `md:` or `lg:` breakpoints, or use mobile-only classes)
- Do NOT change page content or wording
- Do NOT refactor component structure — CSS/className changes only
- Verify desktop is unchanged after each task by checking at 1440px width

---

## Phase 1: Global Shell & Nav

### Task 1: Tighten mobile nav pill sizing

- [x] Reduce mobile nav pill font size from `text-[10px]` to `text-[9px]` and padding from `px-3 py-1.5` to `px-2.5 py-1` in `mobileNavItemClassName` in `app/components/EditorialPageFrame.tsx`
- [x] Reduce gap between pills from `gap-2` to `gap-1.5` in the mobile nav scroll strip
- [x] Verify nav still scrolls horizontally and active pill is visually distinct
- [x] Verify desktop nav is completely unchanged at 1440px

### Task 2: Fix ScrollToTop button overlap

- [x] In `app/components/ScrollToTop.tsx`, add `z-50` and ensure the button doesn't overlap content on mobile
- [x] If the button uses `fixed bottom-X left-X`, increase bottom offset to clear the mobile contact section
- [x] Verify the button is accessible and doesn't cover interactive elements

### Task 3: Tighten mobile footer spacing

- [x] In `app/components/EditorialPageFrame.tsx`, reduce footer padding on mobile: change `py-5` to `py-4` and `gap-4` to `gap-3` for the footer container on small screens
- [x] Ensure footer links don't wrap awkwardly at 390px

---

## Phase 2: Home Page

### Task 4: Tighten home page hero buttons on mobile

- [ ] In `app/components/ShellHomePage.tsx`, make "FOLLOW THE BOOK" and "BROWSE SELECTED WRITING" buttons full-width on mobile by adding `w-full sm:w-auto` class
- [ ] Reduce button text size on mobile if needed for readability
- [ ] Verify the featured post card stacks cleanly below the hero text

### Task 5: Tighten Current Focus cards on mobile

- [ ] In `app/components/ShellHomePage.tsx`, reduce padding inside Current Focus cards from `p-7` to `p-5` on mobile by using `p-5 md:p-7`
- [ ] Ensure stat labels at bottom of cards don't clip

### Task 6: Tighten Selected Work cards on mobile

- [ ] In `app/components/ShellHomePage.tsx`, reduce card padding from `p-8` to `p-5 md:p-8` for the selected work cards
- [ ] Ensure "Read the post" / "Follow the book" buttons have consistent spacing from bottom

---

## Phase 3: About Page

### Task 7: About page mobile spacing

- [ ] In `app/about/page.tsx`, reduce section padding from `px-8` to `px-5 md:px-8` on all sections
- [ ] Reduce the hero top padding from `pt-16 md:pt-24` to `pt-10 md:pt-24`
- [ ] Ensure the photo doesn't overflow its container at 390px

### Task 8: About page mobile highlights

- [ ] The two-column highlights grid should be single column on mobile — verify `md:grid-cols-2` is working correctly
- [ ] Reduce spacing between highlight items if too loose on mobile

### Task 9: About page mobile experience section

- [ ] Experience entries: ensure the role title and date don't overlap on small screens
- [ ] The `flex-col md:flex-row md:items-baseline md:justify-between` pattern should stack properly — verify
- [ ] Reduce bullet text size slightly on mobile if lines are too long

---

## Phase 4: Talks Page

### Task 10: Remove redundant "OPEN PLAYER" button on mobile

- [ ] In `app/talks/TalksClient.tsx`, the `FeaturedTalk` component shows a Spotify embed AND an "Open player" button/span below it — hide the button on mobile when the embed is already visible
- [ ] Add `hidden` class to the "Open player" span for Spotify-only talks, or remove it entirely since the embed IS the player
- [ ] Keep "Listen on Spotify" external link and "Transcript" link visible

### Task 11: Tighten talks archive cards on mobile

- [ ] In `app/talks/TalksClient.tsx`, reduce card padding in the `TalkCard` component from `p-5` to `p-4` on mobile
- [ ] Ensure date/event labels don't overlap with the card edges
- [ ] The Spotify embed in grid cards (152px height) should be full-width — verify

### Task 12: Tighten topic filter pills on mobile

- [ ] The filter pills row ("ALL TALKS", "AI", "AGENTS"...) should scroll horizontally on mobile — verify the existing `overflow-x-auto` is working
- [ ] Reduce pill padding if they feel oversized on 390px

---

## Phase 5: Posts Page

### Task 13: Posts grid cards mobile padding

- [ ] In `app/posts/PostsList.tsx`, reduce grid card padding from `p-6` to `p-4 md:p-6`
- [ ] The `PostIllustration` component height (80px) may be too tall relative to content on mobile — consider reducing to 60px on mobile
- [ ] Verify cards still have equal height and "Read the post" stays at bottom

### Task 14: Post detail page mobile spacing

- [ ] In `app/posts/[slug]/page.tsx`, reduce hero section horizontal padding from `px-8` to `px-5 md:px-8`
- [ ] The action buttons ("Back to posts", "Browse this topic", "Browse this month") should stack vertically or wrap cleanly at 390px
- [ ] The cover image should have a small border-radius on mobile for visual consistency
- [ ] Reduce article body padding from `px-8` to `px-5 md:px-8`

---

## Phase 6: Publications Page

### Task 15: Publications mobile card spacing

- [ ] In `app/publications/page.tsx`, verify publication cards stack cleanly on mobile
- [ ] Reduce card padding if needed
- [ ] Ensure cover images don't overflow on 390px

---

## Phase 7: Tags & Search

### Task 16: Tags page mobile density

- [ ] In `app/tags/page.tsx`, reduce the "Top tags" grid to single column on mobile — verify `sm:grid-cols-2` doesn't kick in too early
- [ ] The alphabetical index letter-pill rows should wrap cleanly — verify
- [ ] Reduce section padding from `p-6 md:p-8` to `p-4 md:p-8` on mobile

### Task 17: Search page mobile spacing

- [ ] In `app/search/page.tsx`, reduce header section padding
- [ ] The "Start with a topic" starter tips grid should be single column on mobile — verify `sm:grid-cols-3` stacks properly
- [ ] Reduce padding inside sticky-note cards on mobile

---

## Phase 8: Code & Tools Page

### Task 18: Code & Tools mobile density

- [ ] In `app/code-ai/page.tsx`, reduce the per-card button stack ("OPEN DETAIL PAGE" + "SHOW PREVIEW") — on mobile, consider making them a single row or reducing to one primary button
- [ ] The category pills section is too dense — reduce padding and gap
- [ ] The "ARCHIVE / READER" toggle should be smaller on mobile
- [ ] Reduce card padding from whatever it is to `p-4` on mobile

---

## Phase 9: Book Page

### Task 19: Book page mobile polish

- [ ] In `app/book/page.tsx`, verify the status cards ("In progress", "O'Reilly Media", etc.) stack cleanly
- [ ] The book cover image should be centered and not too wide on mobile
- [ ] Reduce hero section padding on mobile
- [ ] "GET BOOK UPDATES" and "SEE RELATED WORK" buttons should be full-width on mobile

---

## Phase 10: Archive Pages

### Task 20: Archive mobile spacing

- [ ] In `app/archive/page.tsx`, verify the year groups and month links stack properly on mobile
- [ ] In `app/archives/[month]/page.tsx`, reduce padding and verify post listings don't overflow
- [ ] Ensure breadcrumb navigation wraps cleanly

---

## Phase 11: Final Validation & PR

### Task 21: Full mobile regression check

- [ ] Run Playwright screenshots at 390x844 for all pages: `/`, `/about`, `/posts`, `/posts/[slug]`, `/talks`, `/publications`, `/book`, `/tags`, `/tags/[tag]`, `/search`, `/archive`, `/code-ai`
- [ ] Run Playwright screenshots at 1440x900 for all the same pages to confirm desktop is unchanged
- [ ] `npx next dev --webpack -p 3000` — verify no build errors or console errors
- [ ] Create PR: `gh pr create --title "fix: comprehensive mobile polish pass" --body "Mobile audit findings from 390px Playwright screenshots. Tightened spacing, removed redundant elements, improved density across all pages. Desktop unchanged."`
