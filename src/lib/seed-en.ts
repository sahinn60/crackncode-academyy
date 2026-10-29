export type CourseEn = {
  title: string;
  subtitle: string;
  description: string;
  instructor_name: string;
  instructor_title: string;
  instructor_bio: string;
  outcomes: string[];
  curriculum: { title: string; lessons: { title: string; minutes: number }[] }[];
};

export const coursesEn: Record<string, CourseEn> = {
  "full-stack-web-development": {
    title: "Full-Stack Web Development",
    subtitle:
      "HTML to React, Node.js and databases — the complete path to becoming a full-stack web developer in one course.",
    description:
      "Start from zero and learn to build a complete web application. In this course you will work with HTML, CSS, JavaScript, React, Node.js, Express and MongoDB. Every module includes a hands-on project, so when you finish you have work worth showing in your portfolio.\n\nThe course is designed in plain Bangla with real job requirements in mind. At the end there is a full-stack project (an e-commerce app) and a code review session.",
    instructor_name: "Mehedi Hasan",
    instructor_title: "Senior Software Engineer",
    instructor_bio:
      "With over 8 years of experience he has worked in product teams at home and abroad. Making complex topics easy to understand is what he loves most.",
    outcomes: [
      "A strong foundation in HTML, CSS and JavaScript",
      "Building interactive UIs with React",
      "Creating REST APIs with Node.js and Express",
      "Designing and querying MongoDB databases",
      "A complete project with login, payments and deployment",
      "A GitHub portfolio and code review",
    ],
    curriculum: [
      {
        title: "Foundations of the Web",
        lessons: [
          { title: "How the web works", minutes: 18 },
          { title: "Page structure with HTML", minutes: 25 },
          { title: "Design with CSS", minutes: 30 },
        ],
      },
      {
        title: "JavaScript and the DOM",
        lessons: [
          { title: "Variables, functions and logic", minutes: 32 },
          { title: "DOM manipulation", minutes: 28 },
          { title: "Fetch API and asynchronous JavaScript", minutes: 30 },
        ],
      },
      {
        title: "React and the Modern Frontend",
        lessons: [
          { title: "Components and props", minutes: 30 },
          { title: "State, effects and hooks", minutes: 35 },
          { title: "Routing and form handling", minutes: 28 },
        ],
      },
      {
        title: "Backend and Deployment",
        lessons: [
          { title: "Node.js and Express API", minutes: 34 },
          { title: "MongoDB and authentication", minutes: 32 },
          { title: "Final project and deployment", minutes: 40 },
        ],
      },
    ],
  },

  "python-programming": {
    title: "Getting Started with Python Programming",
    subtitle:
      "Writing code for the first time? The easiest and most practical course for learning logic with Python.",
    description:
      "This course is arranged in small steps to remove the fear of learning programming. With Python's simple syntax you will learn logic, data structures and problem solving — right from the beginning.\n\nEvery lesson ends with hands-on practice. At the end of the course you will build a small project and see that programming really is not hard.",
    instructor_name: "Ariful Islam",
    instructor_title: "Software Engineer and Content Creator",
    instructor_bio:
      "A CSE graduate who has been working with Python and data science for 5 years. He has experience teaching programming to students in university labs.",
    outcomes: [
      "Python syntax and programming logic",
      "Lists, dictionaries and functions",
      "File and error handling",
      "The foundations of object-oriented programming",
      "Experience building a small project",
    ],
    curriculum: [
      {
        title: "Let's Begin",
        lessons: [
          { title: "Installing and setting up Python", minutes: 14 },
          { title: "First program and variables", minutes: 18 },
          { title: "Data types and input", minutes: 20 },
        ],
      },
      {
        title: "The Core of Logic",
        lessons: [
          { title: "Conditions and loops", minutes: 28 },
          { title: "Lists and tuples", minutes: 24 },
          { title: "Dictionaries and sets", minutes: 22 },
        ],
      },
      {
        title: "Functions and Files",
        lessons: [
          { title: "Functions and scope", minutes: 26 },
          { title: "Modules and packages", minutes: 20 },
          { title: "Reading and writing files", minutes: 22 },
        ],
      },
      {
        title: "Project",
        lessons: [
          { title: "Error handling", minutes: 18 },
          { title: "A simple introduction to OOP", minutes: 26 },
          { title: "Mini project: expense tracker", minutes: 35 },
        ],
      },
    ],
  },

  "ai-prompt-engineering": {
    title: "AI Prompt Engineering Masterclass",
    subtitle:
      "Learn to write prompts that get real work done from ChatGPT, Claude and Gemini.",
    description:
      "Using AI tools but the results are sometimes not what you want? The problem is not the tool, it is the prompt. In this course you will learn how to write clear, specific and effective prompts — for study, office work, content and freelancing.\n\nThere will be real examples, prompt templates and a prompt library you can use directly in your own work.",
    instructor_name: "Nusrat Jahan",
    instructor_title: "AI Trainer and Content Strategist",
    instructor_bio:
      "She has worked in digital content and brand consulting for six years. Making small businesses more productive with AI is the area she cares about.",
    outcomes: [
      "The structure and rules of a prompt",
      "The differences between ChatGPT and Claude",
      "Templates for writing content, emails and reports",
      "Prompts for image and video generation",
      "Building your own prompt library",
    ],
    curriculum: [
      {
        title: "The ABC of AI",
        lessons: [
          { title: "Meet the AI tools", minutes: 12 },
          { title: "What a prompt is and how it works", minutes: 16 },
          { title: "The 5 rules of a good prompt", minutes: 18 },
        ],
      },
      {
        title: "Prompts for Work",
        lessons: [
          { title: "Writing emails and reports", minutes: 20 },
          { title: "Content and social media", minutes: 22 },
          { title: "Prompts for studying", minutes: 18 },
        ],
      },
      {
        title: "Advanced Use",
        lessons: [
          { title: "Role prompts and chaining", minutes: 20 },
          { title: "Prompts for image generation", minutes: 22 },
          { title: "AI for data analysis", minutes: 20 },
        ],
      },
      {
        title: "Your Own Toolkit",
        lessons: [
          { title: "Organising a prompt library", minutes: 18 },
          { title: "Custom GPT and project setup", minutes: 24 },
          { title: "Final project", minutes: 30 },
        ],
      },
    ],
  },

  "react-nextjs-masterclass": {
    title: "React and Next.js Masterclass",
    subtitle:
      "Every topic you need to know for a job in modern frontend development.",
    description:
      "Learned React but cannot write it in an organised way on a large project? In this course you will learn component architecture, state management, the Next.js App Router, server components and performance optimisation.\n\nEvery module includes code reviews from real projects. At the end you will build a production-ready dashboard.",
    instructor_name: "Mehedi Hasan",
    instructor_title: "Senior Software Engineer",
    instructor_bio:
      "With over 8 years of experience he has worked in product teams at home and abroad. Making complex topics easy to understand is what he loves most.",
    outcomes: [
      "React component design patterns",
      "Hooks and state management",
      "Next.js App Router and server components",
      "API integration and authentication",
      "Performance and SEO optimisation",
    ],
    curriculum: [
      {
        title: "React Revision",
        lessons: [
          { title: "JSX and components", minutes: 20 },
          { title: "Props, state and events", minutes: 24 },
          { title: "Hooks in depth", minutes: 28 },
        ],
      },
      {
        title: "Architecture",
        lessons: [
          { title: "Folder structure and patterns", minutes: 24 },
          { title: "Context and state", minutes: 26 },
          { title: "Forms and validation", minutes: 22 },
        ],
      },
      {
        title: "Next.js",
        lessons: [
          { title: "App Router", minutes: 28 },
          { title: "Server components and data", minutes: 30 },
          { title: "Authentication flow", minutes: 26 },
        ],
      },
      {
        title: "The Final Stretch",
        lessons: [
          { title: "Performance and SEO", minutes: 24 },
          { title: "Dashboard project", minutes: 40 },
          { title: "Getting your portfolio ready", minutes: 18 },
        ],
      },
    ],
  },

  "competitive-programming-cpp": {
    title: "Competitive Programming with C++",
    subtitle:
      "A strong foundation for solving problems on online judges, in contests and at interviews.",
    description:
      "Competitive programming is not only for competitions — it builds the ability to think fast and the skill of analysing problems, which is also useful in tech interviews.\n\nStarting with C++, you will learn data structures, algorithms, dynamic programming and the core ideas of graphs. Every topic includes a problem-solving session.",
    instructor_name: "Tanvir Ahmed",
    instructor_title: "Contest Programmer",
    instructor_bio:
      "He has taken part in several national and international contests. Now he helps university students prepare for contests.",
    outcomes: [
      "C++ syntax and the STL",
      "Time and space complexity",
      "Data structures and algorithms",
      "Dynamic programming",
      "Strategies for analysing problems in contests",
    ],
    curriculum: [
      {
        title: "Foundations",
        lessons: [
          { title: "C++ setup and basics", minutes: 20 },
          { title: "Conditions, loops and functions", minutes: 22 },
          { title: "STL: vectors and strings", minutes: 26 },
        ],
      },
      {
        title: "Data Structures",
        lessons: [
          { title: "Stacks and queues", minutes: 24 },
          { title: "Sets, maps and priority queues", minutes: 28 },
          { title: "Two pointers and sliding window", minutes: 22 },
        ],
      },
      {
        title: "Algorithms",
        lessons: [
          { title: "Sorting and searching", minutes: 26 },
          { title: "Recursion and backtracking", minutes: 30 },
          { title: "Dynamic programming", minutes: 34 },
        ],
      },
      {
        title: "Contest Preparation",
        lessons: [
          { title: "Graph basics", minutes: 30 },
          { title: "Contest strategy", minutes: 20 },
          { title: "Mock contest and review", minutes: 35 },
        ],
      },
    ],
  },

  "freelancing-fiverr-upwork": {
    title: "Freelancing: Fiverr and Upwork A-Z",
    subtitle:
      "From your first gig to your first payment — a practical guide to starting freelancing from Bangladesh.",
    description:
      "Want to learn freelancing but cannot figure out where to start? In this course you will learn the whole process step by step: setting up your profile, creating gigs, writing proposals, communicating with clients and receiving payments.\n\nWhich skills get you work fastest, how to avoid scams and how to keep long-term clients — all with real examples.",
    instructor_name: "Sadia Afrin",
    instructor_title: "Top-Rated Freelancer",
    instructor_bio:
      "She has been working on Fiverr and Upwork for 6 years. Now she runs web and content projects for international clients with a small team.",
    outcomes: [
      "The realistic picture of freelancing",
      "Fiverr profile and gig optimisation",
      "A framework for writing Upwork proposals",
      "Client communication and negotiation",
      "Basics of payments and taxes",
    ],
    curriculum: [
      {
        title: "Before You Start",
        lessons: [
          { title: "Types of freelancing", minutes: 16 },
          { title: "Choosing your skill and niche", minutes: 20 },
          { title: "Starting without a portfolio", minutes: 18 },
        ],
      },
      {
        title: "Fiverr",
        lessons: [
          { title: "Setting up your profile", minutes: 24 },
          { title: "Creating your first gig", minutes: 28 },
          { title: "Managing orders and reviews", minutes: 22 },
        ],
      },
      {
        title: "Upwork",
        lessons: [
          { title: "Profile and job search", minutes: 22 },
          { title: "Proposal templates", minutes: 26 },
          { title: "Interviews and negotiation", minutes: 20 },
        ],
      },
      {
        title: "Sustainable Freelancing",
        lessons: [
          { title: "Payments and withdrawals", minutes: 18 },
          { title: "Rules for avoiding scams", minutes: 16 },
          { title: "Long-term clients", minutes: 20 },
        ],
      },
    ],
  },

  "ethical-hacking-basics": {
    title: "Ethical Hacking and Cyber Security Basics",
    subtitle:
      "Practical knowledge for keeping your website and accounts safe, right from the beginning.",
    description:
      "How cyber attacks happen, and how to protect yourself — you will learn it with real examples in this course. Network basics, password security, phishing detection, common web application vulnerabilities and the ethical side of security testing will be covered.\n\nAll testing is only on your own systems or in an authorised lab environment — the course is completely ethical and educational.",
    instructor_name: "Rakib Chowdhury",
    instructor_title: "Security Analyst",
    instructor_bio:
      "He has been working in network and application security for 7 years. Teaching students security with a safety-first approach is his goal.",
    outcomes: [
      "The foundations of network and internet security",
      "Strong passwords and 2FA",
      "Detecting phishing and social engineering",
      "Common web app vulnerabilities (OWASP)",
      "Ethical security testing and reporting",
    ],
    curriculum: [
      {
        title: "Security Foundations",
        lessons: [
          { title: "What cyber security is", minutes: 18 },
          { title: "Network and DNS basics", minutes: 24 },
          { title: "Account and password protection", minutes: 20 },
        ],
      },
      {
        title: "Common Attacks",
        lessons: [
          { title: "Phishing and scams", minutes: 22 },
          { title: "Malware and ransomware", minutes: 24 },
          { title: "Social engineering", minutes: 20 },
        ],
      },
      {
        title: "Web Security",
        lessons: [
          { title: "Introduction to the OWASP Top 10", minutes: 28 },
          { title: "SQL injection and XSS concepts", minutes: 26 },
          { title: "Secure coding practices", minutes: 24 },
        ],
      },
      {
        title: "Practice and Career",
        lessons: [
          { title: "Setting up your own lab", minutes: 25 },
          { title: "Writing reports", minutes: 20 },
          { title: "Security career paths", minutes: 18 },
        ],
      },
    ],
  },

  "data-analytics-power-bi": {
    title: "Data Analytics: Excel to Power BI",
    subtitle:
      "The skill of making decisions with data — in demand for both jobs and freelancing.",
    description:
      "Demand for data analysts is growing in Bangladesh. In this course you will learn in-depth use of Excel, data cleaning, the basics of SQL and building dashboards with Power BI.\n\nYou can start without any programming background. At the end of the course there is a complete dashboard project that you can show as part of your portfolio.",
    instructor_name: "Fahima Rahman",
    instructor_title: "Data Analyst",
    instructor_bio:
      "She has worked as a data analyst at e-commerce and fintech companies. Making reporting easy to understand is her specialty.",
    outcomes: [
      "Excel formulas and pivot tables",
      "Data cleaning and transformation",
      "Querying data with SQL",
      "Power BI dashboards",
      "Data storytelling",
    ],
    curriculum: [
      {
        title: "The Power of Excel",
        lessons: [
          { title: "Spreadsheet basics revision", minutes: 18 },
          { title: "Formulas and functions", minutes: 26 },
          { title: "Pivot tables and charts", minutes: 24 },
        ],
      },
      {
        title: "Preparing Data",
        lessons: [
          { title: "Data cleaning", minutes: 22 },
          { title: "Introduction to SQL", minutes: 28 },
          { title: "Query practice", minutes: 26 },
        ],
      },
      {
        title: "Power BI",
        lessons: [
          { title: "Installing and connecting data", minutes: 20 },
          { title: "Data modelling", minutes: 28 },
          { title: "Visualisation", minutes: 30 },
        ],
      },
      {
        title: "Project",
        lessons: [
          { title: "Dashboard design", minutes: 30 },
          { title: "Storytelling", minutes: 20 },
          { title: "Portfolio and interviews", minutes: 22 },
        ],
      },
    ],
  },

  "flutter-app-development": {
    title: "Mobile App Development with Flutter",
    subtitle:
      "Android and iOS apps from a single codebase — a complete Flutter guide in Bangla.",
    description:
      "Building mobile apps is easier now than it used to be. If you learn Flutter you can run the same code as an app on both Android and iOS. In this course you will learn the Dart language, UI design, state management, API connections and the whole process of publishing an app.\n\nEvery module involves building a small app, and at the end there is a real-world project.",
    instructor_name: "Zahid Hossain",
    instructor_title: "Mobile App Developer",
    instructor_bio:
      "With 6 years of experience he has developed apps for small startups and large companies. Teaching the practical use of Flutter is his focus.",
    outcomes: [
      "Dart programming and Flutter setup",
      "Responsive UI design",
      "State management",
      "REST APIs and local databases",
      "Publishing to the Play Store and App Store",
    ],
    curriculum: [
      {
        title: "Starting with Dart and Flutter",
        lessons: [
          { title: "Dart basics", minutes: 24 },
          { title: "Flutter setup", minutes: 20 },
          { title: "Meet widgets", minutes: 26 },
        ],
      },
      {
        title: "Building UI",
        lessons: [
          { title: "Layout and navigation", minutes: 28 },
          { title: "Forms and validation", minutes: 24 },
          { title: "Animation", minutes: 22 },
        ],
      },
      {
        title: "Data and State",
        lessons: [
          { title: "State management", minutes: 30 },
          { title: "REST API integration", minutes: 28 },
          { title: "Local storage", minutes: 22 },
        ],
      },
      {
        title: "Release",
        lessons: [
          { title: "Project: notes app", minutes: 34 },
          { title: "Testing and debugging", minutes: 24 },
          { title: "Publishing", minutes: 18 },
        ],
      },
    ],
  },

  "ui-ux-design-figma": {
    title: "UI/UX Design with Figma",
    subtitle:
      "Learn to design beautiful, usable interfaces by understanding the user.",
    description:
      "Design is not just colours and images — it is understanding the user's problem. In this course you will learn the basics of UX research, wireframes, prototypes, design systems and the handoff process using Figma.\n\nStarting from zero you will build three complete case studies that will work as your portfolio on freelancing platforms.",
    instructor_name: "Nusrat Jahan",
    instructor_title: "Product Designer",
    instructor_bio:
      "She has been working as a product designer for 5 years. Her Figma community tutorials are known for their simple language.",
    outcomes: [
      "UX research and user flows",
      "Wireframes and UI in Figma",
      "Prototypes and interactions",
      "Design systems and components",
      "Case studies and a portfolio",
    ],
    curriculum: [
      {
        title: "UX Foundations",
        lessons: [
          { title: "What design is and why it matters", minutes: 16 },
          { title: "User research", minutes: 22 },
          { title: "Information architecture", minutes: 20 },
        ],
      },
      {
        title: "Figma",
        lessons: [
          { title: "Interface and tools", minutes: 22 },
          { title: "Auto layout", minutes: 26 },
          { title: "Components and variants", minutes: 24 },
        ],
      },
      {
        title: "Design System",
        lessons: [
          { title: "Typography and colour", minutes: 22 },
          { title: "Spacing and grids", minutes: 20 },
          { title: "Handoff and developer collaboration", minutes: 18 },
        ],
      },
      {
        title: "Case Studies",
        lessons: [
          { title: "Mobile app design", minutes: 34 },
          { title: "Web dashboard", minutes: 30 },
          { title: "Presenting your portfolio", minutes: 20 },
        ],
      },
    ],
  },

  "git-github-devops": {
    title: "Git, GitHub and DevOps Basics",
    subtitle:
      "The essential skill for working in a team — from the command line to deployment.",
    description:
      "Knowing how to write code is not enough to get a job — working in a team requires understanding Git and deployment. In this short course you will learn Git's core concepts, the GitHub workflow, branching, pull requests, CI/CD and the basics of Docker.\n\nA short but dense course — you can finish it in two weeks with 20 minutes a day.",
    instructor_name: "Mehedi Hasan",
    instructor_title: "Senior Software Engineer",
    instructor_bio:
      "With over 8 years of experience he has worked in product teams at home and abroad. Making complex topics easy to understand is what he loves most.",
    outcomes: [
      "Git commands and version control",
      "GitHub and pull requests",
      "Branching strategies",
      "CI with GitHub Actions",
      "Docker and basic deployment",
    ],
    curriculum: [
      {
        title: "Starting with Git",
        lessons: [
          { title: "What version control is", minutes: 12 },
          { title: "Installing and your first commit", minutes: 18 },
          { title: "Stage, commit and log", minutes: 20 },
        ],
      },
      {
        title: "GitHub",
        lessons: [
          { title: "Remote repos and SSH", minutes: 18 },
          { title: "Branches and merging", minutes: 22 },
          { title: "Pull requests", minutes: 20 },
        ],
      },
      {
        title: "Automation",
        lessons: [
          { title: "GitHub Actions", minutes: 24 },
          { title: "CI pipelines", minutes: 20 },
          { title: "Test automation", minutes: 18 },
        ],
      },
      {
        title: "Deployment",
        lessons: [
          { title: "Introduction to Docker", minutes: 24 },
          { title: "A typical deploy flow", minutes: 18 },
          { title: "Team workflow", minutes: 16 },
        ],
      },
    ],
  },

  "wordpress-ecommerce": {
    title: "WordPress and WooCommerce",
    subtitle:
      "A practical course on building professional websites and online stores without code.",
    description:
      "Want to build a website for your own business or an online store for a client? With WordPress you can get the job done without writing any code. In this course you will learn about hosting, themes, page builders, website security and setting up products, orders and payments with WooCommerce.\n\nIt is also an in-demand skill for finding freelancing work in Bangladesh.",
    instructor_name: "Sadia Afrin",
    instructor_title: "WordPress Consultant",
    instructor_bio:
      "She has been working on Fiverr and Upwork for 6 years. Now she runs web and content projects for international clients with a small team.",
    outcomes: [
      "Domain and hosting setup",
      "Themes and page builders",
      "A WooCommerce store",
      "Payments and shipping",
      "Speed and security",
    ],
    curriculum: [
      {
        title: "Starting the Website",
        lessons: [
          { title: "Domain and hosting", minutes: 16 },
          { title: "Installing WordPress", minutes: 14 },
          { title: "Tour of the dashboard", minutes: 18 },
        ],
      },
      {
        title: "Design",
        lessons: [
          { title: "Theme setup", minutes: 22 },
          { title: "Page builders", minutes: 26 },
          { title: "Menus and forms", minutes: 18 },
        ],
      },
      {
        title: "E-commerce",
        lessons: [
          { title: "WooCommerce setup", minutes: 24 },
          { title: "Products and orders", minutes: 24 },
          { title: "Payments and shipping", minutes: 20 },
        ],
      },
      {
        title: "Launch",
        lessons: [
          { title: "Speed optimisation", minutes: 18 },
          { title: "Security and backups", minutes: 20 },
          { title: "Client handover", minutes: 16 },
        ],
      },
    ],
  },
};

