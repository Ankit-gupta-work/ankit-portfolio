export interface NavLink {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface PipelineStep {
  label: string;
  filled: boolean;
  accentColor: 'accent' | 'ok';
}

export interface ProjectTag {
  label: string;
}

export interface SecondaryProject {
  index: string;
  title: string;
  description: string;
  tags: string[];
  problemQuestion: string;
  problemAnswerPre: string;
  problemAnswerBold?: string;
  problemAnswerPost?: string;
  detailsHref: string;
}

export interface ExperienceHighlight {
  index: string;
  title: string;
  description: string;
}

export interface ImpactTile {
  before: string;
  after?: string;
  label: string;
  line: string;
}

export interface ThinkCard {
  titlePrefix: string;
  titleMono: string;
  titleSuffix: string;
  problem: string;
  decision: string;
  kind: 'diff' | 'chips';
  diffLines?: { sign: string; text: string; kind: 'minus' | 'plus' | 'equal' }[];
  chips?: string[];
}

export interface StackRow {
  label: string;
  items: string[];
  dim: boolean;
}

export interface ContactRow {
  label: string;
  href: string;
  display: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#think' },
  { label: 'Contact', href: '#contact' },
];

export const LINKS = {
  github: 'https://github.com/ankit-for-work',
  linkedin: 'https://linkedin.com/in/ankit-gupta',
  email: 'ankitjguptaforwork@gmail.com',
  jobpingLiveDemo: 'https://jobping-blush.vercel.app/',
  jobpingCaseStudy: 'https://jobping-blush.vercel.app/',
  resume: '/Ankit_Gupta_Resume.pdf',
};

export const HERO = {
  eyebrow: 'Full stack developer',
  location: 'Vapi, Gujarat',
  handle: 'Ankit Gupta',
  headlineLine1: 'I build systems',
  headlineLine2: 'that scale.',
  subhead: 'Not just features that ship.',
  heroStack: [
    ['Angular', 'TypeScript', 'RxJS'],
    ['.NET Core', 'C#', 'REST APIs'],
    ['PostgreSQL', 'SQL Server', 'Redis'],
    ['RabbitMQ', 'Docker', 'CI/CD'],
  ] as string[][],
  stats: [
    { value: '3 years', label: 'production<br>experience' },
    { value: '5+ products', label: 'shipped' },
    { value: 'Full cycle', label: 'design → deploy' },
  ] as StatItem[],
};

export interface HeroStackLayer {
  title: string;
  subtitle: string;
  z: number;
  isAi: boolean;
  breathe: number;
  flashDelay: string;
  labelTop: number;
  labelDelay: string;
}

export const HERO_STACK_ARIA_LABEL =
  'How I build systems: five layers, interface, AI, services, events and data, with a request passing through each one.';

// Bottom-first (Data -> Interface) so later plates paint on top of earlier ones in the 3D stack.
export const HERO_STACK: HeroStackLayer[] = [
  { title: 'Data', subtitle: 'storage · cache · integrity', z: 0, isAi: false, breathe: 4, flashDelay: '3.92s', labelTop: 359, labelDelay: '1.2s' },
  { title: 'Events', subtitle: 'queues · async · retries', z: 52, isAi: false, breathe: 3, flashDelay: '3.49s', labelTop: 310, labelDelay: '1.1s' },
  { title: 'Services', subtitle: 'APIs · auth · business logic', z: 104, isAi: false, breathe: 2, flashDelay: '3.06s', labelTop: 261, labelDelay: '1.0s' },
  { title: 'AI', subtitle: 'LLMs · assistants · automation', z: 156, isAi: true, breathe: 1, flashDelay: '2.63s', labelTop: 212, labelDelay: '0.9s' },
  { title: 'Interface', subtitle: 'UI · state · experience', z: 208, isAi: false, breathe: 0, flashDelay: '2.2s', labelTop: 163, labelDelay: '0.8s' },
];

export const CURRENTLY_BUILDING = {
  eyebrow: 'Currently building',
  name: 'JobPing',
  description:
    'A developer job alert platform. Workers fetch jobs from 3 sources every 2 hours, calculate match scores against your skill profile, and send email alerts via a RabbitMQ pipeline — entirely without you opening a website.',
  status: 'Status: In development',
  expected: 'Expected: October 2026',
  terminalTitle: 'jobping-worker',
  logLines: [
    { ts: '[10:42]', text: 'Fetching from Remotive...' },
    { ts: '[10:42]', text: '14 new jobs found' },
    { ts: '[10:42]', text: 'Calculating match scores...' },
    { ts: '[10:42]', text: '3 users alerted' },
    { ts: '[10:44]', text: 'Worker complete', ok: true },
  ],
  waitingText: 'waiting for next run',
};

export const EXPERIENCE = {
  badge: 'SN',
  role: 'Full Stack Developer',
  period: 'May 2023 – Present',
  company: 'Setu Net Pvt Ltd',
  location: 'Vapi, Gujarat',
  intro:
    'I design and build our internal platforms end to end — shaping requirements together with the team and stakeholders, developing the features, deploying them to IIS (Windows) and Ubuntu (Linux) servers, and supporting them in production.',
  highlights: [
    {
      index: '01',
      title: 'Configuration-driven workflow platform',
      description:
        'Admins define approval chains, escalations, form routing, role-based access and email notifications from the UI — zero code changes or redeploys per workflow.',
    },
    {
      index: '02',
      title: 'Visual Form Builder',
      description:
        'A step-by-step builder that creates tables, views, workflow routes, menu entries and role access in a single transaction.',
    },
    {
      index: '03',
      title: 'Dual-database support',
      description:
        "One codebase running on PostgreSQL and SQL Server — and I'm leading the production schema migration to PostgreSQL.",
    },
    {
      index: '04',
      title: 'Reusable Angular component library',
      description:
        "Dynamic forms, modals and dashboards — now the standard across the company's internal products.",
    },
  ] as ExperienceHighlight[],
  tags: ['.NET Core', 'Angular', 'PostgreSQL', 'SQL Server', 'Stored Procedures', 'IIS', 'Ubuntu', 'Docker'],
  impactTiles: [
    { before: 'Weeks', after: '2h', label: 'Module setup', line: 'By a non-technical admin' },
    { before: '8.4s', after: '80ms', label: 'Query time', line: 'Role-privilege query, ~100× faster' },
    { before: '2 DBs', label: 'One codebase', line: 'PostgreSQL + SQL Server' },
    { before: '0', label: 'Redeploys', line: 'Per new workflow' },
  ] as ImpactTile[],
  notePre: 'shifted from shipping features to building ',
  noteBold: 'dynamic, performance-driven',
  notePost: ' systems',
};

export const FEATURED_PROJECT = {
  index: '01 — FEATURED',
  title: 'JobPing',
  tagline: 'Developer job alert platform',
  tags: ['.NET Core 8', 'Angular 18', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Docker'],
  problemLabel: 'The interesting problem',
  problemQuestion: 'How do you prevent the same user from receiving duplicate alerts for the same job?',
  pipeline: [
    { label: 'fetch · 3 sources', filled: false, accentColor: 'accent' },
    { label: 'score vs skill profile', filled: false, accentColor: 'accent' },
    { label: 'check alert_history', filled: true, accentColor: 'accent' },
    { label: 'publish → RabbitMQ', filled: false, accentColor: 'accent' },
    { label: 'email alert sent', filled: false, accentColor: 'ok' },
  ] as PipelineStep[],
  pipelineTitle: 'Alert pipeline',
};

export const SECONDARY_PROJECTS: SecondaryProject[] = [
  {
    index: '02',
    title: 'Workflow Automation Platform',
    description:
      'Configuration-driven platform that automated most internal operations. Approval chains, escalation rules, form routing and notifications are defined by admins in the UI, not in code.',
    tags: ['.NET Core', 'Angular', 'PostgreSQL', 'SQL Server'],
    problemQuestion: 'How do you let non-developers ship new workflows safely?',
    problemAnswerPre: 'Every rule lives in configuration tables the engine reads at runtime, so a new workflow is data, not a deployment.',
    detailsHref: '#',
  },
  {
    index: '03',
    title: 'Visual Form Builder',
    description:
      'Step-by-step builder (list → mail → escalation → review → form) that turns an admin\'s choices into a working module.',
    tags: ['.NET Core', 'Angular', 'SQL', 'Transactions'],
    problemQuestion: 'What if setup fails halfway?',
    problemAnswerPre: 'Tables, views, workflow routes, sidebar menu entries and role grants are all created in a ',
    problemAnswerBold: 'single database transaction',
    problemAnswerPost: '. Either the whole module exists or nothing does.',
    detailsHref: '#',
  },
];

export const THINK_CARDS: ThinkCard[] = [
  {
    titlePrefix: 'Why ',
    titleMono: 'RabbitMQ',
    titleSuffix: '?',
    problem: "Database polling wakes up every N minutes whether or not there's new data.",
    decision: 'RabbitMQ wakes the worker only when a message arrives.',
    kind: 'diff',
    diffLines: [
      { sign: '−', text: 'while(true) { poll(); sleep(N); }', kind: 'minus' },
      { sign: '+', text: 'on message → process', kind: 'plus' },
    ],
  },
  {
    titlePrefix: 'Why ',
    titleMono: 'Redis',
    titleSuffix: ' for 4 things?',
    problem: 'Caching, a distributed lock, rate limiting and a JWT blacklist — four separate needs.',
    decision: 'One infrastructure component, four real problems.',
    kind: 'chips',
    chips: ['cache', 'lock', 'rate limiter', 'jwt blacklist'],
  },
  {
    titlePrefix: 'Why ',
    titleMono: 'delta updates',
    titleSuffix: ' for preferences?',
    problem: 'Delete-all and re-insert breaks audit trails and creates race conditions.',
    decision: 'Track the delta. Apply the diff.',
    kind: 'diff',
    diffLines: [
      { sign: '+', text: 'added: [RabbitMQ]', kind: 'plus' },
      { sign: '−', text: 'removed: [jQuery]', kind: 'minus' },
      { sign: '=', text: 'unchanged: untouched', kind: 'equal' },
    ],
  },
  {
    titlePrefix: 'Why a ',
    titleMono: 'backend proxy',
    titleSuffix: ' for a chatbot?',
    problem: 'An API key in the browser can be copied and your quota drained.',
    decision: 'A .NET proxy keeps the key server-side, rate-limits per visitor with Redis, and streams answers.',
    kind: 'chips',
    chips: ['API key server-side', 'Redis rate limiting', 'streamed answers'],
  },
  {
    titlePrefix: 'Why ',
    titleMono: 'configuration',
    titleSuffix: ' over code?',
    problem: 'Every new approval flow meant a developer, a code change and a redeploy. Weeks per module.',
    decision: 'Model workflows as data. The engine reads the config at runtime, so admins ship new flows in hours.',
    kind: 'chips',
    chips: ['config tables', 'runtime engine', 'role-based access'],
  },
];

export const STACK_ROWS: StackRow[] = [
  { label: 'Daily', items: ['Angular', '.NET Core', 'PostgreSQL', 'TypeScript'], dim: false },
  { label: 'Growing in', items: ['Redis', 'RabbitMQ', 'Docker', 'CI/CD'], dim: false },
  { label: 'Familiar with', items: ['SQL Server', 'Azure DevOps', 'Linux', 'Nginx'], dim: true },
  { label: 'Using now', items: ['AI-assisted development', 'Claude', 'Copilot'], dim: true },
];

export const AI_QUOTE = {
  eyebrow: 'On working with AI tools',
  quote:
    'I use Claude and Copilot to move faster — reviewing architectural decisions, explaining concepts, generating boilerplate. Every production decision and line of business logic is written and understood by me. The matching algorithm, the RabbitMQ topology, the Redis lock strategy — those are mine.',
};

export const CONTACT_ROWS: ContactRow[] = [
  { label: 'Email', href: `mailto:${LINKS.email}`, display: LINKS.email },
  { label: 'GitHub', href: LINKS.github, display: 'github.com/ankit-for-work' },
  { label: 'LinkedIn', href: LINKS.linkedin, display: 'linkedin.com/in/ankit-gupta' },
];

export const FOOTER = {
  name: 'Ankit Gupta',
  year: '2026',
  location: 'Vapi, Gujarat',
};

export const PLACEHOLDER_LINKS = [
  'Workflow Automation Platform Details link',
  'Visual Form Builder Details link',
];
