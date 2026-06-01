export interface SkillModule {
  id:         string
  name:       string
  status:     'ACTIVE' | 'LEARNING' | 'EXPLORING'
  efficiency: number
  skills:     string[]
  category:   string
  sparkData:  number[]
}

export const SKILL_MODULES: SkillModule[] = [
  {
    id:         'frontend',
    name:       'FRONTEND ENGINE',
    status:     'ACTIVE',
    efficiency: 84,
    category:   'frontend',
    skills:     [
      'React.js', 'Next.js 14', 'JavaScript (ES6+)', 'TypeScript',
      'Tailwind CSS', 'HTML5', 'CSS3', 'Framer Motion',
    ],
    sparkData: [60, 72, 68, 80, 76, 84, 82, 84],
  },
  {
    id:         'backend',
    name:       'BACKEND CORE',
    status:     'ACTIVE',
    efficiency: 92,
    category:   'backend',
    skills:     [
      'Node.js', 'Express.js', 'REST APIs', 'Java',
      'TypeScript', 'Python', 'OOP', 'Authentication (JWT)',
    ],
    sparkData: [55, 65, 75, 82, 85, 88, 90, 92],
  },
  {
    id:         'database',
    name:       'DATABASE LAYER',
    status:     'ACTIVE',
    efficiency: 87,
    category:   'database',
    skills:     [
      'MongoDB', 'MySQL (basic)', 'DBMS Concepts', 'Data Modeling',
      'Mongoose ODM', 'Aggregation Pipelines', 'Redis',
    ],
    sparkData: [50, 60, 68, 75, 80, 82, 85, 87],
  },
  {
    id:         'realtime',
    name:       'REALTIME ENGINE',
    status:     'ACTIVE',
    efficiency: 82,
    category:   'realtime',
    skills:     [
      'Socket.io', 'WebSockets', 'Event-driven Architecture', 'Pub/Sub Patterns',
      'Room Management', 'Broadcast Systems', 'Connection State Management',
    ],
    sparkData: [40, 55, 62, 68, 72, 76, 78, 82],
  },
  {
    id:         'ai',
    name:       'AI MODULES',
    status:     'LEARNING',
    efficiency: 90,
    category:   'ai',
    skills:     [
      'RAG Pipelines', 'Prompt Engineering', 'Machine Learning (CNN, LSTM)', 'Python',
      'Pandas', 'BERT', 'LLMs', 'Vercel AI SDK',
    ],
    sparkData: [40, 52, 60, 68, 75, 78, 85, 90],
  },
  {
    id:         'uiux',
    name:       'UI/UX SYSTEMS',
    status:     'ACTIVE',
    efficiency: 85,
    category:   'design',
    skills:     [
      'Cinematic UI Design', 'Motion Design', 'GSAP Timelines',
      'Component Systems', 'Design Tokens', 'Spatial Interface Design',
      'Interaction Architecture', 'Figma',
    ],
    sparkData: [65, 70, 74, 78, 80, 82, 84, 85],
  },
  {
    id:         'devops',
    name:       'DEVOPS & TOOLING',
    status:     'ACTIVE',
    efficiency: 75,
    category:   'devops',
    skills:     [
      'Git & GitHub', 'CI/CD (GitHub Actions)', 'Docker', 'AWS (EC2, S3)',
      'Vercel', 'Render', 'Linux & OS Concepts', 'Postman',
    ],
    sparkData: [50, 55, 60, 65, 70, 72, 74, 75],
  },
]