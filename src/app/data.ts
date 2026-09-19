export type EventStatus = 'upcoming' | 'past';
export type EventFormat = 'online' | 'offline';
export type EventKind = 'workshop' | 'session' | 'hackathon';

export type EventItem = {
  slug: string;
  title: string;
  subtitle: string;
  kind: EventKind;
  /**
   * Omitted where the record genuinely does not state it. The card then shows no
   * online/offline pill, and the online/offline filters skip the entry, rather
   * than either of them asserting a format nobody has confirmed.
   */
  format?: EventFormat;
  status: EventStatus;
  dateLabel: string;
  description: string;
  image: string;
  /**
   * Curated photographs from the event itself, lead frame first, served from
   * `public/events/<slug>/`. These are the team's own Drive originals brought
   * into the repo and re-encoded as WebP — nothing is hotlinked, so the recap
   * gallery and the hero rotation both go through Next's image optimizer.
   *
   * Ordering matters: `HeroVisual` picks specific indices out of a few of these
   * arrays and needs landscape frames there, so each array leads with its
   * landscape shots. Omitted where no photographs of the event exist.
   */
  galleryImages?: string[];
  venue?: string;
  registrationUrl: string;
  notes?: string[];
};

export type HackathonTrack = {
  name: string;
  description: string;
};

export type HackathonDetail = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  registrationUrl: string;
  heroMetric: string;
  coverImage: string;
  tracks: HackathonTrack[];
  sponsors: string[];
  prizes: string[];
  faqs: { question: string; answer: string }[];
  notes: string[];
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  focus: string;
  linkedinUrl: string;
};

// ─── Community story type ────────────────────────────────────────────────────
// Populate with real member experiences. Do not fabricate stories.
export type CommunityStoryData = {
  name: string;
  role: string;
  quote: string;
  participatedIn: string;
  takeaway: string;
  initials: string;
  linkedIn?: string;
  github?: string;
  isPlaceholder: boolean;
};

// ─── Community project type ──────────────────────────────────────────────────
// Only add entries with real GitHub or demo URLs.
export type CommunityProjectData = {
  name: string;
  description: string;
  creators: string[];
  stack: string[];
  context?: string;
  status: 'building' | 'completed' | 'live';
  githubUrl?: string;
  demoUrl?: string;
  isPlaceholder: boolean;
};

export type TeamDepartment = {
  department: string;
  summary: string;
  members: TeamMember[];
};

export type StateMemberCount = {
  state: string;
  count: number;
  lat: number;
  lng: number;
};

// Derived from the raw college/institution list — names normalized, near-duplicate spellings merged,
// mapped to states, then doubled per the agreed methodology.
export const stateMembers: StateMemberCount[] = [
  { state: 'Uttar Pradesh', count: 444, lat: 26.8467, lng: 80.9462 },
  { state: 'Delhi', count: 194, lat: 28.7041, lng: 77.1025 },
  { state: 'Haryana', count: 112, lat: 29.0588, lng: 76.0856 },
  { state: 'Punjab', count: 52, lat: 31.1471, lng: 75.3412 },
  { state: 'Maharashtra', count: 32, lat: 19.7515, lng: 75.7139 },
  { state: 'Telangana', count: 32, lat: 18.1124, lng: 79.0193 },
  { state: 'Tamil Nadu', count: 28, lat: 11.1271, lng: 78.6569 },
  { state: 'Gujarat', count: 24, lat: 22.2587, lng: 71.1924 },
  { state: 'Karnataka', count: 20, lat: 15.3173, lng: 75.7139 },
  { state: 'Uttarakhand', count: 10, lat: 30.0668, lng: 79.0193 },
  { state: 'Rajasthan', count: 10, lat: 27.0238, lng: 74.2179 },
  { state: 'West Bengal', count: 10, lat: 22.9868, lng: 87.855 },
  { state: 'Andhra Pradesh', count: 6, lat: 15.9129, lng: 79.74 },
  { state: 'Madhya Pradesh', count: 6, lat: 22.9734, lng: 78.6569 },
  { state: 'Odisha', count: 4, lat: 20.9517, lng: 85.0985 },
  { state: 'Manipur', count: 2, lat: 24.6637, lng: 93.9063 },
  { state: 'Bihar', count: 2, lat: 25.0961, lng: 85.3131 },
  { state: 'Jharkhand', count: 2, lat: 23.6102, lng: 85.2799 }
];

export type Speaker = {
  name: string;
  role: string;
  topic: string;
  event: string;
  image?: string;
};

// Real speakers only — add here as more sessions happen. Photos/LinkedIn can be added once available.
export const speakers: Speaker[] = [
  {
    name: 'Nitin Pandit',
    role: 'Microsoft MVP',
    topic: 'Career guidance session',
    event: 'Ctrl + Future'
  },
  {
    name: 'Arun Chaudhary',
    role: 'Cybersecurity & OSINT Expert',
    topic: 'OSINT and cybersecurity',
    event: 'Ctrl + Future'
  },
  {
    name: 'Sarvesh Shashi Kumar',
    role: 'AI Agents Speaker',
    topic: 'Building with AI agents',
    event: 'Ctrl + Future'
  }
];

const driveImage = (fileId: string) => `https://drive.google.com/uc?export=view&id=${fileId}`;

export const techVrikshLogoUrl = '/tech-vriksh-logo.webp';

/** Student sign-up for the community itself. Free, open to anyone. */
export const communityJoinUrl = 'https://forms.gle/ZAGhsuQkudpAP9xu9';

