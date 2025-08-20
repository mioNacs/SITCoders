import React, { useState } from 'react';

// Replace inline SVG icons with react-icons imports
import { FaBook, FaMobileAlt, FaDatabase, FaBrain, FaYoutube, FaJava } from 'react-icons/fa';
import { GoGraph } from 'react-icons/go';
import { FiMonitor, FiCheckCircle, FiMapPin, FiCode } from 'react-icons/fi';


// Data for Indian YouTubers
const indianYoutubersData = [
    {
        category: "Striver (Raj Vikramaditya)",
        icon: FaBrain,
        description: "Primarily focused on DSA and interview preparation for top product-based companies.",
        resources: [
            { name: "Striver's A2Z DSA Sheet", description: "A comprehensive DSA roadmap from basics to advanced, widely followed for interview prep. It's structured to build a strong foundation systematically.", link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", tags: ["DSA", "Interview Prep", "Sheet"] },
            { name: "Striver's SDE Sheet", description: "A curated list of 180+ top coding interview problems, targeting companies like FAANG. It's considered essential for serious aspirants.", link: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/", tags: ["DSA", "SDE", "Interview Prep", "Sheet"] },
        ]
    },
    // Removed Harkirat Singh section as requested
    {
        category: "Kunal Kushwaha",
        icon: FiCode,
        description: "Known for comprehensive, beginner-friendly bootcamps on various technologies, with a strong community focus.",
        resources: [
            { name: "Java + DSA Bootcamp", description: "An extensive, free bootcamp covering Java programming from scratch and then moving to Data Structures and Algorithms. Great for beginners.", link: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", tags: ["Java", "DSA", "Bootcamp", "Free"] },
            { name: "Complete DevOps Bootcamp", description: "A practical, hands-on DevOps course that covers essential tools and concepts needed for the industry.", link: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnoqBXdMwUTRod4Gi3eac2Ak", tags: ["DevOps", "Bootcamp", "Free"] },
        ]
    },
    {
        category: "Hitesh Choudhary (Chai aur Code)",
        icon: FaYoutube, // Replaced SiJavascript for simplicity
        description: "Focuses on deep-dives into JavaScript and its ecosystem, with a project-based teaching style.",
        resources: [
            { name: "Chai aur JavaScript", description: "A detailed playlist that goes deep into the core concepts of JavaScript, including execution context, prototypes, and closures.", link: "https://www.youtube.com/playlist?list=PLu71Vw8LgznzoZ-d2AnvFiS_rJaS2m6-A", tags: ["JavaScript", "Advanced", "Free"] },
            { name: "Chai aur React", description: "A project-focused React series that teaches how to build modern, scalable React applications from the ground up.", link: "https://www.youtube.com/playlist?list=PLu71Vw8LgznvoKaY2ssDCDPymNGK8Ksp-", tags: ["React", "Projects", "Free"] },
        ]
    },
    {
        category: "CodeWithHarry",
        icon: FaYoutube,
        description: "Provides a vast library of free courses in Hindi, making programming accessible to a wide audience.",
        resources: [
            { name: "Web Development Full Course", description: "A massive 100+ video playlist covering HTML, CSS, JavaScript, and more. It's a go-to resource for beginners in the Hindi-speaking community.", link: "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w", tags: ["Web Dev", "Hindi", "Beginner", "Free"] },
            { name: "C++ in One Video", description: "A comprehensive, marathon tutorial covering all major C++ concepts in a single video, perfect for quick revision or a crash course.", link: "https://www.youtube.com/watch?v=i_5p_bbedko", tags: ["C++", "One-Shot", "Hindi", "Free"] },
        ]
    },
    {
        category: "Apna College",
        icon: FaJava,
        description: "Caters to college students with placement-oriented courses on DSA and programming languages.",
        resources: [
            { name: "C++ & DSA Placement Course", description: "A complete C++ and Data Structures course designed specifically for college students aiming for placements.", link: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ", tags: ["C++", "DSA", "Placement", "Free"] },
            { name: "Java & DSA Placement Course", description: "The Java equivalent of their popular placement course, covering the language and essential DSA for interviews.", link: "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3w4-p- Meei-t5J3_MvB6x-", tags: ["Java", "DSA", "Placement", "Free"] },
        ]
    },
    {
        category: "Neso Academy",
        icon: FaBook,
        description: "Offers high-quality, animated lectures on core computer science subjects, aligning with university and GATE syllabi.",
        resources: [
            { name: "Computer Networks Playlist", description: "A detailed lecture series on Computer Networks, explaining complex topics in a simple, visual manner. Ideal for semester exams.", link: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx", tags: ["Core CS", "Networks", "GATE", "Free"] },
            { name: "Operating Systems Playlist", description: "An in-depth playlist covering all fundamental concepts of Operating Systems, perfect for building a strong theoretical base.", link: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRgGjgY5oIzFN2BGn-j4AE1v", tags: ["Core CS", "OS", "GATE", "Free"] },
        ]
    }
];

// Paid resources data
const paidResources = [
  {
    name: "Educative (Subscription)",
    description: "Interactive text-based courses for coding interviews and system design (e.g. 'Grokking the System Design Interview').",
    link: "https://www.educative.io/",
    tags: ["Paid", "Subscription", "Intermediate–Advanced"],
    price: "₹4,900/month"
  },
  {
    name: "Pluralsight (Subscription)",
    description: "Video training library (cloud, security, programming).",
    link: "https://www.pluralsight.com/",
    tags: ["Paid", "Subscription", "All levels"],
    price: "₹2,400/month"
  },
  {
    name: "Udemy (Pay-per-course)",
    description: "Vast catalog of on-demand courses (e.g. 'The Web Developer Bootcamp' or 'Modern React').",
    link: "https://www.udemy.com/",
    tags: ["Paid", "Course", "All levels"],
    price: "₹800–1,600/course (sale)"
  },
  {
    name: "Coursera Plus (Subscription)",
    description: "Unlimited access to 7,000+ courses across domains. Certificates included.",
    link: "https://www.coursera.org/plus",
    tags: ["Paid", "Subscription", "All levels"],
    price: "₹33,000/year"
  },
  {
    name: "O’Reilly Online Learning (Subscription)",
    description: "Access to tech books, videos, and live training.",
    link: "https://www.oreilly.com/online-learning/",
    tags: ["Paid", "Subscription", "All levels"],
    price: "₹4,100/month (annual)"
  },
  {
    name: "Frontend Masters (Subscription)",
    description: "Advanced video courses on front-end and full-stack topics.",
    link: "https://frontendmasters.com/",
    tags: ["Paid", "Subscription", "All levels"],
    price: "₹3,300/month (annual)"
  },
  {
    name: "Udacity Nanodegree (Subscription)",
    description: "Project-based 'nanodegree' programs (e.g. Frontend, ML).",
    link: "https://www.udacity.com/nanodegree",
    tags: ["Paid", "Nanodegree", "Intermediate–Advanced"],
    price: "₹33,000/month"
  },
  {
    name: "LeetCode Premium (Subscription)",
    description: "Premium coding problems and company-specific mock interviews.",
    link: "https://leetcode.com/subscribe/",
    tags: ["Paid", "Subscription", "All levels"],
    price: "₹2,900/month"
  }
];

// Data for the resource hub, structured by categories and subcategories.
const resourcesData = [
  {
    category: "Foundational Computer Science",
    icon: FaBook,
    subcategories: [
      {
        title: "A. Core Computer Science Principles",
        resources: [
          { name: "CS50: Introduction to Computer Science (Harvard)", description: "A premier entry point for aspiring engineers, covering abstraction, algorithms, data structures, and more across several languages.", link: "https://www.edx.org/learn/computer-science/harvard-university-cs50-s-introduction-to-computer-science", tags: ["University Course", "Beginner", "Free Audit", "C", "Python", "JS"] },
          { name: "Introduction to Algorithms (MIT)", description: "A deep and comprehensive exploration of algorithmic concepts, data structures, and problem-solving techniques with a strong mathematical focus.", link: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/", tags: ["University Course", "Intermediate", "Free", "Theory"] },
        ]
      },
      {
        title: "B. Data Structures & Algorithms (DSA)",
        resources: [
          { name: "Algorithms, Part I & II (Princeton)", description: "A highly-rated Coursera specialization providing a thorough grounding in essential algorithms and data structures using Java.", link: "https://www.coursera.org/learn/algorithms-part1", tags: ["University Course", "Intermediate", "Free Audit", "Java"] },
          { name: "freeCodeCamp - DSA Courses", description: "Extensive, high-quality video courses on YouTube providing beginner-friendly, language-specific introductions to DSA.", link: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/", tags: ["Video Course", "Beginner", "Free", "JavaScript", "Python"] },
          { name: "GeeksforGeeks", description: "An indispensable free library of articles, tutorials, and practice problems covering nearly every conceivable DSA topic.", link: "https://www.geeksforgeeks.org/", tags: ["Tutorials", "Practice", "Free", "All Levels"] }
        ]
      }
    ]
  },
  {
    category: "Core Software Engineering Practices",
    icon: GoGraph,
    subcategories: [
      {
        title: "A. Software Design & Architecture",
        resources: [
          { name: "Refactoring.Guru", description: "An exceptional resource for learning design patterns with clear explanations, illustrations, and code examples in multiple languages.", link: "https://refactoring.guru/", tags: ["Design Patterns", "Tutorials", "Free", "All Levels"] },
          { name: "Grokking the System Design Interview", description: "Widely considered a benchmark for interview preparation, this course teaches a methodical approach to tackling system design questions.", link: "https://www.designgurus.io/course/grokking-the-system-design-interview", tags: ["System Design", "Interview Prep", "Paid", "Intermediate"] },
          { name: "ByteByteGo", description: "Created by Alex Xu, this platform offers an interactive and visual learning experience for understanding scalable and robust systems.", link: "https://bytebytego.com/", tags: ["System Design", "Visuals", "Paid", "All Levels"] }
        ]
      },
      {
        title: "B. Development Methodologies",
        resources: [
          { name: "Atlassian Agile Coach", description: "An extensive and no-nonsense online guide that distills decades of agile software development experience into easy-to-understand lessons.", link: "https://www.atlassian.com/agile", tags: ["Agile", "Scrum", "Guide", "Free"] },
          { name: "Scrum.org", description: "Known as 'The Home of Scrum,' this organization was founded by Scrum co-creator Ken Schwaber and provides the official Scrum Guide.", link: "https://www.scrum.org/", tags: ["Scrum", "Official Guide", "Certification", "Free"] }
        ]
      },
      {
        title: "C. Quality Assurance & Software Testing",
        resources: [
            { name: "a1qa Blog", description: "A specialized blog offering articles on test automation, performance testing, cybersecurity testing, and QA strategies.", link: "https://www.a1qa.com/blog/", tags: ["QA", "Testing", "Blog", "Free"] },
            { name: "BrowserStack Guide", description: "Provides clear definitions and best practices for QA in software development, explaining its impact on the development workflow.", link: "https://www.browserstack.com/guide/quality-assurance-in-software-testing", tags: ["QA", "Best Practices", "Guide", "Free"] },
            { name: "Tricentis Learning Center", description: "Offers detailed explanations of the Software Testing Life Cycle (STLC) and its benefits.", link: "https://www.tricentis.com/learning/software-testing-life-cycle", tags: ["STLC", "Testing", "Guide", "Free"] }
        ]
      }
    ]
  },
  {
    category: "Front-End Development",
    icon: FiMonitor,
    subcategories: [
      {
        title: "A. Core Technologies",
        resources: [
          { name: "MDN Web Docs", description: "The gold-standard and authoritative resource for web technologies, providing comprehensive documentation for HTML, CSS, and JavaScript.", link: "https://developer.mozilla.org/", tags: ["Documentation", "HTML", "CSS", "JS", "Free"] },
          { name: "Frontend Masters Bootcamp", description: "A free, comprehensive crash course that teaches HTML, CSS, and JavaScript through over 21 hours of project-based video lessons.", link: "https://frontendmasters.com/bootcamp/", tags: ["Video Course", "Beginner", "Free", "Project-Based"] },
          { name: "CSS-Tricks", description: "A premier resource for articles, guides, and an 'almanac' of CSS properties. It dives deep into both foundational and cutting-edge CSS techniques.", link: "https://css-tricks.com/", tags: ["CSS", "Blog", "Tutorials", "Free"] }
        ]
      },
      {
        title: "B. Modern Frameworks & Libraries",
        resources: [
          { name: "React.dev", description: "The official documentation for React, a JavaScript library for building user interfaces, maintained by Meta.", link: "https://react.dev/", tags: ["React", "Documentation", "Official", "Free"] },
          { name: "Angular.dev", description: "The official documentation for Angular, a comprehensive web application framework maintained by Google.", link: "https://angular.dev/", tags: ["Angular", "Documentation", "Official", "Free"] },
          { name: "Vuejs.org", description: "The official documentation for Vue.js, 'The Progressive JavaScript Framework' known for its incremental adoptability.", link: "https://vuejs.org/", tags: ["Vue", "Documentation", "Official", "Free"] }
        ]
      }
    ]
  },
  {
    category: "Back-End Development",
    icon: FaDatabase,
    subcategories: [
      {
        title: "A. Languages & Frameworks",
        resources: [
          { name: "Node.js", description: "Official documentation for the JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript.", link: "https://nodejs.org/en/docs", tags: ["Node.js", "JavaScript", "Official", "Free"] },
          { name: "Express.js", description: "A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.", link: "https://expressjs.com/", tags: ["Node.js", "Framework", "Free", "API"] },
          { name: "Django", description: "A high-level Python framework that encourages rapid development and clean, pragmatic design.", link: "https://www.djangoproject.com/", tags: ["Python", "Framework", "Free"] },
        ]
      },
      {
        title: "B. Databases & APIs",
        resources: [
            { name: "MongoDB University", description: "Offers free courses on its popular NoSQL database technology, covering everything from basics to advanced topics.", link: "https://learn.mongodb.com/", tags: ["Database", "NoSQL", "Free Course", "MongoDB"] },
            { name: "PostgreSQL", description: "Official documentation for one of the world's most advanced open source relational databases.", link: "https://www.postgresql.org/docs/", tags: ["Database", "SQL", "Official", "Free"] },
            { name: "Rest Cookbook", description: "A guide to the REST architectural style with practical, ready-to-implement examples.", link: "https://restcookbook.com/", tags: ["API", "REST", "Guide", "Free"] },
        ]
      }
    ]
  },
  {
    category: "Mobile Development",
    icon: FaMobileAlt,
    subcategories: [
      {
        title: "A. iOS & Android",
        resources: [
          { name: "Apple Developer Documentation", description: "The central hub for all official documentation, sample code, and tutorials for developing on Apple platforms like iOS.", link: "https://developer.apple.com/documentation", tags: ["iOS", "Swift", "Official", "Free"] },
          { name: "Android Developers Website", description: "The comprehensive official resource for all Android development, providing guides, API references, and training courses from Google.", link: "https://developer.android.com/", tags: ["Android", "Kotlin", "Official", "Free"] },
          { name: "Android Basics with Compose (Google)", description: "The recommended starting point for new Android developers. A free, self-paced course covering Kotlin and Jetpack Compose.", link: "https://developer.android.com/courses/android-basics-compose/course", tags: ["Android", "Beginner", "Free Course", "Google"] }
        ]
      },
      {
        title: "B. Cross-Platform Development",
        resources: [
            { name: "React Native", description: "Build truly native apps for multiple platforms using the React library and JavaScript.", link: "https://reactnative.dev/", tags: ["React", "Cross-Platform", "Official", "Free"] },
            { name: "Flutter", description: "Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.", link: "https://flutter.dev/", tags: ["Flutter", "Cross-Platform", "Official", "Free"] },
        ]
      }
    ]
  },
  {
    category: "Infrastructure & DevOps",
    icon: FiCheckCircle,
    subcategories: [
      {
        title: "A. DevOps, Containers & Orchestration",
        resources: [
          { name: "DevOps.com", description: "A comprehensive blog featuring news, strategies, case studies, and podcasts from industry experts on DevOps.", link: "https://devops.com/", tags: ["DevOps", "Blog", "News", "Free"] },
          { name: "Docker Documentation", description: "Official documentation for Docker, the platform for building, sharing, and running applications in containers.", link: "https://docs.docker.com/", tags: ["Docker", "Containers", "Official", "Free"] },
          { name: "Kubernetes Documentation", description: "Official documentation for Kubernetes, the open-source system for automating deployment, scaling, and management of containerized applications.", link: "https://kubernetes.io/docs/home/", tags: ["Kubernetes", "Orchestration", "Official", "Free"] }
        ]
      }
    ]
  },
  {
    category: "Artificial Intelligence & Machine Learning",
    icon: FaBrain,
    subcategories: [
      {
        title: "A. Foundational Courses",
        resources: [
          { name: "AI For Everyone (Coursera)", description: "A foundational course by DeepLearning.AI that provides a non-technical introduction to AI, its applications, and its impact.", link: "https://www.coursera.org/learn/ai-for-everyone", tags: ["AI/ML", "Beginner", "Free Audit", "Non-Technical"] },
          { name: "Machine Learning with Python (IBM)", description: "An intermediate course covering major ML concepts including supervised/unsupervised learning, and popular algorithms.", link: "https://www.coursera.org/learn/machine-learning-with-python", tags: ["ML", "Python", "Intermediate", "Free Audit"] }
        ]
      },
      {
        title: "B. Blogs & News",
        resources: [
            { name: "OpenAI Blog", description: "The official blog from OpenAI, featuring the latest research, announcements, and discussions on advanced AI.", link: "https://openai.com/blog", tags: ["AI", "Research", "Blog", "News"] },
            { name: "Google AI Blog", description: "The official blog from Google Research, showcasing the latest breakthroughs and projects in AI and computer science.", link: "https://ai.googleblog.com/", tags: ["AI", "Research", "Blog", "Google"] },
            { name: "KDnuggets", description: "A leading site on AI, Analytics, Big Data, Data Science, and Machine Learning, featuring tutorials, opinions, and news.", link: "https://www.kdnuggets.com/", tags: ["AI/ML", "Data Science", "News", "Community"] }
        ]
      }
    ]
  },
  {
    category: "Career & Professional Development",
    icon: FiMapPin,
    subcategories: [
      {
        title: "A. Technical Interview Preparation",
        resources: [
          { name: "LeetCode", description: "The definitive platform for practicing coding challenges and preparing for technical interviews at top tech companies.", link: "https://leetcode.com/", tags: ["Interview Prep", "Coding", "Practice", "All Levels"] },
          { name: "HackerRank", description: "A platform for skill assessment, practice, and competition, often used by companies for hiring challenges.", link: "https://www.hackerrank.com/", tags: ["Interview Prep", "Assessment", "All Levels"] }
        ]
      },
      {
        title: "B. Essential Communities & Knowledge Bases",
        resources: [
            { name: "Stack Overflow", description: "The definitive question-and-answer website for specific, focused programming problems.", link: "https://stackoverflow.com/", tags: ["Community", "Q&A", "Free", "All Levels"] },
            { name: "Reddit (r/cscareerquestions)", description: "A community for career advice, salary discussions, and sharing interview experiences.", link: "https://www.reddit.com/r/cscareerquestions/", tags: ["Community", "Career Advice", "Reddit", "Free"] },
            { name: "GitHub", description: "The central hub for the open-source world and the primary platform for code hosting and collaboration.", link: "https://github.com/", tags: ["Community", "Open Source", "Version Control", "Free"] }
        ]
      }
    ]
  }
];

// Reusable card component for displaying each resource
const ResourceCard = ({ name, description, link, tags, price }) => {
  const isPaid = tags?.includes("Paid") || !!price;
  return (
    <div className={`border rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:ring-2 hover:ring-orange-300 transition-all duration-300 ease-in-out ${isPaid ? 'bg-orange-100/60 border-orange-300' : 'bg-white/70 border-gray-200/80'}`}>
      <h4 className="text-lg font-bold text-orange-800 mb-2">
        <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 rounded">
          {name}
        </a>
      </h4>
      <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>
      <div className="flex flex-wrap gap-2 mt-auto pt-2">
        {tags?.map(tag => (
          <span key={tag} className={`text-xs font-semibold px-3 py-1 rounded-full ${/paid/i.test(tag) ? 'bg-orange-300 text-orange-900' : 'bg-orange-100 text-orange-900'}`}>
            {tag}
          </span>
        ))}
        {price && (
          <span className="text-xs font-semibold bg-orange-200 text-orange-900 px-3 py-1 rounded-full">
            {price}
          </span>
        )}
      </div>
    </div>
  );
};

// Collapsible category section for Global resources
const CollapsibleCategory = ({ categoryData, isOpen, onToggle }) => {
  const { category, subcategories, icon: Icon } = categoryData;
  return (
    <section className="border-b border-orange-200/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-6 text-left hover:bg-orange-100/40 transition-colors duration-200 rounded-t-lg px-6"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <Icon className="w-7 h-7 text-orange-600" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {category}
          </h2>
        </div>
        <svg
          className={`w-6 h-6 text-orange-600 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
        <div className="bg-orange-50/30 p-6 space-y-10">
          {subcategories.map(subcategory => (
            <div key={subcategory.title}>
              <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-5 pl-1">{subcategory.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subcategory.resources.map(resource => (
                  <ResourceCard key={resource.name} {...resource} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Component for Indian Creator sections
const IndianCreatorCategory = ({ categoryData }) => {
    const { category, description, resources, icon: Icon } = categoryData;
    return (
        <section className="bg-white/50 rounded-xl p-6 shadow-md border border-gray-200/80">
            <div className="flex items-center gap-4 mb-4">
                <Icon className="w-8 h-8 text-orange-600" />
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(resource => (
                    <ResourceCard key={resource.name} {...resource} />
                ))}
            </div>
        </section>
    );
};


function Resources() {
  const [activeTab, setActiveTab] = useState('indian');
  const [openCategories, setOpenCategories] = useState({ [resourcesData[0].category]: true });
  const [paidOpen, setPaidOpen] = useState(false);

  const toggleCategory = (categoryName) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };
  const togglePaid = () => setPaidOpen(prev => !prev);

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
        activeTab === tabName
          ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
          : 'text-gray-700 hover:bg-orange-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className='pt-20 pb-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-screen font-sans'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <header className="mx-auto max-w-4xl text-center mb-12 md:mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 py-2 drop-shadow-lg">
            Software Engineering Resources
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            A curated guide to top-tier learning resources for aspiring and professional software engineers.
          </p>
        </header>

        {/* Sticky Tab Bar */}
        <div className="sticky top-16 z-20 flex justify-center mb-8 p-1 bg-white/80 rounded-lg shadow-md border border-orange-200 space-x-2 backdrop-blur overflow-x-auto">
          <TabButton tabName="indian" label="🇮🇳 Indian Creator Resources" />
          <TabButton tabName="global" label="🌍 Global Engineering Resources" />
        </div>

        <main className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl ring-1 ring-black ring-opacity-5">
          {activeTab === 'indian' && (
            <section className="p-8">
              <h2 className="text-2xl font-bold text-orange-700 mb-8 text-center tracking-wide">Top Indian YouTube Educators & Cohorts</h2>
              <div className="space-y-10">
                {indianYoutubersData.map(categoryData => (
                  <IndianCreatorCategory key={categoryData.category} categoryData={categoryData} />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'global' && (
            <section className="p-8">
              <h2 className="text-2xl font-bold text-orange-700 mb-8 text-center tracking-wide">Global Engineering Resources</h2>
              <div>
                {resourcesData.map(categoryData => (
                  <CollapsibleCategory
                    key={categoryData.category}
                    categoryData={categoryData}
                    isOpen={!!openCategories[categoryData.category]}
                    onToggle={() => toggleCategory(categoryData.category)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Paid Resources Section (Collapsible) */}
          <section id="Paid-Resources" className="border-t border-orange-200/50">
            <button
              onClick={togglePaid}
              className="w-full flex justify-between items-center py-6 text-left hover:bg-orange-100/40 transition-colors duration-200 rounded-b-lg px-6"
              aria-expanded={paidOpen}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-orange-700">💸 Paid Resources</span>
              </div>
              <svg
                className={`w-6 h-6 text-orange-600 transition-transform duration-300 ${paidOpen ? 'transform rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${paidOpen ? 'max-h-[5000px]' : 'max-h-0'}`}>
              <div className="bg-orange-50/40 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paidResources.map(resource => (
                    <ResourceCard key={resource.name} {...resource} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      {/* Subtle background illustration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 w-full h-full">
          <ellipse cx="720" cy="100" rx="700" ry="80" fill="#fde68a" fillOpacity="0.08" />
          <ellipse cx="200" cy="700" rx="400" ry="60" fill="#fca311" fillOpacity="0.04" />
          <ellipse cx="1240" cy="700" rx="400" ry="60" fill="#fca311" fillOpacity="0.04" />
        </svg>
      </div>
    </div>
  );
}

export default Resources;
