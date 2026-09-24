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
  detailsHref: string;
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
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'About', href: '#think' },
  { label: 'Contact', href: '#contact' },
];

export const LINKS = {
  github: 'https://github.com/ankit-for-work',
  linkedin: 'https://linkedin.com/in/ankit-gupta',
  email: 'ankitjguptaforwork@gmail.com',
  jobpingLiveDemo: '#',
  jobpingCaseStudy: '#',
  resume: '#',
  inventoryDetails: '#',
  hrPortalDetails: '#',
};

export const HERO = {
  eyebrow: 'Full stack developer',
  location: 'Vapi, Gujarat',
  handle: 'Ankit Gupta',
  headlineLine1: 'I build systems',
  headlineLine2: 'that scale.',
  subhead: 'Not just features that ship.',
  stackLines: [
    ['Angular', '.NET Core', 'PostgreSQL'],
    ['Redis', 'RabbitMQ', 'Docker'],
  ],
  stats: [
    { value: '3 years', label: 'production<br>experience' },
    { value: '5+ products', label: 'shipped' },
    { value: 'Full cycle', label: 'design → deploy' },
  ] as StatItem[],
};

export const ARCH_DIAGRAM = {
  ariaLabel:
    'JobPing architecture: job sources feed the API, which publishes to RabbitMQ; the match worker consumes messages and sends email alerts.',
  sourcesLabel: '3 job sources · every 2h',
  publishLabel: 'publish()',
  consumeLabel: 'consume()',
  alertsLabel: 'email alerts → users',
  nodes: [
    {
      index: '01 · API',
      title: 'JobPing.Api',
      titleColor: 'code',
      sub: 'ASP.NET Core 8',
    },
    {
      index: '02 · BROKER',
      title: 'RabbitMQ',
      titleColor: 't1',
      sub: 'wakes on message',
    },
    {
      index: '03 · WORKER',
      title: 'Match Worker',
      titleColor: 't1',
      sub: 'score · dedupe · alert',
    },
  ],
};

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
    title: 'Inventory Management System',
    description: 'Full-featured platform for SMBs. Used in production.',
    tags: ['Angular', '.NET', 'SQL'],
    detailsHref: LINKS.inventoryDetails,
  },
  {
    index: '03',
    title: 'HR Leave Management Portal',
    description: 'Multi-level approval workflows. Email notifications. HR analytics dashboard.',
    tags: ['Angular', '.NET', 'SQL'],
    detailsHref: LINKS.hrPortalDetails,
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
  'JobPing live demo (JobPing.liveDemo)',
  'JobPing case study (Read the architecture / Case Study link)',
  'Resume PDF (Resume button)',
  'Inventory Management System Details link',
  'HR Leave Management Portal Details link',
];
