# RightTrack

Claims & Requests Status Tracking Platform — a React + Vite + Tailwind app with an
Applicant view, an Adjuster (admin) console, SLA-governed claim tracking, and a
Developer/API reference page.

## Stack

- React 18 (function components + hooks)
- Vite
- Tailwind CSS
- lucide-react (icons)

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                screen/router state + top-level data flow
  index.css              Tailwind + design tokens + shared component classes
  lib/
    data.js               mock claims
    constants.js           status/category/rejection-code lookup tables
    helpers.js             formatters + SLA math
  hooks/
    useReveal.js           IntersectionObserver-driven scroll-reveal + scrollY hook
  components/              shared building blocks (Logo, Sidebar, Topbar, Card,
                            Modal, Toast, BearingTracker, Charts, FileDrop, ...)
  pages/
    Landing.jsx             marketing page with scroll animations
    Auth.jsx                SignUp / Login / VerifyEmail
    applicant/              Dashboard, NewClaim wizard, MyClaims, ClaimDetail, RatingModal
    admin/                  Dashboard, Queue, ClaimReview
    ApiDocs.jsx              REST/webhook reference + integration diagram
public/
  logo-navy.png, logo-white.png, icon-navy.png, icon-white.png, favicon.png
                            extracted directly from the brand assets you supplied
```

## Notes

- All data is in-memory mock data (`src/lib/data.js`) — decisions, re-uploads,
  and role switches update shared React state in `App.jsx`, so the Applicant
  and Adjuster views stay in sync in real time, same as the spec asked for.
- Sign up / Login / Verify email are UI-complete but not wired to a real
  backend — submitting either one just moves you into the app.