/**
 * Application form for the unpaid core-team roles listed on the Join page.
 * A separate form from `communityJoinUrl` on purpose: the role cards used to
 * point their "Apply Now" buttons at the community sign-up, so anyone applying
 * for a position filled in a general membership form instead.
 */
export const teamHiringFormUrl = 'https://forms.gle/gqpUWDEDHaBJJ8QRA';

export const communityInstagramUrl = 'https://www.instagram.com/techvrikshofficial/';

export const communityLinkedInUrl = 'https://www.linkedin.com/company/tech-vriksh/';

// ─── Partnerships ─────────────────────────────────────────────────────────────
// Contact routes for companies and colleges, kept separate from the student
// join form above: `communityJoinUrl` is a student application, not a business
// enquiry, and a sponsor landing in it reads as a dead end.
//
// `partnershipFormUrl` is still empty, and that is not an oversight. The partner
// page renders each contact tile only when its constant is non-empty, so an
// unfilled route simply does not appear — no placeholder address, no link to
// nowhere. Fill it in and its tile shows up with no other change needed.
export const partnershipEmail = 'official.techvriksh@yahoo.com';
export const partnershipFormUrl = '';

/**
 * Venues that have genuinely hosted a Tech Vriksh event, for use as social
 * proof. Add a name here only when an entry in `events` or `collaborations`
 * records it: the `sponsors` arrays on `hackathons` are scaffold — one of them
 * literally reads 'Sample partner slot' and its notes say 'Sponsor list can be
 * swapped later' — so they are not evidence of a real arrangement.
 */
export const eventHostVenues = ['OpsTree Global, Noida', 'Unstop Office, New Delhi'];

/**
 * Collaborations with organisations outside Tech Vriksh. Shared by the Join and
 * Partner pages so the two can never drift apart — this list used to live as a
 * local `recentActivity` array inside the Join page, which is how the community
 * ended up with two versions of its own timeline (see `journeyMilestones`).
 */
export const collaborations = [
  {
    label: 'Bootcamp',
    title: 'Ethereum Build Camp',
    detail: '8-day virtual bootcamp by Aya Community — Tech Vriksh as event partner.'
  },
  {
    label: 'In-person',
    title: 'Road to Devcon 8, Delhi NCR',
    detail: 'Co-organized meetup bringing the Ethereum Build Camp community together offline.'
  },
  {
    label: 'Workshop',
    title: 'Ctrl + Future: Agentic Observability',
    detail:
      'Hands-on session hosted at OpsTree Global, Noida — part of the ongoing Ctrl + Future series.'
  }
];

export const communityGalleryPhotos = [
  driveImage('1aiE7L3NvIgTx2KHtJeedI8fPFsAgS5pz'),
  driveImage('16WoK9jiZL6212DgJ98S0DI5KUlFpV-Y4'),
  driveImage('1FwchKdqeTwaCS1B_RvktPC9PMHzsfF3T')
];

