# Project Plan

## 1. Vision
Build a browser-only app that teaches and computes John Conway's Doomsday algorithm. The app accepts a Gregorian date and visually explains how the weekday is derived in two phases:
- Phase 1: Find the year's Doomsday.
- Phase 2: Shift from a known doomsday date to the target date using modulo weekday math.

## 2. Product Constraints
- Supported calendar: Gregorian only.
- Supported date range: 1700-2100.
- Browser target: modern browsers only.
- Runtime: static frontend (no backend required for MVP).

## 3. Modes
### Beginner Mode
- Full worked solution with clear intermediate steps.
- Visual aids (calendar + doomsday reference list).
- Explanatory labels for each arithmetic step.

### Expert Mode
- Compact explanation by default.
- Practice flow using step-check prompts.
- Optional hints and reveal-answer controls.

## 4. MVP Scope
### In Scope
- Core doomsday algorithm implementation with tests.
- Mode-aware walkthrough UI (Beginner vs Expert detail levels).
- Mixed rendering approach (HTML/CSS UI + canvas visualization where helpful).
- Dark 8-bit inspired visual style.
- Static AWS hosting (S3 + CloudFront) configured via Terraform.
- GitHub Actions for build/deploy automation.

### Out of Scope (MVP)
- Accessibility compliance work.
- Analytics instrumentation.
- Custom domain.

## 5. Deliverables
- Architecture notes.
- MVP task backlog.
- Running app deployed to AWS target environment.
- Test coverage for critical algorithm and date-boundary paths.
- Launch checklist.

## 6. Milestones (24 Hours)
### 0-2h: Foundation
- Create project scaffold and development scripts.
- Implement core doomsday calculation module.
- Add unit tests for correctness across representative dates.

### 2-8h: Core UX
- Build date input and validation (1700-2100).
- Implement Beginner mode full walkthrough.
- Implement Expert mode compact flow with step-check + hints/reveal.

### 8-14h: Visualization + Polish
- Add doomsday reference panel and calendar-style visual aids.
- Apply dark 8-bit visual theme.
- Tighten error states and edge-case handling.

### 14-20h: Deployment
- Add Terraform for S3 + CloudFront static hosting.
- Configure GitHub Actions for build and deploy.
- Run a clean deployment test.

### 20-24h: Stabilization + Launch
- Regression pass on core workflows.
- Fix high-impact defects.
- Final launch checklist and ship MVP.

## 7. Risks & Mitigation
- Algorithm mistakes: lock correctness with unit tests and known-date fixtures before UI polish.
- Timeline pressure: prioritize functional correctness and mode behavior over visual extras.
- AWS setup delays: keep hosting architecture minimal (static assets only).

## 8. Success Metrics (MVP)
- MVP shipped within 24 hours.
- Correct weekday output for tested dates in 1700-2100.
- Beginner and Expert flows both functional end-to-end.
- Successful static deployment to S3 + CloudFront.

## 9. Start-Now Task List
- [ ] Scaffold frontend project and tooling.
- [ ] Implement `doomsday` calculation module and tests.
- [ ] Build mode toggle and date entry workflow.
- [ ] Implement Beginner full walkthrough rendering.
- [ ] Implement Expert step-check + hints/reveal flow.
- [ ] Add reference dates panel and visualization.
- [ ] Add Terraform for S3 + CloudFront.
- [ ] Add GitHub Actions build/deploy workflow.
