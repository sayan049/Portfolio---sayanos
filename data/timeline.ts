export interface TimelineEntry {
  id: string
  year: string
  phase: string
  title: string
  description: string
  stack: string[]
  status?: string
  side: 'left' | 'right'
  projects: { name: string; github?: string; live?: string; desc: string }[]
}

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    id: 'foundations',
    year: '2022',
    phase: 'PHASE 01',
    title: 'FOUNDATIONS',
    description: 'Started the engineering journey with Java and early web development. Learned algorithms, data structures, and the fundamentals of problem-solving that underpin everything built since.',
    stack: ['Java', 'HTML', 'CSS', 'JavaScript'],
    side: 'left',
    projects: [
      {
        name: 'SUDOKU-SOLVER',
        github: 'https://github.com/sayan049/SUDOKU-SOLVER',
        desc: 'Classic constraint-satisfaction algorithm implemented in Java.',
      },
      {
        name: 'websiteee',
        github: 'https://github.com/sayan049/websiteee',
        desc: 'First personal website experiment — pure HTML/CSS.',
      },
    ],
  },
  {
    id: 'ecommerce',
    year: '2023',
    phase: 'PHASE 02',
    title: 'FULL-STACK & E-COMMERCE',
    description: 'Deep-dived into full-stack architecture. Built a complete e-commerce backend with auth, cart, product management and REST APIs. Shifted from page manipulation to systems thinking.',
    stack: ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST APIs'],
    side: 'right',
    projects: [
      {
        name: 'BlackPanda',
        github: 'https://github.com/sayan049/BlackPanda',
        desc: 'Full-stack e-commerce platform with auth, products, cart & orders.',
      },
      {
        name: 'EasyPg (v1)',
        github: 'https://github.com/sayan049/EasyPg',
        desc: 'First version of PG/hostel discovery — pure CSS/HTML prototype.',
      },
    ],
  },
  {
    id: 'realtime',
    year: '2024',
    phase: 'PHASE 03',
    title: 'REALTIME SYSTEMS & PRODUCTION',
    description: 'Launched Messmate into production — a full PG/mess booking platform with realtime updates, geolocation, multi-role auth, and CI/CD. First complete product with real users at scale.',
    stack: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT', 'OpenStreetMap', 'Vercel'],
    side: 'left',
    projects: [
      {
        name: 'Messmate (EasyPg React)',
        github: 'https://github.com/sayan049/easypg-react',
        live: 'https://messmate-one.vercel.app/',
        desc: 'Production PG booking platform with realtime booking, geolocation & multi-role auth.',
      },
    ],
  },
  {
    id: 'ai-systems',
    year: '2025',
    phase: 'PHASE 04',
    title: 'AI SYSTEMS & LLM INTEGRATION',
    description: 'Shifted into AI engineering. Built multi-tenant assistants, dashboards, and LLM-powered products. Mastered TypeScript, RAG pipelines, streaming interfaces, and prompt engineering at scale.',
    stack: ['TypeScript', 'Python', 'LLM APIs', 'RAG', 'Streaming', 'Vercel AI SDK'],
    side: 'right',
    projects: [
      {
        name: 'Debales AI Assistant',
        github: 'https://github.com/sayan049/debales-ai-assistant',
        live: 'https://debales-ai-sandy.vercel.app',
        desc: 'TypeScript-based AI assistant with LLM integration and streaming responses.',
      },
      {
        name: 'Multi-tenant AI Assistant',
        github: 'https://github.com/sayan049/Multi-tenant-AI-Assistant',
        desc: 'Multi-tenant architecture for AI assistants — isolated contexts per client.',
      },
      {
        name: 'AI Dashboard',
        github: 'https://github.com/sayan049/ai_Dashboard',
        desc: 'JavaScript dashboard for visualizing and interacting with AI outputs.',
      },
    ],
  },
  {
    id: 'production-ai',
    year: '2026',
    phase: 'PHASE 05',
    title: 'PRODUCTION AI PRODUCTS',
    description: 'Built Curalink 2.0 — a production-grade AI medical research platform. Expanded into multimodal AI (interview feedback using CNN+LSTM), AI Q&A systems, route optimization, and database-driven micro-projects.',
    stack: ['JavaScript', 'Python', 'PyTorch', 'BERT', 'Groq', 'Next.js', 'JsonPowerDB'],
    side: 'left',
    projects: [
      {
        name: 'Curalink 2.0',
        github: 'https://github.com/sayan049/Curalink-2.0',
        live: 'https://curalink-2-0.vercel.app',
        desc: 'AI medical research assistant — PubMed, OpenAlex, ClinicalTrials.gov with TF-IDF ranking.',
      },
      {
        name: 'AI Interview Feedback System',
        github: 'https://github.com/sayan049/AI-Interview-Feedback-System',
        desc: 'Multimodal AI (CNN+LSTM) evaluating interview performance via video, audio & text.',
      },
      {
        name: 'AI Q&A App',
        github: 'https://github.com/sayan049/ai-q-a-app',
        desc: 'Python-based AI Q&A system with LLM backend.',
      },
      {
        name: 'Spotter Fuel Route Optimizer',
        github: 'https://github.com/sayan049/spotter-optimized-fuel-route',
        desc: 'Python algorithm for optimizing long-haul fuel stop routes.',
      },
      {
        name: 'Student Enrollment Form (JsonPowerDB)',
        github: 'https://github.com/sayan049/Student-Enrollment-Form-JSON-DB-integration',
        desc: 'Serverless CRUD form using JsonPowerDB — real-time API-driven database integration.',
      },
    ],
  },
  {
    id: 'now',
    year: '2026',
    phase: 'PHASE 06',
    title: 'NOW — OPEN TO IMPACT',
    description: 'Seeking high-impact engineering roles. Focused on AI-powered platforms, scalable realtime systems, and products that redefine digital interaction. SayanOS — this portfolio OS — showcases the full depth of capabilities.',
    stack: ['Full-Stack MERN', 'AI Systems', 'TypeScript', 'Next.js 14', 'Framer Motion'],
    status: 'AVAILABLE',
    side: 'right',
    projects: [
      {
        name: 'SayanOS (This Portfolio)',
        github: 'https://github.com/sayan049',
        desc: 'SayanOS-inspired portfolio OS built with Next.js 14, Framer Motion, and Zustand.',
      },
    ],
  },
]