export interface ProjectDetails {
  challenges: { title: string; challenge: string; approach: string; outcome: string }[]
  roadmap: { version: string; label: string }[]
  architecture: {
    nodes: { id: string; label: string; sub: string; x: number; y: number; color: string }[]
    edges: { from: string; to: string }[]
  }
  realtime: {
    pipeline: { label: string; event: string; color: string }[]
    events: { name: string; dir: '↑' | '↓'; color: string }[]
  }
}

export const PROJECT_DETAILS: Record<string, ProjectDetails> = {
  messmate: {
    challenges: [
      {
        title: 'Realtime Synchronization at Scale',
        challenge: 'Multiple concurrent booking requests causing race conditions and potential double-bookings.',
        approach: 'Atomic MongoDB operations with findOneAndUpdate, combined with Socket.io room isolation per owner for event scoping.',
        outcome: 'Zero double-booking incidents in production testing with concurrent users.',
      },
      {
        title: 'Authentication Across User Roles',
        challenge: 'Three distinct roles (Student, Owner, Admin) with completely different permissions and UI flows.',
        approach: 'JWT with embedded role claims, route-level middleware guard layers, and role-aware React components.',
        outcome: 'Clean, extensible role system with zero authentication bypasses detected.',
      },
      {
        title: 'Mobile-Responsive Realtime UI',
        challenge: 'Complex owner dashboards with live data needed to work seamlessly across all screen sizes.',
        approach: 'Tailwind responsive system with mobile-first design, Socket state preserved across resize and reconnect.',
        outcome: 'Consistent experience across student mobile and owner desktop devices.',
      },
    ],
    roadmap: [
      { version: 'v1.1', label: 'AI-powered mess recommendation engine' },
      { version: 'v1.2', label: 'In-app messaging system between students and owners' },
      { version: 'v1.3', label: 'Payment gateway integration' },
      { version: 'v1.4', label: 'Admin analytics dashboard' },
      { version: 'v2.0', label: 'Mobile native app (React Native)' },
      { version: 'v2.1', label: 'AI lease review and contract automation' },
    ],
    architecture: {
      nodes: [
        { id: 'client',   label: 'Student Client',   sub: 'React Frontend',    x: 60,  y: 40,  color: 'var(--os-cyan)' },
        { id: 'api',      label: 'Express API',       sub: 'Node.js + REST',    x: 300, y: 40,  color: 'var(--os-blue)' },
        { id: 'mongo',    label: 'MongoDB Atlas',     sub: 'Database Layer',    x: 180, y: 180, color: 'var(--os-green)' },
        { id: 'socket',   label: 'Socket Server',     sub: 'Realtime Hub',      x: 460, y: 180, color: 'var(--os-cyan)' },
        { id: 'owner',    label: 'Owner Dashboard',   sub: 'React Frontend',    x: 620, y: 40,  color: 'var(--os-blue)' },
      ],
      edges: [
        { from: 'client', to: 'api' },
        { from: 'api', to: 'mongo' },
        { from: 'api', to: 'socket' },
        { from: 'socket', to: 'owner' },
        { from: 'api', to: 'owner' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Booking Request', event: 'booking:create',    color: 'var(--os-cyan)'  },
        { label: 'API Validate',    event: 'validate:request',  color: 'var(--os-blue)'  },
        { label: 'Socket Emit',     event: 'socket:emit',       color: 'var(--os-cyan)'  },
        { label: 'Owner Notified',  event: 'owner:notify',      color: 'var(--os-green)' },
        { label: 'Status Update',   event: 'booking:update',    color: 'var(--os-blue)'  },
        { label: 'Student Confirm', event: 'student:confirm',   color: 'var(--os-green)' },
      ],
      events: [
        { name: 'bookingCreated',    dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'ownerNotified',     dir: '↓', color: 'var(--os-green)' },
        { name: 'bookingUpdated',    dir: '↑', color: 'var(--os-blue)'  },
        { name: 'studentConfirmed',  dir: '↓', color: 'var(--os-green)' },
        { name: 'messageCreated',    dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'messageDelivered',  dir: '↓', color: 'var(--os-blue)'  },
      ],
    }
  },
  curalink: {
    challenges: [
      {
        title: 'Hallucination Mitigation',
        challenge: 'LLMs frequently invent medical facts or cite non-existent papers.',
        approach: 'Strict hybrid search retrieval grounding with a 6-layer validation pipeline that rejects responses lacking matching retrieved citations.',
        outcome: 'Near-zero hallucination rate; every stat is tied directly to a real publication.',
      },
      {
        title: 'Database Aggregation Latency',
        challenge: 'Fetching sequentially from PubMed, OpenAlex, and ClinicalTrials.gov took >12 seconds.',
        approach: 'Implemented parallel asynchronous fetching with Promise.all and internal batching limiters.',
        outcome: 'Search latency reduced to <3 seconds for 400+ papers across all sources.',
      },
      {
        title: 'Contextual Disease Bleed',
        challenge: 'When a user switches from "lung cancer" to "diabetes", the LLM would mix treatments.',
        approach: 'Automatic intent detection triggers a hard context reset and flushes the Redis session cache.',
        outcome: 'Flawless multi-turn memory that never cross-contaminates separate medical conditions.',
      },
    ],
    roadmap: [
      { version: 'v2.1', label: 'Native iOS & Android Applications' },
      { version: 'v2.2', label: 'EHR (Electronic Health Record) Integration APIs' },
      { version: 'v2.3', label: 'Multi-language Medical Translation Support' },
      { version: 'v3.0', label: 'Vision-based X-Ray/MRI Analysis Pipeline' },
    ],
    architecture: {
      nodes: [
        { id: 'ui',       label: 'React Frontend',    sub: 'User Interface',     x: 60,  y: 40,  color: 'var(--os-cyan)' },
        { id: 'gateway',  label: 'Node Gateway',      sub: 'Express API',        x: 340, y: 40,  color: 'var(--os-blue)' },
        { id: 'redis',    label: 'Redis Cache',       sub: 'Context Memory',     x: 180, y: 180, color: 'var(--os-amber)' },
        { id: 'scraper',  label: 'Hybrid Search',     sub: 'Data Aggregator',    x: 480, y: 180, color: 'var(--os-cyan)' },
        { id: 'llm',      label: 'LLaMA 3.1 8B',      sub: 'Groq Inference',     x: 620, y: 40,  color: 'var(--os-green)' },
      ],
      edges: [
        { from: 'ui', to: 'gateway' },
        { from: 'gateway', to: 'redis' },
        { from: 'gateway', to: 'scraper' },
        { from: 'scraper', to: 'llm' },
        { from: 'llm', to: 'gateway' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Query Received',  event: 'query:parse',       color: 'var(--os-cyan)'  },
        { label: 'Intent Check',    event: 'intent:extract',    color: 'var(--os-blue)'  },
        { label: 'Parallel Fetch',  event: 'api:fetch',         color: 'var(--os-amber)' },
        { label: 'TF-IDF Ranking',  event: 'rank:compute',      color: 'var(--os-green)' },
        { label: 'LLM Generation',  event: 'llm:stream',        color: 'var(--os-blue)'  },
        { label: 'Client Render',   event: 'ui:update',         color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'streamStarted',     dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'papersRetrieved',   dir: '↓', color: 'var(--os-amber)' },
        { name: 'chunkReceived',     dir: '↓', color: 'var(--os-green)' },
        { name: 'streamComplete',    dir: '↓', color: 'var(--os-blue)'  },
      ],
    }
  },
  'ai-interview': {
    challenges: [
      {
        title: 'Synchronizing Multimodal Streams',
        challenge: 'Aligning video frames, audio chunks, and text transcriptions for real-time analysis.',
        approach: 'Timestamp-based buffering system that groups multimodal inputs into fixed time windows before processing.',
        outcome: 'Accurate sentiment correlation across facial expressions and vocal tone.',
      },
      {
        title: 'High GPU Memory Consumption',
        challenge: 'Running BERT, CNN, and LSTM models simultaneously caused OOM crashes.',
        approach: 'Model quantization and asynchronous batched processing pipeline using PyTorch.',
        outcome: 'Stable inference on standard consumer hardware without memory leaks.',
      },
      {
        title: 'Contextual Follow-up Generation',
        challenge: 'Generating relevant follow-up questions rapidly without awkward pauses.',
        approach: 'RAG pipeline pre-fetches potential follow-ups based on expected answers before the candidate finishes speaking.',
        outcome: 'Seamless conversational flow that feels like a real human interviewer.',
      },
    ],
    roadmap: [
      { version: 'v1.1', label: 'Integration with ATS (Applicant Tracking Systems)' },
      { version: 'v1.2', label: 'Support for Technical Coding Interviews' },
      { version: 'v2.0', label: 'VR (Virtual Reality) Interview Environments' },
    ],
    architecture: {
      nodes: [
        { id: 'web',      label: 'Next.js App',       sub: 'Camera/Mic UI',      x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'audio',    label: 'Whisper API',       sub: 'Transcription',      x: 300, y: 40,  color: 'var(--os-blue)' },
        { id: 'video',    label: 'CNN + LSTM',        sub: 'Emotion Engine',     x: 300, y: 180, color: 'var(--os-amber)' },
        { id: 'rag',      label: 'BERT RAG',          sub: 'Context Matching',   x: 520, y: 40,  color: 'var(--os-green)' },
        { id: 'dash',     label: 'Dashboard',         sub: 'Scoring UI',         x: 660, y: 110, color: 'var(--os-cyan)' },
      ],
      edges: [
        { from: 'web', to: 'audio' },
        { from: 'web', to: 'video' },
        { from: 'audio', to: 'rag' },
        { from: 'video', to: 'dash' },
        { from: 'rag', to: 'dash' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Media Stream',    event: 'stream:chunk',      color: 'var(--os-cyan)'  },
        { label: 'Audio Extract',   event: 'audio:split',       color: 'var(--os-amber)' },
        { label: 'Whisper Stt',     event: 'text:decode',       color: 'var(--os-blue)'  },
        { label: 'Video CNN',       event: 'frame:analyze',     color: 'var(--os-amber)' },
        { label: 'RAG Match',       event: 'rag:query',         color: 'var(--os-green)' },
        { label: 'Score Emit',      event: 'score:update',      color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'videoFrame',        dir: '↑', color: 'var(--os-amber)' },
        { name: 'audioBuffer',       dir: '↑', color: 'var(--os-blue)'  },
        { name: 'emotionDetected',   dir: '↓', color: 'var(--os-cyan)'  },
        { name: 'transcription',     dir: '↓', color: 'var(--os-green)' },
        { name: 'finalScore',        dir: '↓', color: 'var(--os-blue)'  },
      ],
    }
  },
  blackpanda: {
    challenges: [
      {
        title: 'Cart State Persistence',
        challenge: 'Users abandoning carts across different devices lost their selected items.',
        approach: 'Hybrid local-storage and MongoDB sync strategy for authenticated users.',
        outcome: 'Seamless cross-device cart synchronization leading to higher conversion rates.',
      },
      {
        title: 'Inventory Race Conditions',
        challenge: 'Two users purchasing the last item simultaneously could cause negative inventory.',
        approach: 'Implemented database-level locking and transaction sessions during checkout.',
        outcome: 'Guaranteed inventory consistency under high concurrent load.',
      },
      {
        title: 'Payment Gateway Security',
        challenge: 'Handling sensitive webhook callbacks securely from payment providers.',
        approach: 'HMAC signature verification middleware and idempotency keys for all payment routes.',
        outcome: 'Zero duplicate orders and completely secure payment verification.',
      },
    ],
    roadmap: [
      { version: 'v2.0', label: 'Multi-vendor marketplace support' },
      { version: 'v2.1', label: 'AI product recommendations' },
      { version: 'v2.2', label: 'Advanced admin sales analytics charts' },
    ],
    architecture: {
      nodes: [
        { id: 'client',   label: 'Web Client',        sub: 'E-Commerce UI',      x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'auth',     label: 'Auth Gateway',      sub: 'JWT Middleware',     x: 280, y: 110, color: 'var(--os-amber)' },
        { id: 'orders',   label: 'Order Service',     sub: 'Express Controller', x: 460, y: 40,  color: 'var(--os-blue)' },
        { id: 'inv',      label: 'Inventory',         sub: 'MongoDB Atlas',      x: 460, y: 180, color: 'var(--os-green)' },
        { id: 'payment',  label: 'Payment API',       sub: 'External Webhook',   x: 660, y: 40,  color: 'var(--os-cyan)' },
      ],
      edges: [
        { from: 'client', to: 'auth' },
        { from: 'auth', to: 'orders' },
        { from: 'auth', to: 'inv' },
        { from: 'orders', to: 'inv' },
        { from: 'orders', to: 'payment' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Add to Cart',     event: 'cart:update',       color: 'var(--os-cyan)'  },
        { label: 'Checkout Init',   event: 'checkout:start',    color: 'var(--os-blue)'  },
        { label: 'Lock Inventory',  event: 'inv:lock',          color: 'var(--os-amber)' },
        { label: 'Payment Process', event: 'pay:execute',       color: 'var(--os-green)' },
        { label: 'Order Confirm',   event: 'order:save',        color: 'var(--os-blue)'  },
        { label: 'Email Receipt',   event: 'notify:email',      color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'cartUpdated',       dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'checkoutBegan',     dir: '↑', color: 'var(--os-blue)'  },
        { name: 'paymentSuccess',    dir: '↓', color: 'var(--os-green)' },
        { name: 'inventoryUpdated',  dir: '↓', color: 'var(--os-amber)' },
      ],
    }
  },
  'debales-ai': {
    challenges: [
      {
        title: 'Multi-Tenant Data Isolation',
        challenge: 'Ensuring that users from one project cannot query AI for data belonging to another project.',
        approach: 'Implemented strict Row-Level Security (RLS) patterns in the ORM and tenant-ID injection in all API calls.',
        outcome: 'Absolute data isolation and secure enterprise compliance.',
      },
      {
        title: 'Gemini API Rate Limiting',
        challenge: 'Heavy usage from multiple tenants caused frequent 429 Too Many Requests errors from Google.',
        approach: 'Built a Redis-backed queuing system with exponential backoff and localized response caching.',
        outcome: 'Smooth user experience with 99.9% uptime during API traffic spikes.',
      },
      {
        title: 'Streaming UI Stability',
        challenge: 'Streaming long AI responses sometimes broke Markdown formatting mid-stream.',
        approach: 'Integrated a robust custom Markdown parser that handles partial streams cleanly.',
        outcome: 'Flicker-free, perfectly styled text generation in real-time.',
      },
    ],
    roadmap: [
      { version: 'v1.5', label: 'Claude 3.5 Sonnet Integration' },
      { version: 'v2.0', label: 'Custom Agent Workflows and Plugins' },
      { version: 'v2.1', label: 'Enterprise SSO (SAML/Okta) Authentication' },
    ],
    architecture: {
      nodes: [
        { id: 'next',     label: 'Next.js UI',        sub: 'App Router',         x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'api',      label: 'API Routes',        sub: 'Serverless Edge',    x: 280, y: 40,  color: 'var(--os-blue)' },
        { id: 'db',       label: 'Tenant DB',         sub: 'MongoDB',            x: 280, y: 180, color: 'var(--os-green)' },
        { id: 'queue',    label: 'Job Queue',         sub: 'Redis Backoff',      x: 480, y: 40,  color: 'var(--os-amber)' },
        { id: 'gemini',   label: 'Gemini API',        sub: 'Google Cloud',       x: 660, y: 110, color: 'var(--os-cyan)' },
      ],
      edges: [
        { from: 'next', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'api', to: 'queue' },
        { from: 'queue', to: 'gemini' },
        { from: 'gemini', to: 'next' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'User Prompt',     event: 'chat:send',         color: 'var(--os-cyan)'  },
        { label: 'Tenant Check',    event: 'auth:verify',       color: 'var(--os-amber)' },
        { label: 'Queue Request',   event: 'queue:push',        color: 'var(--os-blue)'  },
        { label: 'Gemini Stream',   event: 'llm:stream',        color: 'var(--os-green)' },
        { label: 'Save History',    event: 'db:persist',        color: 'var(--os-amber)' },
        { label: 'UI Update',       event: 'ui:render',         color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'promptSubmitted',   dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'tenantVerified',    dir: '↓', color: 'var(--os-amber)' },
        { name: 'streamChunk',       dir: '↓', color: 'var(--os-green)' },
        { name: 'chatSaved',         dir: '↓', color: 'var(--os-blue)'  },
      ],
    }
  },
  'student-enrollment': {
    challenges: [
      {
        title: 'Primary Key Validation',
        challenge: 'Ensuring students could not overwrite each other\'s roll numbers during fast network requests.',
        approach: 'Leveraged JsonPowerDB\'s built-in atomic check-and-set validations.',
        outcome: 'Zero data collision without needing a custom middleware server.',
      },
      {
        title: 'Form State Management',
        challenge: 'Managing complex reset, update, and save button states using vanilla JavaScript without frameworks.',
        approach: 'Built a robust state-machine pattern for the DOM elements based on input focus and DB response.',
        outcome: 'Crisp, bug-free UX for form interactions.',
      },
      {
        title: 'Secure API Key Handling',
        challenge: 'Connecting directly from frontend to DB exposes connection tokens.',
        approach: 'Implemented domain-restriction and scoped connection tokens specifically for the STUDENT-TABLE.',
        outcome: 'Secure serverless execution.',
      },
    ],
    roadmap: [
      { version: 'v1.1', label: 'CSV Bulk Upload Support' },
      { version: 'v1.2', label: 'Parent Notification Integration' },
      { version: 'v2.0', label: 'Migration to full React Frontend' },
    ],
    architecture: {
      nodes: [
        { id: 'html',     label: 'HTML5 Form',        sub: 'DOM UI',             x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'js',       label: 'Vanilla JS',        sub: 'App Logic',          x: 280, y: 110, color: 'var(--os-amber)' },
        { id: 'lib',      label: 'jpdb-commons',      sub: 'REST Wrapper',       x: 480, y: 110, color: 'var(--os-blue)' },
        { id: 'jpdb',     label: 'JsonPowerDB',       sub: 'Serverless DBMS',    x: 660, y: 110, color: 'var(--os-green)' },
      ],
      edges: [
        { from: 'html', to: 'js' },
        { from: 'js', to: 'lib' },
        { from: 'lib', to: 'jpdb' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Roll No Entry',   event: 'input:blur',        color: 'var(--os-cyan)'  },
        { label: 'Validate Key',    event: 'api:check',         color: 'var(--os-amber)' },
        { label: 'Form Populate',   event: 'ui:fill',           color: 'var(--os-blue)'  },
        { label: 'Submit Data',     event: 'api:put',           color: 'var(--os-green)' },
        { label: 'Cache Sync',      event: 'db:cache',          color: 'var(--os-amber)' },
        { label: 'Reset UI',        event: 'ui:reset',          color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'rollNoCheck',       dir: '↑', color: 'var(--os-amber)' },
        { name: 'recordFound',       dir: '↓', color: 'var(--os-blue)'  },
        { name: 'dataSubmitted',     dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'saveSuccess',       dir: '↓', color: 'var(--os-green)' },
      ],
    }
  },
  'ai-q-a-app': {
    challenges: [
      {
        title: 'Large Document Chunking',
        challenge: 'PDFs with >100 pages exceeded LLM token limits and slowed vector searches.',
        approach: 'Implemented semantic overlap chunking using LangChain utilities before vectorization.',
        outcome: 'High-precision retrieval without context loss across document boundaries.',
      },
      {
        title: 'Precise Video Timestamping',
        challenge: 'Mapping transcribed Whisper text back to exact millisecond timestamps in the UI player.',
        approach: 'Custom interpolation algorithm bridging Whisper segment data with standard SRT timecodes.',
        outcome: 'Users can click any AI answer text to instantly jump to that exact frame in the video.',
      },
      {
        title: 'Cold Start Delays',
        challenge: 'Loading the FAISS index and local Whisper models on boot took several minutes.',
        approach: 'Pre-warmed memory caching and asynchronous lazy-loading of heavy tensor models.',
        outcome: 'Sub-second API responsiveness after initial deployment boot.',
      },
    ],
    roadmap: [
      { version: 'v1.5', label: 'Support for YouTube URL ingestion' },
      { version: 'v2.0', label: 'Multi-document cross-referencing capabilities' },
      { version: 'v2.5', label: 'Integration with Pinecone for distributed scaling' },
    ],
    architecture: {
      nodes: [
        { id: 'react',    label: 'React Frontend',    sub: 'Vite Client',        x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'fast',     label: 'FastAPI Backend',   sub: 'Python API',         x: 280, y: 110, color: 'var(--os-blue)' },
        { id: 'whisper',  label: 'Whisper AI',        sub: 'Transcription',      x: 280, y: 20,  color: 'var(--os-amber)' },
        { id: 'faiss',    label: 'FAISS Vector DB',   sub: 'Semantic Search',    x: 480, y: 200, color: 'var(--os-green)' },
        { id: 'llama',    label: 'Groq Llama 3',      sub: 'LLM Engine',         x: 640, y: 110, color: 'var(--os-cyan)' },
      ],
      edges: [
        { from: 'react', to: 'fast' },
        { from: 'fast', to: 'whisper' },
        { from: 'fast', to: 'faiss' },
        { from: 'faiss', to: 'llama' },
        { from: 'llama', to: 'fast' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'File Upload',     event: 'file:receive',      color: 'var(--os-cyan)'  },
        { label: 'Extract Text',    event: 'parse:document',    color: 'var(--os-amber)' },
        { label: 'Vectorize',       event: 'embed:create',      color: 'var(--os-blue)'  },
        { label: 'Index FAISS',     event: 'db:index',          color: 'var(--os-green)' },
        { label: 'Query Search',    event: 'search:knn',        color: 'var(--os-amber)' },
        { label: 'SSE Stream',      event: 'stream:response',   color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'uploadStarted',     dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'indexingComplete',  dir: '↓', color: 'var(--os-green)' },
        { name: 'questionAsked',     dir: '↑', color: 'var(--os-blue)'  },
        { name: 'answerChunk',       dir: '↓', color: 'var(--os-amber)' },
      ],
    }
  },
  'spotter-fuel-route': {
    challenges: [
      {
        title: 'Graph Traversal Efficiency',
        challenge: 'Calculating the cheapest combination of fuel stops across thousands of nodes caused timeout errors.',
        approach: 'Implemented a custom Dynamic Programming algorithm based on A* with distance-to-empty constraints.',
        outcome: 'Route optimization completes in under 200ms for trans-continental journeys.',
      },
      {
        title: 'Geocoding Rate Limits',
        challenge: 'Public Nominatim APIs aggressively throttled batch geocoding of truck stop coordinates.',
        approach: 'Built a local Redis caching layer and bounded the request concurrency to respect API limits.',
        outcome: 'Reliable backend ingestion of daily fuel price CSVs without API bans.',
      },
      {
        title: 'Spatial Query Accuracy',
        challenge: 'Standard distance queries failed to account for actual road networks (Manhattan vs Haversine distance).',
        approach: 'Integrated PostGIS for exact spatial bounding boxes, combined with OSRM routing geometry.',
        outcome: 'Hyper-accurate fuel estimations based on actual driven miles.',
      },
    ],
    roadmap: [
      { version: 'v1.1', label: 'Toll cost integration into routing calculations' },
      { version: 'v1.2', label: 'Real-time weather impact on fuel consumption' },
      { version: 'v2.0', label: 'Fleet management dashboard for logistics companies' },
    ],
    architecture: {
      nodes: [
        { id: 'api',      label: 'Client Apps',       sub: 'API Consumers',      x: 60,  y: 110, color: 'var(--os-cyan)' },
        { id: 'django',   label: 'Django REST',       sub: 'Core Backend',       x: 280, y: 110, color: 'var(--os-blue)' },
        { id: 'osrm',     label: 'OSRM Engine',       sub: 'Routing Engine',     x: 280, y: 20,  color: 'var(--os-amber)' },
        { id: 'postgis',  label: 'PostgreSQL',        sub: 'PostGIS Spatial',    x: 480, y: 200, color: 'var(--os-green)' },
        { id: 'algo',     label: 'Optimizer',         sub: 'A* Algorithm',       x: 640, y: 110, color: 'var(--os-cyan)' },
      ],
      edges: [
        { from: 'api', to: 'django' },
        { from: 'django', to: 'osrm' },
        { from: 'django', to: 'postgis' },
        { from: 'postgis', to: 'algo' },
        { from: 'algo', to: 'django' },
      ],
    },
    realtime: {
      pipeline: [
        { label: 'Route Request',   event: 'req:receive',       color: 'var(--os-cyan)'  },
        { label: 'Geocode Endpoints',event: 'geo:resolve',      color: 'var(--os-amber)' },
        { label: 'OSRM Polyline',   event: 'route:fetch',       color: 'var(--os-blue)'  },
        { label: 'Spatial Query',   event: 'db:bbox',           color: 'var(--os-green)' },
        { label: 'Cost Optimize',   event: 'math:compute',      color: 'var(--os-amber)' },
        { label: 'GeoJSON Export',  event: 'res:send',          color: 'var(--os-cyan)'  },
      ],
      events: [
        { name: 'calculateRoute',    dir: '↑', color: 'var(--os-cyan)'  },
        { name: 'coordinatesFound',  dir: '↓', color: 'var(--os-green)' },
        { name: 'stationsQueried',   dir: '↓', color: 'var(--os-amber)' },
        { name: 'optimizationDone',  dir: '↓', color: 'var(--os-blue)'  },
      ],
    }
  },
}