export const bundlesEn: Record<string, { title: string; description: string }> = {
  "full-stack-career": {
    title: "Full-Stack Career Bundle",
    description:
      "The complete path to becoming a web developer — from the basics to React, Next.js and deployment.",
  },
  "ai-freelancing-bundle": {
    title: "AI and Freelancing Bundle",
    description:
      "AI skills and freelancing strategy together — the path to starting your first income.",
  },
  "all-access-combo": {
    title: "All-Courses Combo",
    description:
      "Lifetime access to every course — choose your own path step by step.",
  },
};

export const workshopsEn: Record<string, { title: string; description: string; duration: string }> = {
  "first-website-in-2-hours": {
    title: "Your First Website in 2 Hours",
    description:
      "Build your first page live with HTML, CSS and a little JavaScript. No experience needed.",
    duration: "2 hours",
  },
  "chatgpt-productivity": {
    title: "10x Productivity at Work with ChatGPT",
    description:
      "Learn real workflows for using AI in emails, reports, presentations and research in a live session.",
    duration: "2.5 hours",
  },
  "portfolio-review-live": {
    title: "Freelancing Portfolio Review",
    description:
      "Get your gig and portfolio reviewed live, learn what clients look for and where to improve.",
    duration: "2 hours",
  },
};

export const ebooksEn: Record<string, { title: string; description: string }> = {
  "programming-roadmap": {
    title: "The Roadmap to Start Programming",
    description:
      "Which language to start with, how to plan — a guide from the very beginning.",
  },
  "freelancing-first-30-days": {
    title: "Freelancing: The First 30 Days",
    description:
      "From profile to first order — a step-by-step 30-day action plan.",
  },
  "ai-tools-guidebook": {
    title: "AI Tools Guidebook 2026",
    description:
      "Writing, design, video and coding — a curated list of 40+ AI tools for work.",
  },
  "interview-prep-handbook": {
    title: "Interview Preparation Handbook",
    description:
      "Common tech interview questions, answer strategies and a salary negotiation guide.",
  },
};

