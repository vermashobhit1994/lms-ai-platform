# LMS-AI

AI-augmented ***Learning Management System(LMS)  with AI Tutor** designed, developed, tested, deployed, maintained by **Vertex Learning Technologies Pvt Ltd**

![Hero Screenshot](docs/screenshots/hero.png)


[![CI](https://github.com/vermashobhit1994/lms-ai-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/vermashobhit1994/lms-ai-platform/actions)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](./LICENSE)

**[Live Demo →]()**

## What're problems in traditional LMS platform?
Traditional LMS platform (i.e. Moodle-style, corporate e-learning portals) are **passive content repositories.**

Students consume video and text but have **no immediate, contextual help** when they get stuck, no adaptive pacing, and no visibility into their own **weak areas** until a graded assessment tells them — often too late to act on it.

## What problem does LMS-AI solves?
1. **Reduce the doubt resolution latency** for a learner from hours/days (waiting on an instructor or forum reply) to seconds, using an AI tutor grounded in the actual course content.
2. **Increase course completion rate** through personalized study plans, streaks, and gamification
3. Give instructors **data-driven visibility** into where students are struggling, at a topic level, not just a course level.4. Provide admins with a **governance layer** (course approval, content moderation, subscription/revenue tracking) suitable for a platform that intends to rd third-party instructors

## What's LMS-AI ?

Platform that goes beyond **static video hosting and quiz delievery**. 

It's AI-augmented ***Learning Management System(LMS)  with AI Tutor*** that combines conventional LMS capabilities i.e. course authoring, enrollements, 
assignments, assessments, certification - with embedded AI tutor that uses 
**Retrieval-Augmented Generation(RAG)** over each course's own material to 
1. answer student's questions
2. generate summaries
3. auto-create quizzes
4. adapt difficulty to the learner

The system is architected as **multi-tenant** ready SaaS product with 3 primary classes
1. Students
2. Instructors
3. Admins

For each of above classes, has **distinct workspace**. 

## **Architectural Patterns** for production System
1. RBAC
2. background jobs
3. vector search
4. caching
5. containerization

## Project Setup instructions
### Steps to run Frontend
### Steps to run Backend

## Features / Scope
1. Auth (JWT-based, role-based access control)
2. Student dashboard, course catalog, enrollment, progress tracking
3. Video lecture streaming (pre-recorded, chunked/progressive delivery)
4. Notes, marks, assignment submission, quiz/assessment engine
5. Certificates (auto-generated PDF), streaks, badges
6. AI tutor chat (RAG-based, context-aware, per-course knowledge base)
7. AI-generated lesson summaries, flashcards, auto-quiz generation
8. Difficulty-adjusted explanations (beginner / intermediate / advanced)
9. Personalized recommendation engine (rule-based + embedding similarity)
10. Instructor course authoring, material upload, analytics dashboard
11. Admin panel: user management, course approval, platform analytics, role management, content moderation
12. Discussion forum (per-course, threaded)
13. Notifications (in-app + email)
14. Dark mode, basic i18n scaffolding


## LMS-AI success metrics (KPIs)

1. Course completion rate
    - +25% vs. baseline (no-AI control group)
2. Average doubt resolution time
    - Under 10 seconds (AI tutor response)
3. Quiz auto-generation accuracy (human-reviewed)
    - ≥ 85% usable without edits
4. Student daily active usage (7-day streak retention)
    - ≥ 40%
5. API p95 latency (non-AI endpoints)
    - Under 300ms


## Tech Stack Decisions

## Design Decisions

## Assumptions made


## Quick Start

## Environment Variables

## Architecture

## Testing

## Roadmap

## Screenshots


## Future Enhancements
1. Live video conferencing / collaborative whiteboard <br>
   Live classes with video conferencing (WebRTC-based, e.g., via a managed SFU) and an integrated collaborative whiteboard.
2. Real time peer-to-peer study rooms <br>
   Real-time peer-to-peer study groups with matchmaking based on course/topic overlap.
3. AI plagiarism detection engine <br>
   AI plagiarism detection for code and text assignment submissions, using embedding similarity against a submission corpus.
4. Full payment gateway / subscription billing integration <br>
   Full payment gateway integration (subscriptions, one-time course purchases, instructor payouts).
5. Native mobile apps (React Native) reusing the existing REST API surface.
6. Offline-first content sync for downloaded lectures on mobile.
7. Full multilingual UI + AI tutor responses in regional languages.
8. Advanced analytics: cohort analysis, predictive at-risk-student flagging.
9. Marketplace features: instructor payout dashboards, coupon codes, affiliate tracking.
10. Adaptive learning paths that dynamically re-order modules per learner rather than only adjusting quiz difficulty.
11. Voice-based AI tutor interaction (speech-in, speech-out) for accessibility and mobile use.
12. SSO / SAML integration for institutional (university) deployments.



## License
Proprietary - See LICENSE.md



