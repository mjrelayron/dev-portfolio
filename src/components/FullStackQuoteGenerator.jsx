import React, { useState, useEffect } from 'react';

const FullStackQuoteGenerator = ({ onBack, onGenerateQuote, simulatorData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    projectType: '',
    complexity: '',
    features: [],
    technologies: [],
    integrations: [],
    customizations: [],
    timeline: '',
    maintenance: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const steps = [
    'Business Information',
    'Project Requirements',
    'Technology Stack',
    'Package Selection',
    'Contact Information',
    'Quote Summary'
  ];

  // Initialize with simulator data if available
  useEffect(() => {
    if (simulatorData) {
      setFormData(prev => ({
        ...prev,
        features: simulatorData.selectedFeatures || [],
        technologies: simulatorData.selectedTechnologies || [],
        complexity: simulatorData.complexity || ''
      }));
    }
  }, [simulatorData]);

  const businessTypes = [
    { value: 'startup', label: 'Startup' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'saas', label: 'SaaS Platform' },
    { value: 'nonprofit', label: 'Non-profit' }
  ];

  const projectTypes = [
    { value: 'web-app', label: 'Web Application' },
    { value: 'mobile-app', label: 'Mobile App (Web-based)' },
    { value: 'dashboard', label: 'Admin Dashboard' },
    { value: 'api', label: 'API Development' },
    { value: 'full-platform', label: 'Full Platform' },
    { value: 'custom-solution', label: 'Custom Solution' }
  ];

  const complexityLevels = [
    { value: 'simple', label: 'Simple (5-10 pages)', multiplier: 1.0 },
    { value: 'moderate', label: 'Moderate (10-25 pages)', multiplier: 1.5 },
    { value: 'complex', label: 'Complex (25+ pages)', multiplier: 2.0 },
    { value: 'enterprise', label: 'Enterprise (50+ pages)', multiplier: 3.0 }
  ];

  const technologies = [
    { value: 'react', label: 'React.js', price: 0 },
    { value: 'vue', label: 'Vue.js', price: 0 },
    { value: 'angular', label: 'Angular', price: 200 },
    { value: 'nodejs', label: 'Node.js', price: 0 },
    { value: 'express', label: 'Express.js', price: 0 },
    { value: 'nextjs', label: 'Next.js', price: 300 },
    { value: 'nuxtjs', label: 'Nuxt.js', price: 300 },
    { value: 'mongodb', label: 'MongoDB', price: 200 },
    { value: 'postgresql', label: 'PostgreSQL', price: 150 },
    { value: 'mysql', label: 'MySQL', price: 100 },
    { value: 'firebase', label: 'Firebase', price: 250 },
    { value: 'aws', label: 'AWS Services', price: 400 },
    { value: 'docker', label: 'Docker', price: 200 },
    { value: 'kubernetes', label: 'Kubernetes', price: 500 }
  ];

  const integrations = [
    { value: 'payment-gateway', label: 'Payment Gateway (Stripe/PayPal)', price: 300 },
    { value: 'email-service', label: 'Email Service (SendGrid/Mailgun)', price: 150 },
    { value: 'sms-service', label: 'SMS Service Integration', price: 200 },
    { value: 'social-auth', label: 'Social Media Authentication', price: 250 },
    { value: 'google-services', label: 'Google Services (Analytics, Maps)', price: 200 },
    { value: 'third-party-api', label: 'Third-party API Integration', price: 400 },
    { value: 'crm-integration', label: 'CRM Integration (Salesforce, HubSpot)', price: 500 },
    { value: 'webhook-setup', label: 'Webhook Configuration', price: 200 },
    { value: 'file-storage', label: 'Cloud File Storage (AWS S3, Cloudinary)', price: 250 },
    { value: 'cdn-setup', label: 'CDN Setup & Configuration', price: 200 }
  ];

  const timelines = [
    { value: 'rush', label: 'Rush (4-6 weeks)', multiplier: 1.8 },
    { value: 'standard', label: 'Standard (8-12 weeks)', multiplier: 1.0 },
    { value: 'extended', label: 'Extended (16-20 weeks)', multiplier: 0.7 },
    { value: 'flexible', label: 'Flexible (20+ weeks)', multiplier: 0.6 }
  ];

  const maintenanceOptions = [
    { value: 'none', label: 'No Maintenance', price: 0 },
    { value: 'basic', label: 'Basic Maintenance (3 months)', price: 500 },
    { value: 'standard', label: 'Standard Maintenance (6 months)', price: 800 },
    { value: 'premium', label: 'Premium Maintenance (12 months)', price: 1200 }
  ];

  const fullStackPackages = [
    {
      id: 'mvp',
      name: 'MVP Development',
      description: 'Perfect for startups and proof-of-concept applications.',
      basePrice: 3000,
      color: 'from-green-400 to-emerald-500',
      positioning: 'Startup Ready',
      features: [
        'Basic Frontend & Backend',
        'User Authentication',
        'Simple Database Design',
        'Basic UI/UX',
        'Deployment Setup',
        '1 Month Support'
      ],
      bestFor: 'Startups, MVPs, proof-of-concept'
    },
    {
      id: 'professional',
      name: 'Professional Development',
      description: 'For established businesses needing robust applications.',
      basePrice: 8000,
      color: 'from-blue-400 to-cyan-500',
      positioning: 'Business Grade',
      features: [
        'Advanced Frontend & Backend',
        'User Management System',
        'Complex Database Design',
        'Professional UI/UX',
        'API Development',
        'Testing & Quality Assurance',
        'Performance Optimization',
        'Security Implementation',
        'Deployment & CI/CD',
        '3 Months Support'
      ],
      bestFor: 'Growing businesses, professional applications'
    },
    {
      id: 'enterprise',
      name: 'Enterprise Development',
      description: 'Large-scale applications with advanced features and scalability.',
      basePrice: 15000,
      color: 'from-purple-400 to-pink-500',
      positioning: 'Enterprise Scale',
      features: [
        'Scalable Architecture',
        'Advanced User Management',
        'Complex Database Design',
        'Premium UI/UX',
        'Comprehensive API Suite',
        'Advanced Testing Suite',
        'Performance Monitoring',
        'Enterprise Security',
        'DevOps & Automation',
        'Microservices Architecture',
        'Load Balancing',
        '6 Months Support'
      ],
      bestFor: 'Large enterprises, complex platforms'
    }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const calculateQuote = () => {
    const selectedPackage = fullStackPackages.find(pkg => pkg.id === formData.selectedPackage);
    if (!selectedPackage) return null;

    let totalPrice = selectedPackage.basePrice;

    // Add technology costs
    const technologyCost = formData.technologies.reduce((total, tech) => {
      const techData = technologies.find(t => t.value === tech);
      return total + (techData ? techData.price : 0);
    }, 0);

    // Add integration costs
    const integrationCost = formData.integrations.reduce((total, integration) => {
      const integrationData = integrations.find(i => i.value === integration);
      return total + (integrationData ? integrationData.price : 0);
    }, 0);

    totalPrice += technologyCost + integrationCost;

    // Apply complexity multiplier
    const complexity = complexityLevels.find(c => c.value === formData.complexity);
    if (complexity) {
      totalPrice *= complexity.multiplier;
    }

    // Apply timeline multiplier
    const timeline = timelines.find(t => t.value === formData.timeline);
    if (timeline) {
      totalPrice *= timeline.multiplier;
    }

    // Add maintenance cost
    const maintenance = maintenanceOptions.find(m => m.value === formData.maintenance);
    const maintenanceCost = maintenance ? maintenance.price : 0;

    return {
      package: selectedPackage,
      technologyCost,
      integrationCost,
      complexityMultiplier: complexity?.multiplier || 1,
      timelineMultiplier: timeline?.multiplier || 1,
      maintenanceCost,
      totalPrice: Math.round(totalPrice),
      complexity: complexity?.label || 'Simple',
      timeline: timeline?.label || 'Standard',
      maintenance: maintenance?.label || 'No Maintenance'
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Business Information</h3>
              <p className="text-gray-300 mb-6">Tell us about your business to customize your full-stack application.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Your Business Name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Business Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {businessTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('businessType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.businessType === type.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Project Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projectTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('projectType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.projectType === type.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Project Requirements</h3>
              <p className="text-gray-300 mb-6">Define the scope and complexity of your application.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4">Project Complexity</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {complexityLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('complexity', level.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.complexity === level.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{level.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Project Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timelines.map(timeline => (
                    <button
                      key={timeline.value}
                      onClick={() => handleInputChange('timeline', timeline.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.timeline === timeline.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{timeline.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Maintenance Support</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {maintenanceOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('maintenance', option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.maintenance === option.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{option.label}</div>
                      {option.price > 0 && (
                        <div className="text-cyan-400 text-sm">+${option.price}</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Technology Stack</h3>
              <p className="text-gray-300 mb-6">Select the technologies and integrations for your application.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4">Frontend & Backend Technologies</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {technologies.map(tech => (
                    <div
                      key={tech.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.technologies.includes(tech.value)
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => handleArrayToggle('technologies', tech.value)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white">{tech.label}</div>
                        {tech.price > 0 && (
                          <div className="text-cyan-400 font-semibold">+${tech.price}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-4">Third-party Integrations</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {integrations.map(integration => (
                    <div
                      key={integration.value}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.integrations.includes(integration.value)
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => handleArrayToggle('integrations', integration.value)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-white">{integration.label}</div>
                        <div className="text-cyan-400 font-semibold">+${integration.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Choose Your Development Package</h3>
              <p className="text-gray-300 mb-6">Select the package that best fits your project needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {fullStackPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.selectedPackage === pkg.id
                      ? 'border-cyan-400 bg-cyan-400/5'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  onClick={() => handleInputChange('selectedPackage', pkg.id)}
                >
                  {/* Package Header */}
                  <div className="text-center mb-4">
                    <h4 className="text-lg font-bold text-white mb-2">{pkg.name}</h4>
                    <p className="text-gray-300 text-sm">{pkg.description}</p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-cyan-400">${pkg.basePrice.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">starting price</div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="text-sm text-gray-300 flex items-center">
                        <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Best For */}
                  <div className="text-center mb-4">
                    <div className="text-xs text-gray-400 mb-1">Best for:</div>
                    <div className="text-sm text-gray-300">{pkg.bestFor}</div>
                  </div>
                  
                  {/* Selection Indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 mx-auto flex items-center justify-center ${
                    formData.selectedPackage === pkg.id
                      ? 'border-cyan-400 bg-cyan-400'
                      : 'border-gray-500'
                  }`}>
                    {formData.selectedPackage === pkg.id && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <p className="text-gray-300 mb-6">Provide your contact details so we can deliver your quote.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.contactInfo.name}
                  onChange={(e) => handleInputChange('contactInfo.name', e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleInputChange('contactInfo.email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleInputChange('contactInfo.phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        const quote = calculateQuote();
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quote Summary</h3>
              <p className="text-gray-300 mb-6">Review your full-stack development quote and requirements.</p>
            </div>

            {quote && (
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Details */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Business:</span> <span className="text-white ml-2">{formData.businessName}</span></div>
                      <div><span className="text-gray-400">Type:</span> <span className="text-white ml-2">{businessTypes.find(t => t.value === formData.businessType)?.label}</span></div>
                      <div><span className="text-gray-400">Project:</span> <span className="text-white ml-2">{projectTypes.find(t => t.value === formData.projectType)?.label}</span></div>
                      <div><span className="text-gray-400">Complexity:</span> <span className="text-white ml-2">{quote.complexity}</span></div>
                      <div><span className="text-gray-400">Timeline:</span> <span className="text-white ml-2">{quote.timeline}</span></div>
                      <div><span className="text-gray-400">Maintenance:</span> <span className="text-white ml-2">{quote.maintenance}</span></div>
                    </div>
                  </div>

                  {/* Package & Pricing */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Package & Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Package:</span> <span className="text-white ml-2">{quote.package.name}</span></div>
                      <div><span className="text-gray-400">Base Price:</span> <span className="text-white ml-2">${quote.package.basePrice.toLocaleString()}</span></div>
                      {quote.technologyCost > 0 && (
                        <div><span className="text-gray-400">Technologies:</span> <span className="text-white ml-2">+${quote.technologyCost.toLocaleString()}</span></div>
                      )}
                      {quote.integrationCost > 0 && (
                        <div><span className="text-gray-400">Integrations:</span> <span className="text-white ml-2">+${quote.integrationCost.toLocaleString()}</span></div>
                      )}
                      {quote.complexityMultiplier !== 1 && (
                        <div><span className="text-gray-400">Complexity:</span> <span className="text-white ml-2">{quote.complexityMultiplier}x</span></div>
                      )}
                      {quote.timelineMultiplier !== 1 && (
                        <div><span className="text-gray-400">Timeline:</span> <span className="text-white ml-2">{quote.timelineMultiplier}x</span></div>
                      )}
                      {quote.maintenanceCost > 0 && (
                        <div><span className="text-gray-400">Maintenance:</span> <span className="text-white ml-2">+${quote.maintenanceCost.toLocaleString()}</span></div>
                      )}
                      <div className="border-t border-gray-600 pt-2 mt-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400 font-medium">Total:</span>
                          <span className="text-cyan-400 font-bold text-lg">${quote.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Technologies */}
                {formData.technologies.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-white mb-3">Selected Technologies</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.technologies.map(tech => {
                        const techData = technologies.find(t => t.value === tech);
                        return (
                          <div key={tech} className="text-sm text-gray-300 flex items-center">
                            <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{techData?.label} {techData?.price > 0 ? `(+$${techData.price})` : ''}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Selected Integrations */}
                {formData.integrations.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-white mb-3">Selected Integrations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.integrations.map(integration => {
                        const integrationData = integrations.find(i => i.value === integration);
                        return (
                          <div key={integration} className="text-sm text-gray-300 flex items-center">
                            <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{integrationData?.label} (+${integrationData?.price})</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName && formData.businessType && formData.projectType;
      case 1:
        return formData.complexity && formData.timeline && formData.maintenance;
      case 2:
        return formData.technologies.length > 0;
      case 3:
        return formData.selectedPackage;
      case 4:
        return formData.contactInfo.name && formData.contactInfo.email;
      case 5:
        return true; // Final step - always valid
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 5) {
      handleGenerateQuote();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleGenerateQuote = () => {
    const quote = calculateQuote();
    if (quote) {
      onGenerateQuote(quote, formData);
    }
  };

  return (
    <div className="lab-stage">
      <div className="lab-quote">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border-b border-cyan-400/30 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">FullStack Quote Generator</h2>
              <p className="text-gray-300 text-sm">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
              </p>
            </div>
            <button
              onClick={onBack}
              aria-label="Close quote generator"
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 text-gray-300 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-0">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border-t border-cyan-400/30 p-6 rounded-b-2xl">
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300"
            >
              Previous
            </button>
            <button
              onClick={currentStep === 5 ? undefined : handleNext}
              disabled={!isStepValid() || currentStep === 5}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 5 ? 'Quote Generated ✓' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullStackQuoteGenerator;
