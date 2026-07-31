export const AGENT_MEMORY = {
  title: 'Agent Memory',
  subtitle: 'Building Stateful AI Agents That Remember, Adapt, and Work Across Time',
  author: 'Benjamin Labaschin',
  publisher: "O'Reilly Media",
  releaseLabel: 'Early Release',
  availability:
    'Chapters 1 and 2 are live on the O’Reilly platform right now. New chapters land every four to six weeks.',
  coverSrc: '/assets/agent-memory-cover-early-release.png',
  coverAlt: "Agent Memory by Benjamin Labaschin, an O'Reilly Early Release book featuring an adult horned grebe",
} as const;

const OREILLY_BOOK_BASE_URL =
  'https://www.oreilly.com/library/view/agent-memory/0642572370473/';
const OREILLY_TRIAL_BASE_URL =
  'https://www.oreilly.com/start-trial/?type=individual';

const withCampaign = (baseUrl: string, medium: string) => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}utm_source=econoben&utm_medium=${medium}&utm_campaign=early_release`;
};

export const OREILLY_LINKS = {
  bookPage: withCampaign(OREILLY_BOOK_BASE_URL, 'book_page'),
  homepage: withCampaign(OREILLY_BOOK_BASE_URL, 'homepage'),
  trial: withCampaign(OREILLY_TRIAL_BASE_URL, 'book_page'),
} as const;

export const earlyReleaseNotes = [
  {
    title: 'Read the working chapters now',
    body: 'Early Release chapters arrive before copyedit, so you can use the material months before the finished book ships.',
  },
  {
    title: 'Your feedback can still change the book',
    body: 'This is the window where questions, thin spots, and examples from working engineers can still shape the final manuscript.',
  },
  {
    title: 'Follow the build as it happens',
    body: 'Chapter 3 is submitted and Chapter 4 is being written. Subscribers hear when a new chapter lands.',
  },
] as const;

export const buildOutcomes = [
  {
    verb: 'Decide',
    title: 'what deserves to become memory',
    body: 'Use retention, compression, correction, and forgetting policies instead of storing everything.',
    chapters: 'Chapters 1–3',
  },
  {
    verb: 'Write',
    title: 'memory through an inspectable path',
    body: 'Design triggers, schemas, authority checks, persistence operations, and observable failure handling.',
    chapters: 'Chapters 4–5',
  },
  {
    verb: 'Retrieve',
    title: 'the right evidence at the right time',
    body: 'Form queries, rank candidates, load context, and evaluate whether recall actually helps.',
    chapters: 'Chapter 6',
  },
  {
    verb: 'Maintain',
    title: 'memory as it changes and grows',
    body: 'Handle corrections, rollups, duplicates, resumability, shared ownership, risk, and recovery.',
    chapters: 'Chapters 7–10',
  },
] as const;

export type ChapterStatus = 'live' | 'submitted' | 'writing' | '';

export interface BookChapter {
  num: string;
  title: string;
  desc: string;
  status: ChapterStatus;
}

export interface BookPart {
  part: 'I' | 'II' | 'III';
  partTitle: string;
  chapters: BookChapter[];
}

export const chapters: BookPart[] = [
  {
    part: 'I',
    partTitle: 'Agents, Memory, and the Act of Remembering',
    chapters: [
      {
        num: '01',
        title: 'The Work of Remembering',
        desc: 'What memory means for an agent, how it differs from context, and why continuity changes everything.',
        status: 'live',
      },
      {
        num: '02',
        title: 'What the Agent Can Read and Write',
        desc: 'Where memory lives, the five working verbs, and giving the agent a memory API.',
        status: 'live',
      },
      {
        num: '03',
        title: 'Choosing What Becomes Memory',
        desc: 'Which encountered information earns a durable representation and what future job that memory must perform.',
        status: 'submitted',
      },
    ],
  },
  {
    part: 'II',
    partTitle: 'Building and Managing Agent Memory',
    chapters: [
      {
        num: '04',
        title: 'How Memory Gets Written',
        desc: 'Write triggers, schemas, policy decisions, persistence operations, observability, and failure handling.',
        status: 'writing',
      },
      {
        num: '05',
        title: 'Where Memory Lives and Who Controls It',
        desc: 'Client versus server, portability, inspectability, ownership, and the control model.',
        status: '',
      },
      {
        num: '06',
        title: 'Finding the Right Memory',
        desc: 'Retrieval, ranking, context loading, caching, and evaluating whether recall improves the result.',
        status: '',
      },
      {
        num: '07',
        title: 'Keeping Memory Useful Over Time',
        desc: 'Rollups, corrections, versioning, duplicate detection, and maintenance strategies.',
        status: '',
      },
      {
        num: '08',
        title: 'More Than Memory: State and Resumability',
        desc: 'Checkpoints, durable work, resume, replay, and human pause points.',
        status: '',
      },
    ],
  },
  {
    part: 'III',
    partTitle: 'Shared Memory, Risk, and Recovery',
    chapters: [
      {
        num: '09',
        title: 'Shared Memory: Coordination, Boundaries, and Conflict',
        desc: 'Ownership, leakage, multi-agent coordination, provenance, and conflict.',
        status: '',
      },
      {
        num: '10',
        title: 'Dangerous Memory: Risk, Failure, and Recovery',
        desc: 'Poisoning, detection, repair, rollback, and designing memory to fail safely.',
        status: '',
      },
    ],
  },
];

export const chapterStatusLabels: Record<Exclude<ChapterStatus, ''>, string> = {
  live: 'Live now',
  submitted: 'Submitted',
  writing: 'Writing',
};
