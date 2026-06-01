export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  status: 'PRODUCTION' | 'ACTIVE' | 'STABLE' | 'EXPERIMENTAL' | 'ARCHIVED' | 'IN DEV'
  stack: string[]
  github?: string
  live?: string
  highlights: string[]
  featured: boolean
  problem?: string
  solution?: string
  architecture?: string
}

export const PROJECTS: Project[] = [
  {
    id: 'curalink',
    name: 'CURALINK',
    tagline: 'AI Medical Research Assistant',
    description:
      'A production-grade AI health research companion. Understands medical queries, searches PubMed + OpenAlex + ClinicalTrials.gov simultaneously, ranks 400+ papers semantically, delivers hallucination-free research summaries with local clinical trial matching.',
    status: 'PRODUCTION',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'LLaMA 3.1 8B', 'Groq', 'TF-IDF', 'PubMed API', 'OpenAlex API', 'ClinicalTrials.gov API'],
    github: 'https://github.com/sayan049/Curalink-2.0.git',
    live: 'https://curalink-2-0.vercel.app/',
    highlights: [
      'Semantic Ranking — TF-IDF cosine similarity scoring',
      'Subgroup Tagging — Auto-tags ALK+, EGFR, NSCLC, SCLC',
      'Location-Aware Trials — City → Country → Global fallback',
      'Anti-Hallucination — 6-layer pipeline verifies every stat',
      'Context Memory — Preserves disease context across turns',
      'Evidence Diversity — Max 3 per type (RCT, Meta, Phase 2)',
      'Voice Input — OpenAI Whisper transcription',
      'Export — PDF + Text with citations'
    ],
    problem: 'Medical professionals and researchers face information overload when searching for relevant literature, struggling with hallucinated AI responses and disconnected clinical trial data.',
    solution: 'Curalink offers a hallucination-free, unified medical research interface that hybrid-searches multiple authoritative databases in parallel, applies strict evidence hierarchy scoring, and grounds LLM responses strictly in retrieved citations.',
    architecture: 'MERN stack backend acting as an orchestrator. It parallel-fetches from PubMed, OpenAlex, and ClinicalTrials.gov, applies a custom 10-factor TF-IDF ranking algorithm, caches contexts in Redis, and passes strictly verified context to LLaMA 3.1 (via Groq) for structured JSON generation.',
    featured: true,
  },
  {
    id: 'messmate',
    name: 'MESSMATE',
    tagline: 'PG Discovery Platform',
    description:
      'Full-scale platform connecting PG owners with students. Real-time booking, availability tracking, geolocation-based discovery. Built from scratch as Founder.',
    status: 'PRODUCTION',
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'OpenStreetMap', 'Vercel', 'Render'],
    github: 'https://github.com/sayan049/easypg-react.git',
    live: 'https://messmate-one.vercel.app/',
    highlights: [
      'Real-time Booking — Socket.io-powered instant booking',
      'Secure Auth — JWT + HTTP-only cookies (XSS/CSRF safe)',
      'Geo Search — OpenStreetMap location-aware discovery',
      '40+ REST APIs — Complete architecture for all workflows',
      '40% Faster — MongoDB query optimization',
      'Auto Deploy — CI/CD with Vercel + Render'
    ],
    problem: 'Students migrating to new cities often face disorganized, fragmented systems for finding reliable PG accommodations and verifying property owners.',
    solution: 'A unified platform that connects students with verified PG owners, providing real-time availability, secure booking flows, and location-aware property discovery without middleman fees.',
    architecture: 'A monolithic React + Express setup relying heavily on MongoDB indexing for geospatial queries (OpenStreetMap integration). Socket.io facilitates real-time booking updates, while JWT in HTTP-only cookies ensures secure API transactions.',
    featured: true,
  },
  {
    id: 'ai-interview',
    name: 'AI INTERVIEW FEEDBACK SYSTEM',
    tagline: 'Multimodal AI system for interview performance',
    description:
      'Multimodal AI system evaluating interview performance using text, audio, and video simultaneously. Combines RAG pipelines with BERT for contextual analysis and deep learning (CNN + LSTM) for real-time emotion + speech recognition.',
    status: 'IN DEV',
    stack: ['React', 'Next.js', 'Python', 'PyTorch', 'TensorFlow', 'BERT', 'CNN', 'LSTM', 'Whisper', 'OpenCV', 'RAG'],
    github: 'https://github.com/sayan049/AI-Interview-Feedback-System',
    highlights: [
      'RAG Pipeline — BERT-based retrieval for answer evaluation',
      'Dynamic Questions — AI generates contextual follow-ups',
      'Emotion Recognition — CNN spatial + LSTM temporal',
      'Speech Analysis — Tone, confidence, filler words, pace',
      'Sentiment Scoring — NLP relevance and job alignment',
      'Dashboard — Visual scores: communication/content/confidence'
    ],
    problem: 'Job seekers lack objective, comprehensive feedback on their interview performance encompassing not just what they say, but how they say it and their body language.',
    solution: 'A multimodal AI that evaluates candidates across text (content relevance), audio (tone, pacing, fillers), and video (facial expressions, confidence) to provide holistic, actionable interview feedback.',
    architecture: 'Frontend records video/audio and streams to a Python backend. Audio is transcribed via Whisper. BERT powers the RAG pipeline to evaluate answer relevance against a knowledge base. Simultaneously, CNN (spatial) and LSTM (temporal) models process video frames for emotion and engagement scoring.',
    featured: true,
  },
  {
    id: 'blackpanda',
    name: 'BLACKPANDA',
    tagline: 'E-Commerce Platform',
    description:
      'Full-stack e-commerce with auth, product management, cart, and orders. Scalable REST API design.',
    status: 'STABLE',
    stack: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT'],
    github: 'https://github.com/sayan049/BlackPanda.git',
    highlights: [
      'Full-stack e-commerce with auth',
      'Product management, cart, and orders',
      'Scalable REST API design'
    ],
    problem: 'Small businesses need lightweight, customizable, and easily deployable e-commerce solutions that bypass the bloat and high fees of traditional platforms.',
    solution: 'A streamlined, secure, full-stack e-commerce engine providing comprehensive product management, user authentication, and seamless order processing out-of-the-box.',
    architecture: 'Follows a standard MVC (Model-View-Controller) architecture using Express and MongoDB. It implements robust REST APIs for resource management, secured via JWT middleware for user and admin routing separation.',
    featured: false,
  },
  {
    id: 'debales-ai',
    name: 'DEBALES AI ASSISTANT',
    tagline: 'AI/LLM integration',
    description: 'A modern, full-stack multi-tenant AI assistant platform designed for teams to collaborate on AI-powered tasks securely using Gemini API.',
    status: 'ACTIVE',
    stack: ['Next.js 14', 'TypeScript', 'MongoDB', 'Google Gemini API', 'Tailwind CSS'],
    github: 'https://github.com/sayan049/debales-ai-assistant.git',
    highlights: [
      'Multi-tenancy — Isolated data and access per user/project',
      'AI Integration — Powered by Google Gemini API',
      'Custom Auth Flows — Secure sessions and API routes',
      'Responsive UI — shadcn/ui inspired modern design'
    ],
    problem: 'Organizations struggle to integrate AI assistants securely across different teams without compromising data isolation or dealing with complex access control.',
    solution: 'Provides a multi-tenant dashboard where teams can create isolated projects, manage role-based access, and securely interact with Gemini-powered intelligent agents.',
    architecture: 'Built on Next.js 14 App Router for server-side rendering and secure API routes. Uses MongoDB (Atlas) for tenant data persistence. Incorporates Zod for type-safe validations and custom JWT sessions for authorization.',
    featured: false,
  },
  {
    id: 'student-enrollment',
    name: 'STUDENT ENROLLMENT FORM',
    tagline: 'JSON DB Integration',
    description: 'Student Enrollment Form using JsonPowerDB for robust real-time database management.',
    status: 'ARCHIVED',
    stack: ['HTML', 'CSS', 'JavaScript', 'JsonPowerDB'],
    github: 'https://github.com/sayan049/Student-Enrollment-Form-JSON-DB-integration.git',
    highlights: [
      'Serverless Database — Direct frontend to DB connection',
      'Real-time Updates — No page reloads needed',
      'Maximum Performance — In-memory caching data retrieval'
    ],
    problem: 'Traditional enrollment forms require complex backend middleware to handle simple CRUD operations, slowing down deployment and development.',
    solution: 'A serverless approach connecting a responsive frontend directly to a JsonPowerDB instance, enabling rapid creation and updating of student records.',
    architecture: 'A pure HTML/JS frontend interacting directly with JsonPowerDB via REST APIs using the jpdb-commons.js library. It leverages JPDBs multi-mode DBMS capabilities for lightning-fast indexing and server-side in-memory caching.',
    featured: false,
  },
  {
    id: 'ai-q-a-app',
    name: 'AI-POWERED Q&A APP',
    tagline: 'Document & Multimedia Q&A Web Application',
    description: 'A full-stack, production-ready AI application that lets users upload PDFs, audio, and video files, then chat with an AI that answers questions based the content — with real-time streaming, timestamp seeking, and semantic vector search.',
    status: 'ACTIVE',
    stack: ['React', 'FastAPI', 'MongoDB', 'Docker', 'Groq (Llama 3.3)', 'FAISS'],
    github: 'https://github.com/sayan049/ai-q-a-app.git',
    highlights: [
      'Semantic Vector Search (FAISS)',
      'Real-time SSE Streaming',
      'Audio/Video Transcription (Whisper)',
      'Redis Response Caching'
    ],
    problem: 'Users frequently need to extract specific information from lengthy PDFs or long-form audio/video content, which is historically tedious and time-consuming.',
    solution: 'An AI tool that ingests multimedia, transcribes/extracts text locally, and enables users to "chat" with their documents. Answers include clickable timestamps to instantly seek to the exact moment in media.',
    architecture: 'FastAPI orchestrates file processing (PyMuPDF for PDFs, ffmpeg + local Whisper for media). Extracted text is semantically chunked, vectorized via sentence-transformers, and indexed in FAISS. The Groq API (Llama 3.3) generates answers which are streamed back to the React UI via Server-Sent Events (SSE), backed by Redis caching.',
    featured: false,
  },
  {
    id: 'spotter-fuel-route',
    name: 'SPOTTER FUEL ROUTE',
    tagline: 'Cheapest fuel-stop optimization algorithm',
    description: 'A production-style backend API that computes the cheapest possible refueling plan between any two U.S. locations using real truck-stop fuel price data.',
    status: 'STABLE',
    stack: ['Django 5', 'Django REST', 'PostGIS', 'Docker', 'OSRM'],
    github: 'https://github.com/sayan049/spotter-optimized-fuel-route.git',
    highlights: [
      'Cheapest fuel-stop optimization',
      'PostgreSQL + PostGIS spatial queries',
      'Route generation using OSRM',
      'GeoJSON export for instant visualization'
    ],
    problem: 'Commercial trucking logistics suffer from high operational costs due to inefficient fuel stops along long-haul routes.',
    solution: 'An optimization algorithm that computes the absolute cheapest sequence of fuel stops between any start and end point in the U.S., integrating real truck-stop price datasets.',
    architecture: 'Django REST Framework backend backed by PostgreSQL with PostGIS for complex spatial queries. It utilizes Nominatim for geocoding, OSRM for dynamic route generation, and an internal algorithm to mathematically minimize total fuel expenditure across the generated route polyline.',
    featured: false,
  },
]

export const FEATURED_PROJECT = PROJECTS.find(p => p.featured)!