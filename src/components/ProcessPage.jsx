import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProcessPage = ({ service, onBack }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBack = () => {
    setIsVisible(false);
    // Restore body scroll immediately
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      onBack();
    }, 300);
  };

  const seoProcess = {
    title: "SEO Optimization Complete Process",
    subtitle: "How I transform your website's search engine visibility",
    timeline: [
      {
        phase: "Discovery & Analysis",
        duration: "Week 1",
        steps: [
          "Initial consultation and goal setting",
          "Complete website audit and technical analysis",
          "Competitor research and market analysis",
          "Keyword research and strategy development",
          "Content gap analysis and opportunities identification"
        ],
        deliverables: [
          "Comprehensive SEO audit report",
          "Keyword research and strategy document",
          "Competitor analysis report",
          "Technical recommendations list"
        ]
      },
      {
        phase: "Technical Optimization",
        duration: "Week 2-3",
        steps: [
          "Site speed optimization and performance tuning",
          "Mobile responsiveness improvements",
          "Core Web Vitals optimization",
          "Schema markup implementation",
          "XML sitemap creation and submission",
          "Robots.txt optimization",
          "URL structure improvements",
          "Internal linking strategy implementation"
        ],
        deliverables: [
          "Technical SEO improvements report",
          "Performance optimization results",
          "Schema markup documentation",
          "Updated sitemap and robots.txt"
        ]
      },
      {
        phase: "Content Strategy & Optimization",
        duration: "Week 3-4",
        steps: [
          "Content audit and optimization",
          "Title tag and meta description optimization",
          "Header structure improvements (H1, H2, H3)",
          "Image optimization with alt tags",
          "Content gap filling and new content creation",
          "Local SEO optimization (if applicable)",
          "User experience improvements"
        ],
        deliverables: [
          "Optimized content with improved rankings",
          "New high-quality content pieces",
          "Image optimization with proper alt tags",
          "Improved user experience metrics"
        ]
      },
      {
        phase: "Link Building & Authority",
        duration: "Week 4-6",
        steps: [
          "Link audit and disavow harmful links",
          "High-quality backlink acquisition strategy",
          "Local directory submissions",
          "Guest posting and content outreach",
          "Social media integration and optimization",
          "Online reputation management"
        ],
        deliverables: [
          "Quality backlink profile improvement",
          "Local directory listings",
          "Guest post publications",
          "Social media optimization"
        ]
      },
      {
        phase: "Monitoring & Reporting",
        duration: "Ongoing",
        steps: [
          "Google Analytics and Search Console setup",
          "Monthly performance tracking and reporting",
          "Keyword ranking monitoring",
          "Traffic and conversion analysis",
          "Continuous optimization based on data",
          "Regular strategy adjustments"
        ],
        deliverables: [
          "Monthly SEO performance reports",
          "Keyword ranking tracking",
          "Traffic and conversion analytics",
          "Ongoing optimization recommendations"
        ]
      }
    ]
  };

  const wordpressProcess = {
    title: "WordPress Development Complete Process",
    subtitle: "From concept to launch - your complete WordPress journey",
    timeline: [
      {
        phase: "Planning & Discovery",
        duration: "Week 1",
        steps: [
          "Requirements gathering and project scope definition",
          "Target audience analysis and user experience planning",
          "Content strategy and site architecture planning",
          "Design mockups and wireframe creation",
          "Technology stack selection and hosting setup",
          "Timeline and milestone planning"
        ],
        deliverables: [
          "Project scope document",
          "Site architecture and sitemap",
          "Design mockups and wireframes",
          "Technology stack documentation"
        ]
      },
      {
        phase: "Design & Development Setup",
        duration: "Week 2",
        steps: [
          "Custom theme development or premium theme customization",
          "Responsive design implementation",
          "Custom post types and fields setup",
          "Plugin selection and configuration",
          "Database optimization and security setup",
          "Development environment configuration"
        ],
        deliverables: [
          "Custom WordPress theme",
          "Responsive design across all devices",
          "Optimized database structure",
          "Security-hardened WordPress installation"
        ]
      },
      {
        phase: "Content & Functionality",
        duration: "Week 3",
        steps: [
          "Content migration and optimization",
          "Custom functionality development",
          "E-commerce integration (if needed)",
          "Contact forms and user interaction setup",
          "SEO optimization and meta data setup",
          "Performance optimization and caching setup"
        ],
        deliverables: [
          "Fully functional website with content",
          "Custom features and functionality",
          "Optimized performance and SEO",
          "User-friendly interface"
        ]
      },
      {
        phase: "Testing & Quality Assurance",
        duration: "Week 4",
        steps: [
          "Cross-browser compatibility testing",
          "Mobile responsiveness testing",
          "Performance testing and optimization",
          "Security testing and vulnerability assessment",
          "User acceptance testing",
          "Content review and final adjustments"
        ],
        deliverables: [
          "Bug-free, fully tested website",
          "Cross-browser compatibility",
          "Optimized performance metrics",
          "Security-hardened site"
        ]
      },
      {
        phase: "Launch & Support",
        duration: "Week 5+",
        steps: [
          "Domain setup and DNS configuration",
          "SSL certificate installation",
          "Website launch and go-live",
          "User training and documentation",
          "Post-launch monitoring and support",
          "Maintenance plan setup"
        ],
        deliverables: [
          "Live, fully functional website",
          "User training materials",
          "Maintenance and support plan",
          "Performance monitoring setup"
        ]
      }
    ]
  };

  const fullstackProcess = {
    title: "Full Stack Development Complete Process",
    subtitle: "End-to-end web application development from database to deployment",
    timeline: [
      {
        phase: "Project Planning & Architecture",
        duration: "Week 1-2",
        steps: [
          "Requirements analysis and technical specification",
          "System architecture design and technology stack selection",
          "Database design and entity relationship modeling",
          "API design and endpoint planning",
          "Security architecture and authentication planning",
          "Scalability and performance considerations"
        ],
        deliverables: [
          "Technical specification document",
          "System architecture diagrams",
          "Database schema design",
          "API documentation outline"
        ]
      },
      {
        phase: "Backend Development",
        duration: "Week 3-5",
        steps: [
          "Database setup and optimization",
          "Backend API development and testing",
          "Authentication and authorization implementation",
          "Business logic and core functionality development",
          "Data validation and error handling",
          "API documentation and testing"
        ],
        deliverables: [
          "Robust backend API",
          "Secure authentication system",
          "Optimized database with proper indexing",
          "Comprehensive API documentation"
        ]
      },
      {
        phase: "Frontend Development",
        duration: "Week 4-6",
        steps: [
          "User interface design and implementation",
          "Responsive frontend development",
          "State management and data flow setup",
          "API integration and data fetching",
          "User experience optimization",
          "Cross-browser compatibility testing"
        ],
        deliverables: [
          "Modern, responsive user interface",
          "Seamless API integration",
          "Optimized user experience",
          "Cross-browser compatible frontend"
        ]
      },
      {
        phase: "Integration & Testing",
        duration: "Week 6-7",
        steps: [
          "Frontend-backend integration testing",
          "End-to-end testing and quality assurance",
          "Performance testing and optimization",
          "Security testing and vulnerability assessment",
          "User acceptance testing",
          "Bug fixing and code optimization"
        ],
        deliverables: [
          "Fully integrated application",
          "Comprehensive test coverage",
          "Performance-optimized system",
          "Security-hardened application"
        ]
      },
      {
        phase: "Deployment & Maintenance",
        duration: "Week 8+",
        steps: [
          "Production environment setup",
          "CI/CD pipeline configuration",
          "Application deployment and monitoring setup",
          "Documentation and user guides",
          "Training and knowledge transfer",
          "Ongoing maintenance and support"
        ],
        deliverables: [
          "Live, production-ready application",
          "Automated deployment pipeline",
          "Comprehensive documentation",
          "Maintenance and support plan"
        ]
      }
    ]
  };

  const uiuxProcess = {
    title: "UI/UX Design Complete Process",
    subtitle: "Creating beautiful, intuitive user experiences that drive engagement",
    timeline: [
      {
        phase: "Discovery & Research",
        duration: "Week 1",
        steps: [
          "User research and persona development",
          "Competitor analysis and market research",
          "Stakeholder interviews and requirements gathering",
          "User journey mapping and pain point identification",
          "Design goals and success metrics definition",
          "Technical constraints and platform analysis"
        ],
        deliverables: [
          "User personas and research insights",
          "Competitive analysis report",
          "User journey maps",
          "Design strategy document"
        ]
      },
      {
        phase: "Information Architecture",
        duration: "Week 2",
        steps: [
          "Site/app structure and navigation design",
          "Content strategy and information hierarchy",
          "Wireframe creation and user flow mapping",
          "Interaction patterns and component planning",
          "Accessibility considerations and guidelines",
          "Mobile-first responsive strategy"
        ],
        deliverables: [
          "Site map and navigation structure",
          "Low-fidelity wireframes",
          "User flow diagrams",
          "Information architecture documentation"
        ]
      },
      {
        phase: "Visual Design & Prototyping",
        duration: "Week 3-4",
        steps: [
          "Brand integration and visual identity",
          "High-fidelity mockup creation",
          "Interactive prototype development",
          "Design system and component library",
          "Responsive design across all devices",
          "Visual design refinement and iteration"
        ],
        deliverables: [
          "High-fidelity design mockups",
          "Interactive prototypes",
          "Design system documentation",
          "Responsive design specifications"
        ]
      },
      {
        phase: "User Testing & Validation",
        duration: "Week 4-5",
        steps: [
          "Usability testing plan and execution",
          "User feedback collection and analysis",
          "A/B testing setup and monitoring",
          "Design iteration based on findings",
          "Accessibility testing and compliance",
          "Performance optimization recommendations"
        ],
        deliverables: [
          "Usability testing reports",
          "User feedback analysis",
          "Design iteration recommendations",
          "Accessibility compliance report"
        ]
      },
      {
        phase: "Handoff & Implementation",
        duration: "Week 5-6",
        steps: [
          "Developer handoff and documentation",
          "Asset preparation and optimization",
          "Design system implementation guide",
          "Quality assurance and design review",
          "Launch support and monitoring",
          "Post-launch optimization recommendations"
        ],
        deliverables: [
          "Complete design handoff package",
          "Optimized design assets",
          "Implementation guidelines",
          "Post-launch optimization plan"
        ]
      }
    ]
  };

  const digitalMarketingProcess = {
    title: "Digital Marketing Complete Process",
    subtitle: "Comprehensive digital strategy to boost your online presence and growth",
    timeline: [
      {
        phase: "Strategy & Planning",
        duration: "Week 1",
        steps: [
          "Brand audit and market positioning analysis",
          "Target audience research and segmentation",
          "Competitor analysis and market opportunity identification",
          "Digital marketing strategy development",
          "Channel selection and budget allocation",
          "KPI definition and success metrics"
        ],
        deliverables: [
          "Digital marketing strategy document",
          "Target audience personas",
          "Competitive analysis report",
          "Channel strategy and budget plan"
        ]
      },
      {
        phase: "Content Strategy & Creation",
        duration: "Week 2-3",
        steps: [
          "Content audit and gap analysis",
          "Content calendar development",
          "Brand voice and messaging guidelines",
          "Visual content creation and optimization",
          "SEO-optimized content production",
          "Social media content strategy"
        ],
        deliverables: [
          "Comprehensive content calendar",
          "Brand guidelines and voice documentation",
          "SEO-optimized content pieces",
          "Visual content library"
        ]
      },
      {
        phase: "Campaign Development & Launch",
        duration: "Week 3-4",
        steps: [
          "Campaign creative development",
          "Landing page optimization",
          "Email marketing setup and automation",
          "Social media campaign launch",
          "Paid advertising setup and optimization",
          "Influencer and partnership outreach"
        ],
        deliverables: [
          "Campaign creative assets",
          "Optimized landing pages",
          "Email marketing automation",
          "Social media campaign setup"
        ]
      },
      {
        phase: "Execution & Optimization",
        duration: "Week 4-8",
        steps: [
          "Campaign monitoring and performance tracking",
          "A/B testing and optimization",
          "Social media community management",
          "Content performance analysis",
          "Lead nurturing and conversion optimization",
          "ROI tracking and reporting"
        ],
        deliverables: [
          "Performance tracking dashboards",
          "Optimization recommendations",
          "Community engagement reports",
          "ROI and conversion analysis"
        ]
      },
      {
        phase: "Analysis & Growth",
        duration: "Ongoing",
        steps: [
          "Comprehensive performance analysis",
          "Customer journey optimization",
          "Scaling successful strategies",
          "New opportunity identification",
          "Long-term growth planning",
          "Continuous improvement and iteration"
        ],
        deliverables: [
          "Monthly performance reports",
          "Growth strategy recommendations",
          "Customer journey insights",
          "Long-term digital roadmap"
        ]
      }
    ]
  };

  const techConsultProcess = {
    title: "Tech Consult Complete Process",
    subtitle: "Strategic technology guidance to optimize your business operations",
    timeline: [
      {
        phase: "Business Assessment",
        duration: "Week 1",
        steps: [
          "Current technology infrastructure audit",
          "Business process analysis and workflow mapping",
          "Pain point identification and opportunity assessment",
          "Stakeholder interviews and requirements gathering",
          "Technology gap analysis",
          "ROI potential evaluation"
        ],
        deliverables: [
          "Technology audit report",
          "Business process documentation",
          "Pain point analysis",
          "Opportunity assessment report"
        ]
      },
      {
        phase: "Strategy Development",
        duration: "Week 2",
        steps: [
          "Technology roadmap creation",
          "Solution architecture design",
          "Vendor evaluation and selection",
          "Implementation timeline and milestones",
          "Risk assessment and mitigation planning",
          "Budget planning and cost optimization"
        ],
        deliverables: [
          "Technology roadmap",
          "Solution architecture diagrams",
          "Vendor comparison matrix",
          "Implementation plan"
        ]
      },
      {
        phase: "Implementation Planning",
        duration: "Week 2-3",
        steps: [
          "Detailed project planning and resource allocation",
          "Team training and skill development plans",
          "Change management strategy",
          "Security and compliance planning",
          "Testing and quality assurance protocols",
          "Go-live preparation and rollback plans"
        ],
        deliverables: [
          "Detailed project plan",
          "Training and development program",
          "Change management strategy",
          "Security and compliance framework"
        ]
      },
      {
        phase: "Execution & Support",
        duration: "Week 3-8",
        steps: [
          "Technology implementation and configuration",
          "System integration and data migration",
          "Team training and knowledge transfer",
          "Testing and quality assurance",
          "Go-live support and monitoring",
          "Performance optimization and tuning"
        ],
        deliverables: [
          "Implemented technology solutions",
          "Integrated systems and processes",
          "Trained team and documentation",
          "Performance monitoring setup"
        ]
      },
      {
        phase: "Optimization & Growth",
        duration: "Ongoing",
        steps: [
          "Performance monitoring and analysis",
          "Continuous optimization and improvements",
          "Technology updates and maintenance",
          "Strategic planning and future roadmap",
          "Team support and training updates",
          "Business growth alignment"
        ],
        deliverables: [
          "Performance monitoring reports",
          "Optimization recommendations",
          "Technology maintenance plan",
          "Future growth strategy"
        ]
      }
    ]
  };

  const getProcessData = () => {
    switch (service) {
      case 'seo':
        return seoProcess;
      case 'wordpress':
        return wordpressProcess;
      case 'fullstack':
        return fullstackProcess;
      case 'uiux':
        return uiuxProcess;
      case 'digital-marketing':
        return digitalMarketingProcess;
      case 'tech-consult':
        return techConsultProcess;
      default:
        return seoProcess;
    }
  };

  const processData = getProcessData();

  return (
    <div className={`lab-stage transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="lab-stage__inner">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="lab-key inline-flex items-center px-3 py-2 text-sm font-semibold mb-4"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {processData.title}
              </h1>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                {processData.subtitle}
              </p>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="space-y-8">
            {processData.timeline.map((phase, index) => (
              <div key={index} className="glass-content-pane">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Phase {index + 1}: {phase.phase}
                    </h3>
                    <span className="inline-block bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {phase.duration}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Steps */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      What I'll Do
                    </h4>
                    <ul className="space-y-3">
                      {phase.steps.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 bg-cyan-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                          </div>
                          <span className="text-gray-300">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deliverables */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      What You'll Get
                    </h4>
                    <ul className="space-y-3">
                      {phase.deliverables.map((deliverable, deliverableIndex) => (
                        <li key={deliverableIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 bg-purple-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="text-gray-300">{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="glass-content-pane max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-300 mb-6">
                Let's discuss your project and create a custom timeline that fits your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBack}
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Try the Simulator
                </button>
                <button
                  onClick={() => {
                    const contact = document.getElementById('contact');
                    if (contact) contact.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/contact');
                    handleBack();
                  }}
                  className="bg-gray-700/80 hover:bg-gray-600/80 text-white font-bold py-3 px-8 rounded-lg border border-gray-500 hover:border-gray-400 transition-all duration-300"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessPage;
