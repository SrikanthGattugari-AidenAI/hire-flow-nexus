
import { subDays, format, addDays } from 'date-fns';

// Generate random dates within a range
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Mock user data
export const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&auto=format&fit=crop',
    role: 'HR Manager',
  },
  {
    id: 2,
    name: 'Jamie Smith',
    email: 'jamie.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop',
    role: 'Recruiter',
  },
  {
    id: 3,
    name: 'Taylor Wilson',
    email: 'taylor.wilson@example.com',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&auto=format&fit=crop',
    role: 'Hiring Manager',
  },
  {
    id: 4,
    name: 'Morgan Lee',
    email: 'morgan.lee@example.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop',
    role: 'Interview Panel',
  },
];

// Mock department data
export const departments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Sales' },
  { id: 5, name: 'Product' },
  { id: 6, name: 'Design' },
  { id: 7, name: 'Customer Support' },
  { id: 8, name: 'Human Resources' },
];

// Mock locations
export const locations = [
  { id: 1, name: 'San Francisco, CA' },
  { id: 2, name: 'New York, NY' },
  { id: 3, name: 'Austin, TX' },
  { id: 4, name: 'Remote' },
  { id: 5, name: 'Chicago, IL' },
  { id: 6, name: 'London, UK' },
];

// Mock job statuses
export const jobStatuses = [
  { id: 1, name: 'Open', color: 'bg-green-500' },
  { id: 2, name: 'Paused', color: 'bg-yellow-500' },
  { id: 3, name: 'Closed', color: 'bg-red-500' },
  { id: 4, name: 'Draft', color: 'bg-gray-400' },
];

// Mock application stages
export const applicationStages = [
  { id: 1, name: 'New', color: 'bg-blue-500' },
  { id: 2, name: 'Screening', color: 'bg-purple-500' },
  { id: 3, name: 'Interview', color: 'bg-indigo-500' },
  { id: 4, name: 'Assessment', color: 'bg-teal-500' },
  { id: 5, name: 'Offer', color: 'bg-pink-500' },
  { id: 6, name: 'Hired', color: 'bg-green-500' },
  { id: 7, name: 'Rejected', color: 'bg-red-500' },
];

