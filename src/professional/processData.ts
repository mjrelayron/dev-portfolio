// Copied verbatim from src/components/ProcessPage.jsx (the previous site's per-service process pages).
// Kept as data so the About page can present it without the old modal component.

export interface ProcessPhase {
  phase: string;
  duration: string;
  steps: string[];
  deliverables: string[];
}
export interface ServiceProcess {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  phases: ProcessPhase[];
}

export const serviceProcesses: ServiceProcess[] = [
  {
    "id": "fullstack",
    "label": "Full-stack",
    "title": "Full Stack Development Complete Process",
    "subtitle": "End-to-end web application development from database to deployment",
    "phases": [
      {
        "phase": "Project Planning & Architecture",
        "duration": "Week 1-2",
        "steps": [
          "Requirements analysis and technical specification",
          "System architecture design and technology stack selection",
          "Database design and entity relationship modeling",
          "API design and endpoint planning",
          "Security architecture and authentication planning",
          "Scalability and performance considerations"
        ],
        "deliverables": [
          "Technical specification document",
          "System architecture diagrams",
          "Database schema design",
          "API documentation outline"
        ]
      },
      {
        "phase": "Backend Development",
        "duration": "Week 3-5",
        "steps": [
          "Database setup and optimization",
          "Backend API development and testing",
          "Authentication and authorization implementation",
          "Business logic and core functionality development",
          "Data validation and error handling",
          "API documentation and testing"
        ],
        "deliverables": [
          "Robust backend API",
          "Secure authentication system",
          "Optimized database with proper indexing",
          "Comprehensive API documentation"
        ]
      },
      {
        "phase": "Frontend Development",
        "duration": "Week 4-6",
        "steps": [
          "User interface design and implementation",
          "Responsive frontend development",
          "State management and data flow setup",
          "API integration and data fetching",
          "User experience optimization",
          "Cross-browser compatibility testing"
        ],
        "deliverables": [
          "Modern, responsive user interface",
          "Seamless API integration",
          "Optimized user experience",
          "Cross-browser compatible frontend"
        ]
      },
      {
        "phase": "Integration & Testing",
        "duration": "Week 6-7",
        "steps": [
          "Frontend-backend integration testing",
          "End-to-end testing and quality assurance",
          "Performance testing and optimization",
          "Security testing and vulnerability assessment",
          "User acceptance testing",
          "Bug fixing and code optimization"
        ],
        "deliverables": [
          "Fully integrated application",
          "Comprehensive test coverage",
          "Performance-optimized system",
          "Security-hardened application"
        ]
      },
      {
        "phase": "Deployment & Maintenance",
        "duration": "Week 8+",
        "steps": [
          "Production environment setup",
          "CI/CD pipeline configuration",
          "Application deployment and monitoring setup",
          "Documentation and user guides",
          "Training and knowledge transfer",
          "Ongoing maintenance and support"
        ],
        "deliverables": [
          "Live, production-ready application",
          "Automated deployment pipeline",
          "Comprehensive documentation",
          "Maintenance and support plan"
        ]
      }
    ]
  },
  {
    "id": "wordpress",
    "label": "WordPress",
    "title": "WordPress Development Complete Process",
    "subtitle": "From concept to launch - your complete WordPress journey",
    "phases": [
      {
        "phase": "Planning & Discovery",
        "duration": "Week 1",
        "steps": [
          "Requirements gathering and project scope definition",
          "Target audience analysis and user experience planning",
          "Content strategy and site architecture planning",
          "Design mockups and wireframe creation",
          "Technology stack selection and hosting setup",
          "Timeline and milestone planning"
        ],
        "deliverables": [
          "Project scope document",
          "Site architecture and sitemap",
          "Design mockups and wireframes",
          "Technology stack documentation"
        ]
      },
      {
        "phase": "Design & Development Setup",
        "duration": "Week 2",
        "steps": [
          "Custom theme development or premium theme customization",
          "Responsive design implementation",
          "Custom post types and fields setup",
          "Plugin selection and configuration",
          "Database optimization and security setup",
          "Development environment configuration"
        ],
        "deliverables": [
          "Custom WordPress theme",
          "Responsive design across all devices",
          "Optimized database structure",
          "Security-hardened WordPress installation"
        ]
      },
      {
        "phase": "Content & Functionality",
        "duration": "Week 3",
        "steps": [
          "Content migration and optimization",
          "Custom functionality development",
          "E-commerce integration (if needed)",
          "Contact forms and user interaction setup",
          "SEO optimization and meta data setup",
          "Performance optimization and caching setup"
        ],
        "deliverables": [
          "Fully functional website with content",
          "Custom features and functionality",
          "Optimized performance and SEO",
          "User-friendly interface"
        ]
      },
      {
        "phase": "Testing & Quality Assurance",
        "duration": "Week 4",
        "steps": [
          "Cross-browser compatibility testing",
          "Mobile responsiveness testing",
          "Performance testing and optimization",
          "Security testing and vulnerability assessment",
          "User acceptance testing",
          "Content review and final adjustments"
        ],
        "deliverables": [
          "Bug-free, fully tested website",
          "Cross-browser compatibility",
          "Optimized performance metrics",
          "Security-hardened site"
        ]
      },
      {
        "phase": "Launch & Support",
        "duration": "Week 5+",
        "steps": [
          "Domain setup and DNS configuration",
          "SSL certificate installation",
          "Website launch and go-live",
          "User training and documentation",
          "Post-launch monitoring and support",
          "Maintenance plan setup"
        ],
        "deliverables": [
          "Live, fully functional website",
          "User training materials",
          "Maintenance and support plan",
          "Performance monitoring setup"
        ]
      }
    ]
  },
  {
    "id": "uiux",
    "label": "UI/UX",
    "title": "UI/UX Design Complete Process",
    "subtitle": "Creating beautiful, intuitive user experiences that drive engagement",
    "phases": [
      {
        "phase": "Discovery & Research",
        "duration": "Week 1",
        "steps": [
          "User research and persona development",
          "Competitor analysis and market research",
          "Stakeholder interviews and requirements gathering",
          "User journey mapping and pain point identification",
          "Design goals and success metrics definition",
          "Technical constraints and platform analysis"
        ],
        "deliverables": [
          "User personas and research insights",
          "Competitive analysis report",
          "User journey maps",
          "Design strategy document"
        ]
      },
      {
        "phase": "Information Architecture",
        "duration": "Week 2",
        "steps": [
          "Site/app structure and navigation design",
          "Content strategy and information hierarchy",
          "Wireframe creation and user flow mapping",
          "Interaction patterns and component planning",
          "Accessibility considerations and guidelines",
          "Mobile-first responsive strategy"
        ],
        "deliverables": [
          "Site map and navigation structure",
          "Low-fidelity wireframes",
          "User flow diagrams",
          "Information architecture documentation"
        ]
      },
      {
        "phase": "Visual Design & Prototyping",
        "duration": "Week 3-4",
        "steps": [
          "Brand integration and visual identity",
          "High-fidelity mockup creation",
          "Interactive prototype development",
          "Design system and component library",
          "Responsive design across all devices",
          "Visual design refinement and iteration"
        ],
        "deliverables": [
          "High-fidelity design mockups",
          "Interactive prototypes",
          "Design system documentation",
          "Responsive design specifications"
        ]
      },
      {
        "phase": "User Testing & Validation",
        "duration": "Week 4-5",
        "steps": [
          "Usability testing plan and execution",
          "User feedback collection and analysis",
          "A/B testing setup and monitoring",
          "Design iteration based on findings",
          "Accessibility testing and compliance",
          "Performance optimization recommendations"
        ],
        "deliverables": [
          "Usability testing reports",
          "User feedback analysis",
          "Design iteration recommendations",
          "Accessibility compliance report"
        ]
      },
      {
        "phase": "Handoff & Implementation",
        "duration": "Week 5-6",
        "steps": [
          "Developer handoff and documentation",
          "Asset preparation and optimization",
          "Design system implementation guide",
          "Quality assurance and design review",
          "Launch support and monitoring",
          "Post-launch optimization recommendations"
        ],
        "deliverables": [
          "Complete design handoff package",
          "Optimized design assets",
          "Implementation guidelines",
          "Post-launch optimization plan"
        ]
      }
    ]
  },
  {
    "id": "seo",
    "label": "SEO",
    "title": "SEO Optimization Complete Process",
    "subtitle": "How I transform your website's search engine visibility",
    "phases": [
      {
        "phase": "Discovery & Analysis",
        "duration": "Week 1",
        "steps": [
          "Initial consultation and goal setting",
          "Complete website audit and technical analysis",
          "Competitor research and market analysis",
          "Keyword research and strategy development",
          "Content gap analysis and opportunities identification"
        ],
        "deliverables": [
          "Comprehensive SEO audit report",
          "Keyword research and strategy document",
          "Competitor analysis report",
          "Technical recommendations list"
        ]
      },
      {
        "phase": "Technical Optimization",
        "duration": "Week 2-3",
        "steps": [
          "Site speed optimization and performance tuning",
          "Mobile responsiveness improvements",
          "Core Web Vitals optimization",
          "Schema markup implementation",
          "XML sitemap creation and submission",
          "Robots.txt optimization",
          "URL structure improvements",
          "Internal linking strategy implementation"
        ],
        "deliverables": [
          "Technical SEO improvements report",
          "Performance optimization results",
          "Schema markup documentation",
          "Updated sitemap and robots.txt"
        ]
      },
      {
        "phase": "Content Strategy & Optimization",
        "duration": "Week 3-4",
        "steps": [
          "Content audit and optimization",
          "Title tag and meta description optimization",
          "Header structure improvements (H1, H2, H3)",
          "Image optimization with alt tags",
          "Content gap filling and new content creation",
          "Local SEO optimization (if applicable)",
          "User experience improvements"
        ],
        "deliverables": [
          "Optimized content with improved rankings",
          "New high-quality content pieces",
          "Image optimization with proper alt tags",
          "Improved user experience metrics"
        ]
      },
      {
        "phase": "Link Building & Authority",
        "duration": "Week 4-6",
        "steps": [
          "Link audit and disavow harmful links",
          "High-quality backlink acquisition strategy",
          "Local directory submissions",
          "Guest posting and content outreach",
          "Social media integration and optimization",
          "Online reputation management"
        ],
        "deliverables": [
          "Quality backlink profile improvement",
          "Local directory listings",
          "Guest post publications",
          "Social media optimization"
        ]
      },
      {
        "phase": "Monitoring & Reporting",
        "duration": "Ongoing",
        "steps": [
          "Google Analytics and Search Console setup",
          "Monthly performance tracking and reporting",
          "Keyword ranking monitoring",
          "Traffic and conversion analysis",
          "Continuous optimization based on data",
          "Regular strategy adjustments"
        ],
        "deliverables": [
          "Monthly SEO performance reports",
          "Keyword ranking tracking",
          "Traffic and conversion analytics",
          "Ongoing optimization recommendations"
        ]
      }
    ]
  },
  {
    "id": "marketing",
    "label": "Marketing",
    "title": "Digital Marketing Complete Process",
    "subtitle": "Comprehensive digital strategy to boost your online presence and growth",
    "phases": [
      {
        "phase": "Strategy & Planning",
        "duration": "Week 1",
        "steps": [
          "Brand audit and market positioning analysis",
          "Target audience research and segmentation",
          "Competitor analysis and market opportunity identification",
          "Digital marketing strategy development",
          "Channel selection and budget allocation",
          "KPI definition and success metrics"
        ],
        "deliverables": [
          "Digital marketing strategy document",
          "Target audience personas",
          "Competitive analysis report",
          "Channel strategy and budget plan"
        ]
      },
      {
        "phase": "Content Strategy & Creation",
        "duration": "Week 2-3",
        "steps": [
          "Content audit and gap analysis",
          "Content calendar development",
          "Brand voice and messaging guidelines",
          "Visual content creation and optimization",
          "SEO-optimized content production",
          "Social media content strategy"
        ],
        "deliverables": [
          "Comprehensive content calendar",
          "Brand guidelines and voice documentation",
          "SEO-optimized content pieces",
          "Visual content library"
        ]
      },
      {
        "phase": "Campaign Development & Launch",
        "duration": "Week 3-4",
        "steps": [
          "Campaign creative development",
          "Landing page optimization",
          "Email marketing setup and automation",
          "Social media campaign launch",
          "Paid advertising setup and optimization",
          "Influencer and partnership outreach"
        ],
        "deliverables": [
          "Campaign creative assets",
          "Optimized landing pages",
          "Email marketing automation",
          "Social media campaign setup"
        ]
      },
      {
        "phase": "Execution & Optimization",
        "duration": "Week 4-8",
        "steps": [
          "Campaign monitoring and performance tracking",
          "A/B testing and optimization",
          "Social media community management",
          "Content performance analysis",
          "Lead nurturing and conversion optimization",
          "ROI tracking and reporting"
        ],
        "deliverables": [
          "Performance tracking dashboards",
          "Optimization recommendations",
          "Community engagement reports",
          "ROI and conversion analysis"
        ]
      },
      {
        "phase": "Analysis & Growth",
        "duration": "Ongoing",
        "steps": [
          "Comprehensive performance analysis",
          "Customer journey optimization",
          "Scaling successful strategies",
          "New opportunity identification",
          "Long-term growth planning",
          "Continuous improvement and iteration"
        ],
        "deliverables": [
          "Monthly performance reports",
          "Growth strategy recommendations",
          "Customer journey insights",
          "Long-term digital roadmap"
        ]
      }
    ]
  },
  {
    "id": "consult",
    "label": "Tech consult",
    "title": "Tech Consult Complete Process",
    "subtitle": "Strategic technology guidance to optimize your business operations",
    "phases": [
      {
        "phase": "Business Assessment",
        "duration": "Week 1",
        "steps": [
          "Current technology infrastructure audit",
          "Business process analysis and workflow mapping",
          "Pain point identification and opportunity assessment",
          "Stakeholder interviews and requirements gathering",
          "Technology gap analysis",
          "ROI potential evaluation"
        ],
        "deliverables": [
          "Technology audit report",
          "Business process documentation",
          "Pain point analysis",
          "Opportunity assessment report"
        ]
      },
      {
        "phase": "Strategy Development",
        "duration": "Week 2",
        "steps": [
          "Technology roadmap creation",
          "Solution architecture design",
          "Vendor evaluation and selection",
          "Implementation timeline and milestones",
          "Risk assessment and mitigation planning",
          "Budget planning and cost optimization"
        ],
        "deliverables": [
          "Technology roadmap",
          "Solution architecture diagrams",
          "Vendor comparison matrix",
          "Implementation plan"
        ]
      },
      {
        "phase": "Implementation Planning",
        "duration": "Week 2-3",
        "steps": [
          "Detailed project planning and resource allocation",
          "Team training and skill development plans",
          "Change management strategy",
          "Security and compliance planning",
          "Testing and quality assurance protocols",
          "Go-live preparation and rollback plans"
        ],
        "deliverables": [
          "Detailed project plan",
          "Training and development program",
          "Change management strategy",
          "Security and compliance framework"
        ]
      },
      {
        "phase": "Execution & Support",
        "duration": "Week 3-8",
        "steps": [
          "Technology implementation and configuration",
          "System integration and data migration",
          "Team training and knowledge transfer",
          "Testing and quality assurance",
          "Go-live support and monitoring",
          "Performance optimization and tuning"
        ],
        "deliverables": [
          "Implemented technology solutions",
          "Integrated systems and processes",
          "Trained team and documentation",
          "Performance monitoring setup"
        ]
      },
      {
        "phase": "Optimization & Growth",
        "duration": "Ongoing",
        "steps": [
          "Performance monitoring and analysis",
          "Continuous optimization and improvements",
          "Technology updates and maintenance",
          "Strategic planning and future roadmap",
          "Team support and training updates",
          "Business growth alignment"
        ],
        "deliverables": [
          "Performance monitoring reports",
          "Optimization recommendations",
          "Technology maintenance plan",
          "Future growth strategy"
        ]
      }
    ]
  }
];
