# cv.md — site-safe CV facts (lead-owned)

The only source of facts for the site (CLAUDE.md §1). Copied from Tanmay's CV, with the never-on-site items removed: age, phone, address, the third-person profile, and the "Working style" section. Wording can be tightened for the web; facts, numbers, dates, and stack can't change. Anything not here or in a project's repo → `<!-- PLACEHOLDER -->` and ask.

## Contact
- Tanmay Desai · Boston, MA
- t.desai240305@gmail.com
- LinkedIn: https://www.linkedin.com/in/tanmaydesai2126/
- GitHub: https://github.com/TADebugs

## Education
**Northeastern University** · Jul 2024 – May 2027 · Boston, MA
B.S. Information Technology · GPA 3.7
- Coursework (Java): Data Structures and Algorithms, Object-Oriented Design, Operating Systems, Software Engineering, Database Systems, Cloud Computing (AWS), Machine Learning, Discrete Mathematics, Probability and Statistics, Optimization

**Golden Gate University** · 2023 – 2024 · San Francisco, CA
Associate's, Computer Science · GPA 3.9

## Experience
**Medidata Solutions** · New York City, NY

*SDET Intern* · Jul 2026 – Nov 2026
- Built a CI/CD-integrated testing engine parsing 500+ JSON test results into interactive, time-stamped HTML reports via GitHub Actions, eliminating manual QA reporting and improving monitoring by surfacing failures inline per pipeline run.
- Took end-to-end ownership of automated regression coverage, applying best practices for code health, documentation, testing, and monitoring, and influencing engineers across teams to adopt standardized reporting conventions.

*Data Engineering Intern* · Apr 2026 – Jul 2026
- Trained a TensorFlow/Keras classifier in Python to auto-tag and sort feature files across 10+ repositories, building scalable internal tooling that standardized lookup conventions and boosted developer productivity.
- Designed data parsing and transformation workflows feeding downstream pipelines, evaluating complex data to resolve technical issues and collaborating cross-functionally with QA and platform engineers.

**Electronic Arts** · Remote

*Software Engineering Intern* · Nov 2025 – Jan 2026
- Resolved a critical performance bottleneck in a production C++ codebase and architected object-oriented systems for EA Sports College Football, applying design patterns with cross-functional teams to maximize reusability, maintainability, and performance at scale.

## Technical skills
- **Languages:** Java, Python, C/C++, Kotlin, TypeScript, JavaScript, C#, SQL, HTML/CSS
- **Engineering practices:** Object-Oriented Design, Design Patterns, Data Structures and Algorithms, RESTful API Design, Unit and Integration Testing, Code Health, Documentation, Monitoring, CI/CD, Collaborative Git Workflows
- **Backend and cloud:** AWS, Azure, Docker, FastAPI, Node.js, MySQL, Firebase, Microservices
- **Data and ML:** TensorFlow/Keras, Langfuse, RAGAS, Pandas, NumPy, ETL Pipelines, Vector Search
- **Tools:** GitHub Actions, GitLab, IntelliJ IDEA, Android Studio, React, Figma, Claude Code, GitHub Copilot, Amazon Q Developer

## Projects

### Production RAG System — Retrieval and Evaluation Pipeline (`/rag`)
- Engineered a production RAG system (ComicOracle/PokeAPI-based) in Python with hybrid BM25 + vector retrieval and cross-encoder reranking, enforcing citation-grounded responses.
- Instrumented full observability with Langfuse tracing, monitoring p50/p95 latency and cost-per-request to evaluate performance.
- Integrated RAGAS evaluation into GitHub Actions CI with regression gating, blocking quality regressions before merge.
- Built in three phases: basic RAG, then hybrid retrieval + reranking, then full observability + CI gating. (Runs locally on Tanmay's Mac, so the site gets a recorded demo.)

### TRINITY — Multi-Personality AI Desktop Assistant (`/trinity`)
- Built a desktop AI assistant with three switchable personalities (ARIA, ECHO, NEXUS), each specialized for productivity, creative work, or software development workflows.
- Backend on Python (FastAPI + Socket.IO) with Gemini 2.5 Native Audio API for streaming responses; frontend in React (Vite + TypeScript).
- Implemented core components including a PersonalityManager, WakeWordDetector, and ToolRouter, with personality-specific voices (Chirp 3 HD), per-personality tool permissions, and a Three.js animated orb; built using Claude Code CLI.

### AlgoLend AI — DeFi Lending Platform (`/algolend`)
- Built a full-stack decentralized lending platform with React, TypeScript, and FastAPI (Python), integrating Algorand smart contracts with fast finality and sub-cent fees.
- Implemented 3 autonomous AI agents for market analysis, risk scoring, and yield optimization, achieving 90%+ risk-assessment accuracy and roughly 3x better capital utilization than static lending models.
- ⚠ **On site:** both numbers are unverified until `algolend` measures them. Describe the agents without a number (decisions.md #8).
- Proposed, experimented with, and launched features including instant loan approvals, wallet integration, and real-time portfolio analytics.

### God's Eye — AI-Driven Dungeon Crawler (`/gods-eye`)
- Built a Unity dungeon crawler with a dual-persona Vision AI analyzing real-time screenshots to dynamically control enemy spawns and difficulty, enabling 100% non-scripted gameplay.
- Implemented a REST-based Vision API integration parsing structured JSON action plans and executing 5–10 timed AI actions per request with sub-second in-game response.
- ⚠ **On site:** never "sub-second". Use "executes 5–10 timed AI actions per vision plan"; if latency is mentioned, the real vision round-trip is 1–3s (decisions.md #8).

### Not routed yet (CLAUDE.md §4 "possible later additions")
**SpeakEasy — Public Speaking Practice Tool**
- Developed a mobile app (Kotlin/Swift) with an algorithm-based random prompt generator and voice recognition measuring speech clarity with real-time feedback.
- Applied data structures to track and optimize user progress over time, shipping a personalized experience for end users.

**Desktop AI Companion — Screen-Aware Assistant Overlay** (in design)
- Designing a minimal desktop companion (Electron + React + TypeScript) with a transparent, always-on-top, click-through overlay window driven by a sprite-based cat character.
- Architecting screen-capture-based AI advising via vision API calls, manually triggered in v0 and moving to event-driven capture (on app-switch) in later phases, with responses rendered in a speech bubble.
- Built a full animation state machine (idle, blink, sleep, wake, thinking, talking, dragged), using sprite sheets and system idle time to drive sleep/wake emotes.
- Planned a security-first architecture: OS keychain for API key storage, sandboxed renderer (contextIsolation, no nodeIntegration), typed IPC channel allowlist, spend caps, and an app blocklist that pauses capture on sensitive windows.

**BRAIN — Cross-Agent Memory and Context Graph** (in design)
- Designing a shared memory management system, BRAIN, that lets multiple AI agents/assistants retrieve context from a common pool rather than isolated per-session memory.
- Structuring the pool as a node graph connecting every real project and a personal profile, without duplicating underlying project files, so context is derived and linked rather than copied.
- Built to be RAG-friendly (frontmatter-based), with the long-term goal of serving as the memory layer a Jarvis-style personal assistant reads from.

Sweet-Bite is not in the CV: its facts come from its repo only.

## Leadership
**Vice President and Software Development Lead, SCI-TECH Club, Golden Gate University** (2023–24): organized coding competitions and hackathon-style STEM innovation contests, mentored junior students, and led team discussions on AI algorithms and mathematical modeling.
