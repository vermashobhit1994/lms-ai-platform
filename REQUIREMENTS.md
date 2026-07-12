# Functional Requirements

## Student Module

### Priority 0

1. User can register/login via email-password with JWT session issuance.
2. Student dashboard shows enrolled courses, % progress per course, streak counter
3. Course catalog supports category, difficulty, and rating filters + search
4. Video player supports resume-from-last-position and playback speed control

5. Student can upload assignment files (PDF/ZIP/code) before a deadline
6. Quiz engine supports MCQ, multi-select, short-answer with auto-grading for objective types

### Priority 1

1. Student can create timestamped notes and bookmarks on any lecture
2. On 100% module completion, system auto-generates a downloadable certificate (PDF)
3. Recommendation widget suggests next course/topic based on quiz performance

### Priority 2

1. Badges awarded on milestones (first course completed, 7-day streak, quiz perfect score)

## AI Tutor Module

### Priority 0

1. Chat interface lets a student ask a question about the current course
2. AI response grounded only in that course's ingested material via RAG, with source citation
3. AI can summarize a selected lecture transcript into key points

### Priority 1

1. AI generates a personalized study plan from a student's quiz score history
2. AI auto-generates a quiz (5–10 questions) from a lecture transcript for instructor review
3. AI adjusts explanation depth: Beginner / Intermediate / Advanced
4. System tracks per-topic mastery score, feeding difficulty adjustment for chat and quizzes

### Priority 2

1. AI generates flashcards (Q/A pairs) per module for spaced revision

## Instructor Module

### Priority 0

1. Instructor can create a course with title, description, category, thumbnail, pricing tier
2. Instructor can upload video/PDF/slide material per module/lecture
3. Instructor can create assignments with rubric and deadline
4. Instructor can build or approve AI-generated quizzes

### Priority 1

1. Instructor analytics dashboard shows per-lecture drop-off, avg. quiz score, time-on-task

### Priority 2

1. Instructor can post announcements visible to all enrolled students

## Admin Module

### Priority 0

1. Admin can approve/reject a newly submitted course before it is publicly listed
2. Admin can view/suspend/delete user accounts
3. Admin can assign/revoke roles (student/instructor/admin)

### Priority 1

1. Admin dashboard shows platform-wide metrics: DAU, enrollments, completion rate, revenue

### Priority 2

1. Admin can moderate reported forum posts/comments

# Non-Functional Requirements

1. Performance
    - Non-AI API endpoints respond within 300ms at p95 under 100 concurrent users

2. scalability
    - Stateless backend services; horizontal scaling behind a load balancer

3. Security
    - Passwords hashed with bcrypt/argon2; short-lived JWT access + refresh tokens; RBAC middleware; input validation on all endpoints

4. Availability
    - Availability Target 99.5% uptime for core LMS services (excludes best-effort AI endpoints)
5. Data Privacy
    - Student PII encrypted at rest; access logs retained for audit
6. Accessibility
    - WCAG 2.1 AA — keyboard navigation, ARIA labels, color-contrast compliance

7. Observability
    - Structured logging, request tracing, health-check endpoints per service
8. Caching
    - Redis caching for catalog listing, course metadata, and leaderboard reads

9. Rate Limiting
    - Per-user and per-IP rate limits on auth and AI-chat endpoints