export const postsEn: Record<
  string,
  { title: string; excerpt: string; content: string; author: string }
> = {
  "how-to-start-programming-2026": {
    title: "How to Start Learning Programming in 2026",
    author: "Mehedi Hasan",
    excerpt:
      "Which language, how much time, which resources — practical answers to the most common questions beginners ask.",
    content: `The biggest barrier to learning programming is deciding to start. Many people think they need to know maths or computer science first. In reality, all you need to start is patience and regular practice.

## The first question: which language?

You can choose Python or JavaScript as your first language. Python's syntax is simple, which makes logic easier to grasp. If you learn JavaScript, you can see the results right in the browser, which keeps beginners motivated.

- **If your goal is building websites:** start with JavaScript.
- **If your goal is data or AI:** choose Python.
- **If your goal is just learning logic:** pick either one, but stick with it.

## How much time will it take?

With one hour of regular practice a day, you can master the basics well in 3 months. 30-60 minutes every day is far more effective than studying for a long stretch once a week.

## The right order for learning

1. Basic syntax of the language  
2. Solving small problems  
3. One mini project  
4. Git and GitHub  
5. Bigger projects and code review

## Mistakes to avoid

You do not learn by copying along with tutorials. After every lesson, try it yourself, make mistakes, then look at the solution. And do not start many courses at once — finish one.

Programming is not a talent, it is a habit. The journey begins the moment you write your first line of code today.`,
  },

  "will-ai-take-jobs-bangladesh": {
    title: "Will AI Really Take Jobs? The Real Picture",
    author: "Nusrat Jahan",
    excerpt:
      "Where AI tools are having an impact, which skills will become more valuable — an evidence-based analysis.",
    content: `There are two kinds of talk about AI — some say all jobs will end, others say nothing will happen. The reality is somewhere in between.

## Which jobs are changing

Repetitive writing, routine data entry, basic graphics — AI is saving time on these tasks. As a result, fewer people are needed for them, but they are not disappearing entirely.

## Which skills are becoming more valuable

- The ability to identify problems
- Reviewing and editing AI output
- System design and architecture
- Communicating with clients and building trust

## Advice for beginners

See AI as an assistant, not as a rival. If you do the same work faster with AI, you can take on more projects. In the future employers will not look for "I know how to use AI" but "I can solve specific problems with AI".

## Practical preparation

Build depth in your own domain while developing practical skills with AI tools. Show in your portfolio what you have built and how you used AI.`,
  },

  "first-client-freelancing": {
    title: "5 Ways to Get Your First Client in Freelancing",
    author: "Sadia Afrin",
    excerpt:
      "Still no orders even after creating a profile? The small changes that actually work.",
    content: `Many people create a profile and wait, but orders do not come. The reason is that getting your first client is an active process.

## 1. Choose one specific service

Saying "I design everything" is less effective than saying "I design menus and social media graphics for restaurants". When you are specific, clients find you more easily.

## 2. Write about solving a problem in your gig

Clients do not buy your skills, they buy solutions. Not "I know Photoshop" but "I will get your product photos ready for social media" — write it that way.

## 3. Start with small projects at a lower price

Keep your rate a little lower for the first few orders, but do not compromise on the quality of work. Good reviews build the foundation for charging more later.

## 4. Customise your proposals

Clients can spot copy-paste proposals. Mention their problem in the first two lines after understanding the job — the response rate goes up.

## 5. Build social proof

Share work samples, process videos or free mini resources. Before buying, people want to see what you can do.

Getting the first order can take time, but if the process is right, work keeps coming.`,
  },

  "why-learn-git": {
    title: "Why It Is Hard to Get a Job Without Learning Git",
    author: "Mehedi Hasan",
    excerpt:
      "Knowing how to write code and knowing how to work in a team are two different skills. Here is why Git is essential.",
    content: `Many junior developers write good code, but run into problems once they start working in a team. Because the difference is often not in coding, but in workflow.

## What Git actually does

Git saves every change to your code. If something goes wrong you can return to a previous state, you can see who changed what, and several people can work on the same project at once.

## Impact on the job market

Almost every software company asks about Git and GitHub in interviews. To check your portfolio they look at your GitHub profile. Regular commits and clean repositories make a good impression.

## The minimum a beginner needs to know

- Installing and configuring Git
- Stage, commit and log
- Creating and merging branches
- Remote repositories and pull requests
- Resolving conflicts

Learning these basics will not take more than a week, but the impact on your career lasts a long time.`,
  },
};