// Mock jobs data
export const jobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: departments[0],
    location: locations[0],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    applications: 18,
    description: 'We are looking for an experienced Frontend Developer with strong React skills to join our team.',
    requirements: [
      '5+ years of experience in frontend development',
      'Strong proficiency with React',
      'Experience with TypeScript',
      'Experience with state management libraries',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 2,
    title: 'Marketing Manager',
    department: departments[1],
    location: locations[1],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    applications: 12,
    description: 'We need a Marketing Manager to lead our digital marketing initiatives and team.',
    requirements: [
      '3+ years of experience in marketing',
      'Experience with digital marketing',
      'Strong leadership skills',
      'Data-driven approach to marketing',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 3,
    title: 'Financial Analyst',
    department: departments[2],
    location: locations[2],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    applications: 9,
    description: 'We are seeking a Financial Analyst to join our finance team.',
    requirements: [
      'Bachelor\'s degree in Finance, Accounting, or related field',
      '2+ years of experience in financial analysis',
      'Strong Excel skills',
      'Experience with financial reporting',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 4,
    title: 'Sales Representative',
    department: departments[3],
    location: locations[4],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    applications: 24,
    description: 'We are looking for a motivated Sales Representative to expand our customer base.',
    requirements: [
      'Previous experience in sales',
      'Strong communication skills',
      'Goal-oriented mindset',
      'Ability to work independently',
    ],
    benefits: [
      'Base salary + commission',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 5,
    title: 'Product Manager',
    department: departments[4],
    location: locations[3],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 18), 'yyyy-MM-dd'),
    applications: 15,
    description: 'We need a Product Manager to lead our product development initiatives.',
    requirements: [
      '3+ years of experience in product management',
      'Strong understanding of software development lifecycle',
      'Experience with agile methodologies',
      'Strong communication skills',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 6,
    title: 'UX/UI Designer',
    department: departments[5],
    location: locations[0],
    status: jobStatuses[0],
    postedDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    applications: 11,
    description: 'We are looking for a UX/UI Designer to join our design team.',
    requirements: [
      '3+ years of experience in UX/UI design',
      'Strong portfolio showcasing user-centered design process',
      'Experience with design tools (Figma, Sketch)',
      'Strong communication skills',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 7,
    title: 'Customer Support Specialist',
    department: departments[6],
    location: locations[3],
    status: jobStatuses[1],
    postedDate: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
    applications: 19,
    description: 'We are looking for a Customer Support Specialist to help our customers.',
    requirements: [
      'Previous experience in customer support',
      'Strong communication skills',
      'Problem-solving abilities',
      'Patience and empathy',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
  {
    id: 8,
    title: 'HR Coordinator',
    department: departments[7],
    location: locations[1],
    status: jobStatuses[2],
    postedDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    applications: 8,
    description: 'We need an HR Coordinator to support our HR team.',
    requirements: [
      'Bachelor\'s degree in Human Resources or related field',
      '1+ years of experience in HR',
      'Strong organizational skills',
      'Knowledge of HR processes and best practices',
    ],
    benefits: [
      'Competitive salary',
      'Remote work options',
      'Healthcare benefits',
      'Professional development budget',
    ],
  },
];

// Mock candidates data
export const candidates = [
  {
    id: 1,
    name: 'Emma Thompson',
    email: 'emma.thompson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&auto=format&fit=crop',
    jobId: 1,
    appliedDate: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    status: applicationStages[2],
    resume: {
      url: '#',
      summary: 'Experienced frontend developer with 6 years of experience working with React and TypeScript.',
      experience: [
        {
          company: 'TechCorp',
          position: 'Senior Frontend Developer',
          duration: '2019 - Present',
          description: 'Led development of multiple web applications using React and TypeScript.'
        },
        {
          company: 'WebInnovate',
          position: 'Frontend Developer',
          duration: '2016 - 2019',
          description: 'Developed responsive web interfaces using React and Redux.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S. Computer Science',
          year: '2016'
        }
      ],
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Redux', 'GraphQL']
    },
    notes: [
      {
        user: users[0],
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        content: 'Great technical skills, moved to interview stage.'
      }
    ],
    interviews: [
      {
        id: 1,
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        time: '10:00 AM',
        type: 'Technical Interview',
        interviewers: [users[0], users[2]]
      }
    ],
    tags: ['React', 'Senior', 'FastTrack']
  },
  {
    id: 2,
    name: 'David Chen',
    email: 'david.chen@example.com',
    phone: '(555) 234-5678',
    location: 'New York, NY',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&auto=format&fit=crop',
    jobId: 1,
    appliedDate: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    status: applicationStages[1],
    resume: {
      url: '#',
      summary: 'Frontend developer with 3 years of experience working with React.',
      experience: [
        {
          company: 'DigitalWave',
          position: 'Frontend Developer',
          duration: '2020 - Present',
          description: 'Building web applications using React and JavaScript.'
        }
      ],
      education: [
        {
          institution: 'New York University',
          degree: 'B.S. Computer Science',
          year: '2020'
        }
      ],
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Bootstrap']
    },
    notes: [
      {
        user: users[1],
        date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        content: 'Good skills but lacks TypeScript experience.'
      }
    ],
    interviews: [],
    tags: ['React', 'Junior']
  },
  {
    id: 3,
    name: 'Sophia Martinez',
    email: 'sophia.martinez@example.com',
    phone: '(555) 345-6789',
    location: 'Austin, TX',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&auto=format&fit=crop',
    jobId: 2,
    appliedDate: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    status: applicationStages[4],
    resume: {
      url: '#',
      summary: 'Marketing Manager with 5+ years of experience in digital marketing.',
      experience: [
        {
          company: 'GrowthSpot',
          position: 'Marketing Manager',
          duration: '2018 - Present',
          description: 'Managing digital marketing campaigns across multiple channels.'
        },
        {
          company: 'MarketBoost',
          position: 'Marketing Specialist',
          duration: '2016 - 2018',
          description: 'Executing marketing campaigns and analyzing performance metrics.'
        }
      ],
      education: [
        {
          institution: 'University of Texas, Austin',
          degree: 'B.A. Marketing',
          year: '2016'
        }
      ],
      skills: ['Digital Marketing', 'SEO/SEM', 'Social Media Marketing', 'Content Strategy', 'Analytics']
    },
    notes: [
      {
        user: users[0],
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        content: 'Excellent candidate, preparing offer.'
      }
    ],
    interviews: [
      {
        id: 2,
        date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        time: '2:00 PM',
        type: 'Final Interview',
        interviewers: [users[0], users[3]]
      }
    ],
    tags: ['Marketing', 'Senior', 'FastTrack']
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '(555) 456-7890',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&auto=format&fit=crop',
    jobId: 3,
    appliedDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    status: applicationStages[3],
    resume: {
      url: '#',
      summary: 'Financial Analyst with 3+ years of experience in financial modeling and analysis.',
      experience: [
        {
          company: 'FinancePlus',
          position: 'Financial Analyst',
          duration: '2020 - Present',
          description: 'Conducting financial modeling and analysis for clients.'
        },
        {
          company: 'InvestGroup',
          position: 'Junior Analyst',
          duration: '2018 - 2020',
          description: 'Supporting senior analysts with data collection and analysis.'
        }
      ],
      education: [
        {
          institution: 'University of Chicago',
          degree: 'B.S. Finance',
          year: '2018'
        }
      ],
      skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Data Analysis', 'SQL']
    },
    notes: [
      {
        user: users[2],
        date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        content: 'Strong analytical skills, proceeding to technical assessment.'
      }
    ],
    interviews: [
      {
        id: 3,
        date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
        time: '11:00 AM',
        type: 'Initial Interview',
        interviewers: [users[2]]
      }
    ],
    tags: ['Finance', 'Mid-level']
  },
  {
    id: 5,
    name: 'Olivia Davis',
    email: 'olivia.davis@example.com',
    phone: '(555) 567-8901',
    location: 'Remote',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&auto=format&fit=crop',
    jobId: 4,
    appliedDate: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    status: applicationStages[0],
    resume: {
      url: '#',
      summary: 'Sales Representative with 4 years of experience in B2B sales.',
      experience: [
        {
          company: 'SellRight',
          position: 'Sales Representative',
          duration: '2019 - Present',
          description: 'Managing client relationships and driving revenue growth.'
        },
        {
          company: 'SalesBoost',
          position: 'Junior Sales Rep',
          duration: '2017 - 2019',
          description: 'Supporting senior sales representatives with lead generation.'
        }
      ],
      education: [
        {
          institution: 'Ohio State University',
          degree: 'B.A. Business',
          year: '2017'
        }
      ],
      skills: ['B2B Sales', 'Customer Relationship Management', 'Negotiation', 'Sales Strategy', 'Salesforce']
    },
    notes: [],
    interviews: [],
    tags: ['Sales', 'B2B']
  },
  {
    id: 6,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '(555) 678-9012',
    location: 'San Francisco, CA',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&auto=format&fit=crop',
    jobId: 5,
    appliedDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    status: applicationStages[2],
    resume: {
      url: '#',
      summary: 'Product Manager with 5 years of experience in SaaS product development.',
      experience: [
        {
          company: 'ProductHub',
          position: 'Product Manager',
          duration: '2019 - Present',
          description: 'Leading product development initiatives for SaaS products.'
        },
        {
          company: 'SaaSCo',
          position: 'Associate Product Manager',
          duration: '2017 - 2019',
          description: 'Supporting product development and user research.'
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'M.B.A.',
          year: '2017'
        }
      ],
      skills: ['Product Management', 'Agile', 'User Research', 'Product Strategy', 'Roadmap Planning']
    },
    notes: [
      {
        user: users[3],
        date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
        content: 'Great product sense, moving to panel interview.'
      }
    ],
    interviews: [
      {
        id: 4,
        date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
        time: '1:00 PM',
        type: 'Panel Interview',
        interviewers: [users[0], users[2], users[3]]
      }
    ],
    tags: ['Product', 'Senior', 'FastTrack']
  },
  {
    id: 7,
    name: 'Emily Johnson',
    email: 'emily.johnson@example.com',
    phone: '(555) 789-0123',
    location: 'Remote',
    photo: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&auto=format&fit=crop',
    jobId: 6,
    appliedDate: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    status: applicationStages[5],
    resume: {
      url: '#',
      summary: 'UX/UI Designer with 4+ years of experience creating user-centered designs.',
      experience: [
        {
          company: 'DesignWorks',
          position: 'UX/UI Designer',
          duration: '2019 - Present',
          description: 'Creating user interfaces for web and mobile applications.'
        },
        {
          company: 'CreativeSolutions',
          position: 'Junior Designer',
          duration: '2018 - 2019',
          description: 'Supporting design team with UI elements and visual assets.'
        }
      ],
      education: [
        {
          institution: 'Rhode Island School of Design',
          degree: 'B.F.A. Graphic Design',
          year: '2018'
        }
      ],
      skills: ['UI Design', 'UX Research', 'Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping']
    },
    notes: [
      {
        user: users[0],
        date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
        content: 'Excellent portfolio. Offer accepted!'
      }
    ],
    interviews: [
      {
        id: 5,
        date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
        time: '10:30 AM',
        type: 'Design Challenge',
        interviewers: [users[1], users[3]]
      },
      {
        id: 6,
        date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
        time: '3:00 PM',
        type: 'Final Interview',
        interviewers: [users[0]]
      }
    ],
    tags: ['Design', 'UX', 'UI', 'Figma']
  },
  {
    id: 8,
    name: 'Daniel Kim',
    email: 'daniel.kim@example.com',
    phone: '(555) 890-1234',
    location: 'New York, NY',
    photo: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=200&h=200&auto=format&fit=crop',
    jobId: 7,
    appliedDate: format(subDays(new Date(), 9), 'yyyy-MM-dd'),
    status: applicationStages[6],
    resume: {
      url: '#',
      summary: 'Customer Support Specialist with 3 years of experience in SaaS support.',
      experience: [
        {
          company: 'HelpDesk',
          position: 'Customer Support Specialist',
          duration: '2020 - Present',
          description: 'Providing support for SaaS customers via multiple channels.'
        },
        {
          company: 'SupportNow',
          position: 'Customer Service Rep',
          duration: '2018 - 2020',
          description: 'Handling customer inquiries and resolving issues.'
        }
      ],
      education: [
        {
          institution: 'City University of New York',
          degree: 'B.A. Communications',
          year: '2018'
        }
      ],
      skills: ['Customer Support', 'Problem-solving', 'Communication', 'CRM Systems', 'Technical Troubleshooting']
    },
    notes: [
      {
        user: users[1],
        date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
        content: 'Not a good fit for our current needs.'
      }
    ],
    interviews: [
      {
        id: 7,
        date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
        time: '11:00 AM',
        type: 'Initial Interview',
        interviewers: [users[1]]
      }
    ],
    tags: ['Support', 'SaaS']
  },
  {
    id: 9,
    name: 'Sarah Taylor',
    email: 'sarah.taylor@example.com',
    phone: '(555) 901-2345',
    location: 'Chicago, IL',
    photo: 'https://images.unsplash.com/photo-1554727242-741c14fa561c?w=200&h=200&auto=format&fit=crop',
    jobId: 8,
    appliedDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    status: applicationStages[1],
    resume: {
      url: '#',
      summary: 'HR Coordinator with 2 years of experience in HR administration.',
      experience: [
        {
          company: 'PeopleFirst',
          position: 'HR Coordinator',
          duration: '2021 - Present',
          description: 'Supporting HR team with administrative tasks and employee onboarding.'
        },
        {
          company: 'AdminPlus',
          position: 'Administrative Assistant',
          duration: '2019 - 2021',
          description: 'Providing administrative support to management team.'
        }
      ],
      education: [
        {
          institution: 'University of Illinois',
          degree: 'B.S. Human Resources',
          year: '2019'
        }
      ],
      skills: ['HR Administration', 'Onboarding', 'HRIS', 'Employee Relations', 'Benefits Administration']
    },
    notes: [
      {
        user: users[0],
        date: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
        content: 'Good experience, moving to screening call.'
      }
    ],
    interviews: [],
    tags: ['HR', 'Coordinator']
  }
];

// Mock messages data
export const messages = [
  {
    id: 1,
    candidateId: 1,
    messages: [
      {
        id: 1,
        sender: 'system',
        content: 'Conversation started with Emma Thompson',
        timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 2,
        sender: 'user',
        userId: 1,
        content: 'Hi Emma, thanks for applying to the Senior Frontend Developer position. We\'d like to schedule a technical interview with you.',
        timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 3,
        sender: 'candidate',
        candidateId: 1,
        content: 'Hi Alex, thank you for considering my application. I\'m available for an interview next week.',
        timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 4,
        sender: 'user',
        userId: 1,
        content: 'Great! How about next Tuesday at 10:00 AM PT?',
        timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 5,
        sender: 'candidate',
        candidateId: 1,
        content: 'That works perfectly for me. Looking forward to it!',
        timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 6,
        sender: 'user',
        userId: 1,
        content: 'Excellent! You\'ll be meeting with me and Taylor from the engineering team. We\'ll send a calendar invite shortly.',
        timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  },
  {
    id: 2,
    candidateId: 3,
    messages: [
      {
        id: 1,
        sender: 'system',
        content: 'Conversation started with Sophia Martinez',
        timestamp: format(subDays(new Date(), 6), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 2,
        sender: 'user',
        userId: 2,
        content: 'Hi Sophia, this is Jamie from the recruiting team. Thanks for applying to the Marketing Manager position!',
        timestamp: format(subDays(new Date(), 6), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 3,
        sender: 'candidate',
        candidateId: 3,
        content: 'Hi Jamie, thank you for reaching out. I\'m very excited about this opportunity.',
        timestamp: format(subDays(new Date(), 6), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 4,
        sender: 'user',
        userId: 2,
        content: 'Your experience looks great! Are you available for a phone screening this week?',
        timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 5,
        sender: 'candidate',
        candidateId: 3,
        content: 'Absolutely! I\'m free on Wednesday or Thursday afternoon.',
        timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 6,
        sender: 'user',
        userId: 2,
        content: 'Let\'s schedule for Thursday at 2:00 PM. Does that work for you?',
        timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
      },
      {
        id: 7,
        sender: 'candidate',
        candidateId: 3,
        content: 'Thursday at 2:00 PM is perfect. Thank you!',
        timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
      },
    ],
  },
];

// Mock activity data
export const activities = [
  {
    id: 1,
    type: 'application',
    content: 'New application received for Senior Frontend Developer',
    candidateId: 1,
    jobId: 1,
    timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 2,
    type: 'status_change',
    content: 'Sophia Martinez moved to Offer stage',
    candidateId: 3,
    jobId: 2,
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 3,
    type: 'interview',
    content: 'Interview scheduled with James Wilson',
    candidateId: 4,
    jobId: 3,
    timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 4,
    type: 'job_post',
    content: 'New job posted: UX/UI Designer',
    jobId: 6,
    timestamp: format(subDays(new Date(), 20), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 5,
    type: 'status_change',
    content: 'Emily Johnson moved to Hired stage',
    candidateId: 7,
    jobId: 6,
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 6,
    type: 'application',
    content: 'New application received for Financial Analyst',
    candidateId: 4,
    jobId: 3,
    timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 7,
    type: 'status_change',
    content: 'Daniel Kim moved to Rejected stage',
    candidateId: 8,
    jobId: 7,
    timestamp: format(subDays(new Date(), 4), 'yyyy-MM-dd HH:mm:ss'),
  },
  {
    id: 8,
    type: 'note',
    content: 'New note added for Emma Thompson',
    candidateId: 1,
    jobId: 1,
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'),
  },
];

// Mock dashboard data
export const dashboardData = {
  summary: {
    newApplications: 12,
    openJobs: 5,
    interviewsToday: 3,
    hiredThisMonth: 2,
  },
  applicationTrends: [
    { date: format(subDays(new Date(), 6), 'MM-dd'), applications: 5 },
    { date: format(subDays(new Date(), 5), 'MM-dd'), applications: 7 },
    { date: format(subDays(new Date(), 4), 'MM-dd'), applications: 3 },
    { date: format(subDays(new Date(), 3), 'MM-dd'), applications: 8 },
    { date: format(subDays(new Date(), 2), 'MM-dd'), applications: 12 },
    { date: format(subDays(new Date(), 1), 'MM-dd'), applications: 10 },
    { date: format(new Date(), 'MM-dd'), applications: 6 },
  ],
  hiringStatus: [
    { name: 'New', value: 18 },
    { name: 'Screening', value: 12 },
    { name: 'Interview', value: 8 },
    { name: 'Assessment', value: 5 },
    { name: 'Offer', value: 3 },
    { name: 'Hired', value: 2 },
    { name: 'Rejected', value: 7 },
  ],
  departmentDistribution: [
    { name: 'Engineering', value: 25 },
    { name: 'Marketing', value: 15 },
    { name: 'Finance', value: 10 },
    { name: 'Sales', value: 20 },
    { name: 'Product', value: 12 },
    { name: 'Design', value: 8 },
    { name: 'Customer Support', value: 5 },
    { name: 'Human Resources', value: 5 },
  ],
};