export const events: EventItem[] = [
  {
    slug: 'compilex-where-ideas-evolve-into-impact',
    title: 'CompileX',
    subtitle: 'Where Ideas Evolve Into Impact',
    kind: 'workshop',
    format: 'offline',
    status: 'past',
    dateLabel: '05 Sep, 2026',
    description:
      'A full day of hands-on building, real industry insight, and career growth at Unstop Office, Delhi — building MCP Servers, an AI job matching pipeline, and working Android apps.',
    image: '/events/compilex-where-ideas-evolve-into-impact/01.webp.jpg',
    galleryImages: [
      '/events/compilex-where-ideas-evolve-into-impact/01.webp.jpg'
    ],
    venue: 'Unstop Office, Saket, New Delhi',
    registrationUrl: 'https://luma.com/1iyvncna',
    notes: [
      'Held at Unstop Office, Saket, New Delhi',
      'Hands-on MCP Server, AI Pipeline & Android App development',
      'Full-day build session'
    ]
  },
  {
    slug: 'ctrl-future',
    title: 'Ctrl + Future',
    subtitle: 'Offline Event',
    kind: 'session',
    format: 'offline',
    status: 'past',
    dateLabel: '20 Jun, 2026',
    description:
      'Offline flagship event at OpsTree Global, Noida, with four sessions and roughly 80 to 90 attendees.',
    image: driveImage('18Cr19NBz79qP5PpNx_GzEHPIXNqu-RTO'),
    galleryImages: [
      '/events/ctrl-future/01.webp',
      '/events/ctrl-future/02.webp',
      '/events/ctrl-future/03.webp',
      '/events/ctrl-future/04.webp',
      '/events/ctrl-future/05.webp'
    ],
    venue: 'OpsTree Global, Noida',
    registrationUrl: 'https://lu.ma/tech-vriksh-ctrl-future',
    notes: ['Held at OpsTree Global, Noida', '~80–90 attendees', 'Four sessions']
  },
  // ── Temporarily hidden from the Events page (to be re-added later) ──────────
  // HackVriksh and the Pre Hackathon Series are commented out at the team's
  // request. Their `hackathons` entries further down are untouched, so the
  // (currently off-nav) Hackathons page and its detail routes still work when
  // these cards come back.
  // {
  //   slug: 'hackvriksh-code-create-cultivate',
  //   title: 'HackVriksh — Code. Create. Cultivate',
  //   subtitle: 'Hackathon',
  //   kind: 'hackathon',
  //   format: 'offline',
  //   status: 'past',
  //   dateLabel: '16 Oct, 2025',
  //   description:
  //     'The flagship hackathon for Tech Vriksh, designed around practical problem solving, mentor feedback, and post-event continuity.',
  //   image: driveImage('1bPAl9b3kwUyu7Modb3umroMP3Goxt5-4'),
  //   registrationUrl: 'https://lu.ma/tech-vriksh-hackvriksh',
  //   notes: ['Flagship hackathon', 'Official poster supplied by the team']
  // },
  // {
  //   slug: 'pre-hackathon-series',
  //   title: 'Pre Hackathon Series',
  //   subtitle: 'Hackathon Prep',
  //   kind: 'hackathon',
  //   status: 'upcoming',
  //   dateLabel: 'Dates to be announced',
  //   description:
  //     'Warm-up sessions before HackVriksh: forming balanced teams and defining roles, then shaping a practical problem statement into a buildable project.',
  //   image: '/sample/hackathon-02.svg',
  //   registrationUrl: 'https://lu.ma/tech-vriksh-pre-hackathon-series',
  //   notes: ['Session 1: Team setup', 'Session 2: Idea framing']
  // },
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: 'techpath-2o-discover-decide-dominate',
    title: 'Techpath 2.O — Discover. Decide. Dominate',
    subtitle: 'Offline Event',
    kind: 'session',
    format: 'offline',
    status: 'past',
    dateLabel: '31 Aug, 2025',
    description:
      'A follow-up Techpath edition with a refreshed speaker set, updated student questions, and a tighter offline agenda.',
    image: driveImage('1cL4eJXDI5veYhzdOrCmHLCeggGefojzw'),
    galleryImages: [
      '/events/techpath-2o-discover-decide-dominate/01.webp',
      '/events/techpath-2o-discover-decide-dominate/02.webp',
      '/events/techpath-2o-discover-decide-dominate/03.webp',
      '/events/techpath-2o-discover-decide-dominate/04.webp',
      '/events/techpath-2o-discover-decide-dominate/05.webp'
    ],
    // The event's own photographs show the venue signage and a slide reading
    // "31 August 2025 · Thoughtworks Office, Gurgaon".
    venue: 'Thoughtworks Office, Gurgaon',
    registrationUrl: 'https://lu.ma/tech-vriksh-techpath-2'
  },
  {
    slug: 'tech-baithak',
    title: 'Tech Baithak',
    subtitle: 'Offline Event',
    kind: 'session',
    format: 'offline',
    status: 'past',
    dateLabel: '15 Nov, 2025',
    description:
      'An informal discussion evening with peer questions, quick speaker notes, and room for open conversation.',
    image: driveImage('1D0Z6SFOyr7ygd9kVF-3RW48cBjtWU5kL'),
    // Four real photographs from the evening. Only the lead frame is landscape —
    // the rest of that folder is portrait phone shots — so it goes first, which
    // is also the frame the hero rotation reads.
    galleryImages: [
      '/events/tech-baithak/01.webp',
      '/events/tech-baithak/02.webp',
      '/events/tech-baithak/03.webp',
      '/events/tech-baithak/04.webp'
    ],
    venue: 'Community meetup room',
    registrationUrl: 'https://lu.ma/tech-vriksh-tech-baithak'
  },
  {
    slug: 'techpath-1o-discover-decide-dominate',
    title: 'Techpath 1.O — Discover. Decide. Dominate',
    subtitle: 'Offline Event',
    kind: 'session',
    format: 'offline',
    status: 'past',
    dateLabel: '31 May, 2025',
    description:
      'An offline direction-setting session that helped students connect their current skills with a practical next step.',
    image: driveImage('1cbLAmp8eTojerH_DdxDt4oPqNuN9IES-'),
    galleryImages: [
      '/events/techpath-1o-discover-decide-dominate/01.webp',
      '/events/techpath-1o-discover-decide-dominate/02.webp',
      '/events/techpath-1o-discover-decide-dominate/03.webp',
      '/events/techpath-1o-discover-decide-dominate/04.webp',
      '/events/techpath-1o-discover-decide-dominate/05.webp'
    ],
    venue: 'Noida campus hall',
    registrationUrl: 'https://lu.ma/tech-vriksh-techpath-1'
  },
  {
    slug: 'ai-rap-battle-build-with-gemini-in-python',
    title: 'AI Rap Battle: Build with Gemini in Python',
    subtitle: 'Online Workshop',
    kind: 'workshop',
    format: 'online',
    status: 'past',
    dateLabel: '10 May, 2025',
    description:
      'A light competition-format coding session where participants used Python and Gemini APIs to build playful generative ideas quickly.',
    image: driveImage('1jXshfCuzg-Qp_IgZ45ZWXig80netge2l'),
    registrationUrl: 'https://lu.ma/tech-vriksh-ai-rap-battle'
  },
  {
    slug: 'hands-on-workshop-on-neural-networks',
    title: 'Hands-on Workshop on Neural Networks',
    subtitle: 'Online Workshop',
    kind: 'workshop',
    format: 'online',
    status: 'past',
    dateLabel: '04 May, 2025',
    description:
      'An approachable neural networks session with forward passes, loss functions, and a clear explanation of what the model is actually learning.',
    image: driveImage('1qJRHW8_UDww9xj3iov685_afyfEBhoar'),
    // This was an online session, so the record only contains screen captures
    // from the live call rather than photographs.
    galleryImages: [
      '/events/hands-on-workshop-on-neural-networks/01.webp',
      '/events/hands-on-workshop-on-neural-networks/02.webp',
      '/events/hands-on-workshop-on-neural-networks/03.webp',
      '/events/hands-on-workshop-on-neural-networks/04.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-neural-networks'
  },
  {
    slug: 'learn-web-development-in-a-fun-way-using-games',
    title: 'Learn Web Development in a Fun Way Using Games',
    subtitle: 'Online Workshop',
    kind: 'workshop',
    format: 'online',
    status: 'past',
    dateLabel: '12 Apr, 2025',
    description:
      'A workshop that teaches HTML, CSS, and logic through small game-style exercises instead of a standard slide deck.',
    image: driveImage('1Q9dWqGSRMEY4VQeOYyL6xcFTaOZoMObd'),
    // Online session — screen captures from the live call, not photographs.
    galleryImages: [
      '/events/learn-web-development-in-a-fun-way-using-games/01.webp',
      '/events/learn-web-development-in-a-fun-way-using-games/02.webp',
      '/events/learn-web-development-in-a-fun-way-using-games/03.webp',
      '/events/learn-web-development-in-a-fun-way-using-games/04.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-web-dev-games'
  },
  {
    slug: 'research-mastery-workshop',
    title: 'Research Mastery Workshop',
    subtitle: 'Online Session',
    kind: 'session',
    format: 'online',
    status: 'past',
    dateLabel: '29 Mar, 2025',
    description:
      'A focused session on reading technical papers, framing research questions, and turning curiosity into a workable plan.',
    image: driveImage('1cYkopuhOwNbwTMozWwhkwJ2xMujFhJKN'),
    // Online session — screen captures from the live call, not photographs.
    galleryImages: [
      '/events/research-mastery-workshop/01.webp',
      '/events/research-mastery-workshop/02.webp',
      '/events/research-mastery-workshop/03.webp',
      '/events/research-mastery-workshop/04.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-research-mastery'
  },
  {
    slug: 'hands-on-workshop-on-gen-ai',
    title: 'Hands-on Workshop on Gen AI',
    subtitle: 'Online Workshop',
    kind: 'workshop',
    format: 'online',
    status: 'past',
    dateLabel: '23 Mar, 2025',
    description:
      'An introductory GenAI build session covering prompting, API basics, and small experiments that students can extend later.',
    image: driveImage('1MdbeE963RHwxVRo6pmug1Q8odh5is3Po'),
    // Online session — screen captures from the live call, not photographs.
    galleryImages: [
      '/events/hands-on-workshop-on-gen-ai/01.webp',
      '/events/hands-on-workshop-on-gen-ai/02.webp',
      '/events/hands-on-workshop-on-gen-ai/03.webp',
      '/events/hands-on-workshop-on-gen-ai/04.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-gen-ai'
  },
  {
    slug: 'career-guidance-workshop-balance-your-cgpa-internships-hackathons',
    title: 'Career Guidance Workshop: Balance your CGPA, Internships, Hackathons',
    subtitle: 'Online Session',
    kind: 'session',
    format: 'online',
    status: 'past',
    dateLabel: '15 Mar, 2025',
    description:
      'A practical session on prioritising academics, internships, and build work without burning out in the middle of a semester.',
    image: driveImage('1oeYmN5-sKXK3Vw7IJBjgeNE3XYcIisoa'),
    // Online session, and the record holds only two usable captures from it.
    galleryImages: [
      '/events/career-guidance-workshop-balance-your-cgpa-internships-hackathons/01.webp',
      '/events/career-guidance-workshop-balance-your-cgpa-internships-hackathons/02.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-career-guidance'
  },
  {
    slug: '2-day-data-science-hands-on-workshop',
    title: '2-Day Data Science Hands-on Workshop',
    subtitle: 'Online Workshop',
    kind: 'workshop',
    format: 'online',
    status: 'past',
    dateLabel: '25–26 Feb, 2025',
    description:
      'A two-part practical workshop on cleaning datasets, building simple models, and interpreting results with notebooks.',
    image: driveImage('14S9fO9yrxhLKj87w0d1rEP9_YX147Ksi'),
    // Online workshop — screen captures from the two live sessions, not photographs.
    galleryImages: [
      '/events/2-day-data-science-hands-on-workshop/01.webp',
      '/events/2-day-data-science-hands-on-workshop/02.webp',
      '/events/2-day-data-science-hands-on-workshop/03.webp',
      '/events/2-day-data-science-hands-on-workshop/04.webp'
    ],
    registrationUrl: 'https://lu.ma/tech-vriksh-data-science-workshop'
  }
];

export const hackathons: HackathonDetail[] = [
  {
    slug: 'hackvriksh-code-create-cultivate',
    title: 'HackVriksh',
    tagline: 'Code. Create. Cultivate',
    description:
      'HackVriksh is the flagship hackathon for Tech Vriksh. The sample version here shows how the challenge, support, and follow-up sections can be presented cleanly.',
    registrationUrl: 'https://lu.ma/tech-vriksh-hackvriksh',
    heroMetric: 'Flagship hackathon',
    coverImage: driveImage('1bPAl9b3kwUyu7Modb3umroMP3Goxt5-4'),
    tracks: [
      {
        name: 'Track A: Student Productivity',
        description: 'Build tools that help students plan, track, or simplify everyday academic work.'
      },
      {
        name: 'Track B: Community Utility',
        description: 'Create something that helps a student community share knowledge or coordinate better.'
      },
      {
        name: 'Track C: Applied AI',
        description: 'Use AI in a grounded way for workflows, support, or practical student-facing use cases.'
      }
    ],
    sponsors: ['OpsTree Global', 'ThoughtWorks', 'Microsoft', 'Sample partner slot'],
    prizes: ['First prize: sample trophy + certificate', 'Second prize: sample certificate + mentor session', 'Community choice award'],
    faqs: [
      {
        question: 'Who can participate?',
        answer: 'This sample page assumes engineering students, with team formation rules to be finalised later.'
      },
      {
        question: 'What format will it follow?',
        answer: 'The sample layout is built for an offline hackathon with mentor support and staged judging.'
      }
    ],
    notes: ['Sample timeline ready', 'Sponsor list can be swapped later']
  },
  {
    slug: 'pre-hackathon-series',
    title: 'Pre Hackathon Series',
    tagline: 'Warm-up sessions before the main event',
    description:
      'A sample prep series for HackVriksh that shows the event flow before the main hackathon day arrives.',
    registrationUrl: 'https://lu.ma/tech-vriksh-pre-hackathon-series',
    heroMetric: 'Prep series',
    coverImage: '/sample/hackathon-02.svg',
    tracks: [
      {
        name: 'Session 1: Team setup',
        description: 'How to form balanced teams and define roles before the challenge begins.'
      },
      {
        name: 'Session 2: Idea framing',
        description: 'How to shape a practical problem statement into a buildable project.'
      }
    ],
    sponsors: ['Sample sponsor 1', 'Sample sponsor 2'],
    prizes: ['Workshop certificate', 'Priority queue for HackVriksh support'],
    faqs: [
      {
        question: 'How is this connected to HackVriksh?',
        answer: 'It acts as a warm-up series and onboarding path for the flagship hackathon.'
      }
    ],
    notes: ['Sample schedule ready', 'Relationship to HackVriksh shown clearly']
  }
];

export const teamDepartments: TeamDepartment[] = [
  {
    department: 'Leadership',
    summary: 'Guides community vision, ecosystem strategy, and strategic institutional partnerships.',
    members: [
      {
        name: 'Krishna Agarwal',
        role: 'Founder',
        image: '/team/Krishna Agarwal (1).jpeg',
        focus: 'Community direction, ecosystem strategy, and partnerships',
        linkedinUrl: 'https://www.linkedin.com/in/krishna-agarwal13/'
      }
    ]
  },
  {
    department: 'Director Team',
    summary: 'Drives cross-functional execution, community growth initiatives, and organizational leadership.',
    members: [
      {
        name: 'Geetanjali',
        role: 'Director of Design and Content',
        image: '/team/Geetanjali.jpeg',
        focus: 'Visual direction, brand identity, and creative strategy',
        linkedinUrl: 'https://www.linkedin.com/in/geetanjali-y-7146aa210/'
      },
      {
        name: 'Rohan Sharma',
        role: 'Director of Marketing and Growth',
        image: '/team/Rohan Sharma.jpeg',
        focus: 'Audience growth, outreach strategy, and brand visibility',
        linkedinUrl: 'https://www.linkedin.com/in/rohan-sharma-021429307/'
      },
      {
        name: 'Bharat Chadha',
        role: 'Director of PR and Outreach',
        image: '/team/Bharat Chadha (2).jpeg',
        focus: 'Public relations, institutional tie-ups, and ecosystem reach',
        linkedinUrl: 'https://www.linkedin.com/in/bharat-chadha2006/'
      }
    ]
  },
  {
    department: 'Tech & Operations',
    summary: 'Manages platform architecture, technical infrastructure, and end-to-end community operations.',
    members: [
      {
        name: 'Anurag Kumar',
        role: 'Tech & Operations Lead',
        image: '/team/Anurag Kumar.jpeg',
        focus: 'Platform development, technical infrastructure, and operations',
        linkedinUrl: 'https://www.linkedin.com/in/anurag-kumar-b6a3753bb/'
      }
    ]
  },
  {
    department: 'Design',
    summary: 'Shapes user interfaces, promotional visual assets, and cohesive design systems.',
    members: [
      {
        name: 'Gayathri Komanduri',
        role: 'Design Team',
        image: '/team/Gayathri Komanduri (2).jpeg',
        focus: 'Visual design, UI/UX, and event design assets',
        linkedinUrl: 'https://www.linkedin.com/in/gayathri-komanduri20/'
      },
      {
        name: 'Manan Lamba',
        role: 'Design Team',
        image: '/team/Manan Lamba.jpeg',
        focus: 'Creative assets, graphic design, and brand styling',
        linkedinUrl: 'https://www.linkedin.com/company/tech-vriksh/'
      }
    ]
  },
  {
    department: 'Content Writing',
    summary: 'Articulates the community story through announcements, event guides, and written narratives.',
    members: [
      {
        name: 'Yashmita Kalyanadurg',
        role: 'Content Writer',
        image: '/team/Yashmita Kalyanadurg.jpeg',
        focus: 'Content writing, storytelling, and editorial pieces',
        linkedinUrl: 'https://www.linkedin.com/in/yashmita-kalyanadurg-205a1939b/'
      },
      {
        name: 'Mansi Verma',
        role: 'Content Writer',
        image: '/team/Mansi Verma.jpeg',
        focus: 'Event copies, announcements, and written communication',
        linkedinUrl: 'https://www.linkedin.com/company/tech-vriksh/'
      }
    ]
  },
  {
    department: 'Research',
    summary: 'Turns emerging tech concepts into structured workshop outlines and speaker briefs.',
    members: [
      {
        name: 'Riya Srivastava',
        role: 'Research Analyst',
        image: '/team/Riya Srivastava (2).jpeg',
        focus: 'Research briefs, curriculum planning, and content validation',
        linkedinUrl: 'https://www.linkedin.com/in/riya-srivastava-385b8932a/'
      },
      {
        name: 'Nikhil Bindal',
        role: 'Research Analyst',
        image: '/team/Nikhil Bindal.jpeg',
        focus: 'Technology trends, topic analysis, and speaker briefs',
        linkedinUrl: 'https://www.linkedin.com/in/nikhil-bindal-185403339/'
      },
      {
        name: 'Tejaswi Anand',
        role: 'Research Analyst',
        image: '/team/Tejaswi Anand.jpeg',
        focus: 'Topic frameworks, session research, and domain insights',
        linkedinUrl: 'https://www.linkedin.com/in/anandtejaswi/'
      }
    ]
  },
  {
    department: 'Video Editing',
    summary: 'Produces polished event highlights, recaps, reels, and video storytelling.',
    members: [
      {
        name: 'Gunjan Kumari',
        role: 'Video Editor',
        image: '/team/Gunjan Kumari (1).jpeg',
        focus: 'Event highlight cuts, reels, and video post-production',
        linkedinUrl: 'https://www.linkedin.com/in/gunjan-kushwaha-78149b311/'
      },
      {
        name: 'Divyansh Singh',
        role: 'Video Editor',
        image: '/team/Divyansh Singh (1).jpeg',
        focus: 'Session footage edits, recaps, and video storytelling',
        linkedinUrl: 'http://www.linkedin.com/in/divyansh-singh-08-31-'
      },
      {
        name: 'Akshay Rao',
        role: 'Video Editor',
        image: '/team/Akshay Rao.jpeg',
        focus: 'Motion edits, teasers, and visual media production',
        linkedinUrl: 'https://www.linkedin.com/company/tech-vriksh/'
      }
    ]
  },
  {
    department: 'WhatsApp Community',
    summary: 'Welcomes new members, facilitates discussions, and manages daily community flow.',
    members: [
      {
        name: 'Janvi Narang',
        role: 'WhatsApp Community Manager',
        image: '/team/Janvi Narang (2).jpeg',
        focus: 'Member onboarding, community queries, and discussions',
        linkedinUrl: 'https://www.linkedin.com/in/janvi-narang-2b2b18381'
      },
      {
        name: 'Depender Yadav',
        role: 'WhatsApp Community Manager',
        image: '/team/Depender Yadav.png',
        focus: 'Community engagement, group discussions, and student support',
        linkedinUrl: 'https://www.linkedin.com/in/deepak-yadav2006/'
      },
      {
        name: 'Tanishak Tyagi',
        role: 'WhatsApp Community Manager',
        image: '/team/Tanishak Tyagi (3).jpeg',
        focus: 'Group flow, event alerts, and student coordination',
        linkedinUrl: 'https://www.linkedin.com/in/tanishak-tyagi-744501319/'
      }
    ]
  },
  {
    department: 'Social Media',
    summary: 'Maintains active presence, engagement, and visibility across public channels.',
    members: [
      {
        name: 'Pragati Jha',
        role: 'Social Media Strategist',
        image: '/team/Pragati Jha.jpeg',
        focus: 'Social media growth, campaigns, and audience engagement',
        linkedinUrl: 'https://www.linkedin.com/in/pragati-jha-445319365'
      },
      {
        name: 'Sampada Singh',
        role: 'Social Media Manager',
        image: '/team/Sampada Singh.jpeg',
        focus: 'Content calendar, campaign publishing, and brand outreach',
        linkedinUrl: 'https://www.linkedin.com/in/sampada-singh-599421359/'
      }
    ]
  },
  {
    department: 'Anchors',
    summary: 'Hosts events, moderates speaker sessions, and energises community audiences.',
    members: [
      {
        name: 'Sneha Dingoriya',
        role: 'Anchor / Host',
        image: '/team/Sneha.jpeg',
        focus: 'Event hosting, stage delivery, and live session transitions',
        linkedinUrl: 'https://www.linkedin.com/in/sneha-dingoriya-8949ba368/'
      }
    ]
  }
];

// ─── Derived community totals ─────────────────────────────────────────────────
// Counted from the records above rather than typed out, so a stated figure can
// never drift from the data behind it. The About page previously claimed a team
// of 19 while `teamDepartments` held 14.
export const teamMemberCount = teamDepartments.reduce(
  (total, department) => total + department.members.length,
  0
);

export const communityMemberTotal = stateMembers.reduce((total, entry) => total + entry.count, 0);

export const communityStateCount = stateMembers.length;

// ─── Public-facing figures ────────────────────────────────────────────────────
// What the site actually shows. The exact counts above stay the internal source
// of truth and still drive the map's per-state markers, but they are not quoted
// in copy any more: a precise headcount is stale the day after someone joins,
// and it invites a reader to check the arithmetic instead of reading the point.
// These are round, deliberately approximate, and defined once — change a figure
// here and the homepage, footer, About and Partner pages all follow.
export type PublicStat = {
  count: number;
  suffix: string;
  label: string;
  /** Optional qualifier rendered under the label. */
  note?: string;
};

export const publicStats: Record<'members' | 'states' | 'events' | 'team', PublicStat> = {
  members: { count: 1000, suffix: '+', label: 'Community members' },
  states: { count: 15, suffix: '+', label: 'States' },
  events: { count: 15, suffix: '+', label: 'Events' },
  team: { count: 20, suffix: '+', label: 'Core team', note: 'Working constantly' }
};

/**
 * `1000+`, `15+` … for prose and for static stat strips. Stat blocks that count
 * up pass `count` and `suffix` to `<Counter />` instead, so the suffix is never
 * spelled out twice.
 */
export const statText = (stat: PublicStat) => `${stat.count}${stat.suffix}`;

/** Whoever `teamDepartments` records as Founder — the contact for partnerships. */
export const founder = teamDepartments
  .flatMap((department) => department.members)
  .find((member) => member.role === 'Founder');

// ─── Community journey milestones ───────────────────────────────────────────
// Derived from actual Tech Vriksh events — do not add milestones without
// a corresponding real event, date, or verifiable fact.
export type JourneyMilestoneData = {
  period: string;
  title: string;
  description: string;
  isFuture?: boolean;
};

export const journeyMilestones: JourneyMilestoneData[] = [
  {
    period: 'Feb – Mar 2025',
    title: 'First Workshops',
    description:
      'Online sessions on Data Science, Generative AI, and career guidance. The first attempts at practical, structured learning for the community.',
  },
  {
    period: 'Apr – May 2025',
    title: 'Regular Rhythm',
    description:
      'Web development, neural networks, research skills, and the AI Rap Battle workshop. Regular sessions started pulling a consistent audience.',
  },
  {
    period: 'May 2025',
    title: 'First Offline — Techpath 1.O',
    description:
      'An offline direction-setting session at a Noida campus — helping students connect their current skills to a practical next step.',
  },
  {
    period: 'Oct 2025',
    title: 'HackVriksh',
    description:
      'The flagship hackathon. Practical problem solving, mentor feedback, and a format built to continue after the event ended.',
  },
  {
    period: 'Nov 2025',
    title: 'Tech Baithak',
    description:
      'An informal discussion evening — peer questions, open conversation, and no slide decks. The community talking to itself.',
  },
  {
    period: 'Jun 2026',
    title: 'Ctrl + Future — Offline at OpsTree Global',
    description:
      '80–90 attendees at OpsTree Global, Noida. Four sessions: career guidance (Microsoft MVP), OSINT and cybersecurity, AI agents, and open discussion.',
  },
  {
    period: 'Sep 2026',
    title: 'CompileX — Offline at Unstop Office',
    description:
      'Full-day hands-on building at Unstop Office, Saket. Live sessions on MCP servers, AI pipelines, and Android app development.',
  },
  {
    period: 'What\'s next',
    title: 'Your chapter',
    description:
      'More events, more builders, more states. If you are reading this, the next milestone could involve you.',
    isFuture: true,
  },
];

// ─── Blog Posts ─────────────────────────────────────────────────────────────
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-in-everyday-life',
    title: 'AI in Everyday Life: How Artificial Intelligence Is Changing the Way We Learn',
    date: '10 Sep, 2026',
    author: 'Yashmita Kalyanadurg',
    summary: 'Artificial intelligence is becoming an increasingly important part of everyday student life. Learn how students can use AI responsibly as a personal learning assistant.',
    content: `Imagine having a study assistant available at midnight—one that can explain a difficult concept, translate a paragraph in seconds, generate practice questions, or help organise your ideas before an assignment.

This is no longer science fiction.

Artificial intelligence (AI) is becoming an increasingly important part of everyday student life. From personalised learning tools to translation and accessibility features, AI is changing the way students **learn, communicate, research, and solve problems**.

The real question is not whether AI will influence education. It already is.

The more important question is: **How can students use it responsibly and effectively?**

## What Is Artificial Intelligence?

Artificial intelligence refers to computer systems designed to perform tasks that typically require human intelligence.

These tasks can include:

**Recognising patterns**
AI can identify patterns and relationships in large amounts of information.

**Understanding language**
Modern AI systems can process and respond to human language, making it possible to interact with technology using natural conversations.

**Making predictions**
AI can analyse data and use learned patterns to predict possible outcomes.

**Generating content**
Generative AI can create text, images, audio, video, and computer code based on instructions provided by users.

Modern AI systems learn from large amounts of data and use those learned patterns to produce useful results. This makes AI increasingly valuable in education, where students often need information explained in different ways and at different levels of difficulty.

## How Students Can Use AI

AI can become a powerful learning companion when it is used responsibly.

Instead of simply asking AI to complete an assignment, students can use it to make the learning process more interactive.

### Explain Difficult Concepts

Students can ask AI to explain complicated topics in simpler language, provide analogies, or break a subject into smaller steps.

For example, a psychology student could ask an AI tool to explain **classical conditioning** in simple terms and then use that explanation as a starting point for deeper study.

### Generate Practice Questions

AI can create quizzes, flashcards, and practice problems based on a student's topic of study. This allows students to test their knowledge and identify areas where they need more practice.

### Brainstorm Ideas

When students are unsure where to begin with an assignment or project, AI can help generate ideas, organise thoughts, and suggest possible approaches.

### Translate and Simplify Information

AI-powered translation tools can help students understand learning materials written in unfamiliar languages. AI can also rewrite complicated information into simpler language.

### Get Feedback

Students can use AI to review drafts, identify unclear sections, suggest improvements, or provide feedback on structure and readability.

Used in this way, AI becomes less of an answer generator and more of a **personal learning assistant**.

## The Benefits—and the Risks

AI offers several potential benefits for students, but it also introduces important challenges.

### The Benefits

**Personalised Learning**
AI can provide explanations at different levels of difficulty, allowing students to learn according to their individual needs.

**Instant Support**
Students can receive explanations, examples, and practice material whenever they need them.

**More Efficient Learning**
AI can help reduce the time spent on routine tasks, giving students more time to focus on analysis, creativity, and problem-solving.

**A Comfortable Learning Environment**
Students can repeatedly ask questions and practise difficult topics without feeling embarrassed about making mistakes.

**Improved Accessibility**
Translation, summarisation, speech, and other AI-powered features can make educational resources easier to access and understand.

### The Risks

AI is not perfect.

It can sometimes produce inaccurate information, reflect biases present in its training data, or present an incorrect answer with a high level of confidence.

There is also a risk of **overdependence**.

When students allow AI to do all the thinking, writing, or problem-solving for them, they may miss opportunities to develop important skills such as independent thinking, creativity, research, and communication.

The goal should therefore not be to use **more AI**, but to use **better AI practices**.

## Using AI the Smart Way

The best approach is to treat AI as a **learning assistant—not a replacement for learning**.

Students can get the most value from AI by following a few simple principles.

### 1. Verify Important Information

AI-generated answers should not automatically be treated as facts. Important information should be checked against reliable books, academic sources, official websites, or trusted educational resources.

### 2. Protect Personal Information

Students should avoid sharing sensitive personal information, passwords, private documents, or other confidential data with AI systems.

### 3. Follow Academic-Integrity Rules

Different institutions may have different rules regarding AI use. Students should understand and follow their college or university's policies.

### 4. Understand What You Submit

Submitting AI-generated work without understanding it can undermine the learning process. Students should review, question, edit, and understand the material before using it.

### 5. Use AI to Learn, Not Just to Finish

Instead of asking:

**“Do my assignment for me.”**

Try asking:

**“Explain this topic, quiz me on it, and give me feedback on my answer.”**

That small change can turn AI from a shortcut into a genuine learning tool.

## The Future of Learning Is Human + AI

Artificial intelligence is changing education, but it does not replace the qualities that make learning meaningful.

Curiosity, critical thinking, creativity, communication, judgement, and the ability to question information remain essential.

AI can provide answers quickly, but students still need to determine:

**Is this information accurate?**
**Do I understand it?**
**Can I explain it myself?**
**What should I do with it?**

The strongest learners of the future may not be those who use AI the most, but those who know **when, why, and how to use it effectively**.

## Key Takeaway

Artificial intelligence is reshaping education by making information, personalised explanations, practice, and learning support more accessible.

But its real value depends on how it is used.

When students combine AI with **curiosity, critical thinking, creativity, and fact-checking**, the technology can become a powerful partner in learning—without replacing the human skills that matter most.

> **AI should not replace the way we learn. It should help us learn better.**

## References

**IBM.** *What is Artificial Intelligence (AI)?* IBM.

**UNESCO.** (2023). *Guidance for Generative AI in Education and Research.* UNESCO.`
  },
  {
    slug: 'i-asked-an-ai-to-do-my-errands',
    title: 'I Asked an AI to Do My Errands. It Actually Did Them.',
    date: '11 Sep, 2026',
    author: 'Mansi Verma',
    summary: 'The AI we all got used to talking to has quietly started doing things for us. Discover how Agentic AI is transforming tasks from passive chats to active execution.',
    content: `Last month, I watched someone type a single line into their laptop: "Book the cheapest Delhi to Rajasthan trip for Friday and add it to my calendar." Then they closed the lid and walked off to make chai. No opening tabs, no comparing prices, no copy-pasting into a calendar app. Ten minutes later, it was done. I stood there a little stunned, honestly. That's when it hit me: the AI we all got used to **talking to** has quietly started **doing things for us.**

This shift has a name: **Agentic AI.** And once you notice it, you start seeing it everywhere.

## The Difference Most People Miss:

Here's what most explainers get wrong — they treat this like a small upgrade. It isn't! A chatbot is like a friend who gives you directions. An agent is a friend who takes the keys and drives. When ChatGPT or Claude answers a question, that's still just conversation — helpful, but passive. An agent breaks your request into steps, opens a browser, checks a few sites instead of one, notices when something's gone wrong, and fixes it — all without asking you at every step. That's the real shift.

I spent a weekend reading up on why this became possible now, and it comes down to three things maturing together: AI models got better at planning multi-step tasks instead of just predicting the next word; developers built safe ways for AI to actually use software — browsers, code editors, spreadsheets; and agents finally learned to hold context through an entire task instead of forgetting step one by step four.

## Where It's Already Working:

Claude Code writes and debugs real software with barely a nudge. Customer support agents, like the one Klarna uses, resolve entire refund cases from start to finish — not just answering "where's my order," but actually processing it. Research agents can pull information from dozens of sources, cross-check them, and put together something closer to a junior analyst's report than a simple search result. None of this is a demo anymore — it's everyday infrastructure for a growing number of companies.

## Why This Matters for You:

If you're in tech right now, here's the honest takeaway: stop thinking of AI as autocomplete, and start thinking of it as a teammate that occasionally needs supervision. Students who learn to direct agents — not just chat with them — will be the ones building the next generation of tools, not just using them.

We spent the last decade teaching machines to answer questions. The next decade is about teaching them to finish tasks. That's worth paying attention to.`
  }
];

