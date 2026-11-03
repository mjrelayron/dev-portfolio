import React, { useState, useEffect } from 'react';

const WordPressQuoteGenerator = ({ onBack, onGenerateQuote, simulatorData }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    websiteType: '',
    features: [],
    designStyle: '',
    contentManagement: '',
    ecommerce: false,
    customizations: [],
    timeline: '',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });

  const steps = [
    'Business Information',
    'Website Requirements',
    'Package Selection',
    'Contact Information',
    'Quote Summary'
  ];

  // Initialize with simulator data if available
  useEffect(() => {
    if (simulatorData) {
      setFormData(prev => ({
        ...prev,
        features: simulatorData.selectedElements || [],
        websiteType: simulatorData.websiteType || 'new'
      }));
    }
  }, [simulatorData]);

  const businessTypes = [
    { value: 'local-business', label: 'Local Business' },
    { value: 'ecommerce', label: 'E-commerce Store' },
    { value: 'portfolio', label: 'Portfolio/Personal' },
    { value: 'blog', label: 'Blog/Content Site' },
    { value: 'corporate', label: 'Corporate Website' },
    { value: 'nonprofit', label: 'Non-profit Organization' }
  ];

  const websiteTypes = [
    { value: 'new', label: 'New Website' },
    { value: 'redesign', label: 'Website Redesign' },
    { value: 'migration', label: 'Website Migration' }
  ];

  const designStyles = [
    { value: 'modern', label: 'Modern & Clean' },
    { value: 'creative', label: 'Creative & Artistic' },
    { value: 'professional', label: 'Professional & Corporate' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'bold', label: 'Bold & Colorful' }
  ];

  const contentManagement = [
    { value: 'basic', label: 'Basic Content Management' },
    { value: 'advanced', label: 'Advanced CMS Features' },
    { value: 'multi-user', label: 'Multi-user Management' },
    { value: 'custom', label: 'Custom Admin Interface' }
  ];

  const timelines = [
    { value: 'rush', label: 'Rush (1-2 weeks)', multiplier: 1.5 },
    { value: 'standard', label: 'Standard (3-4 weeks)', multiplier: 1.0 },
    { value: 'extended', label: 'Extended (5-8 weeks)', multiplier: 0.8 }
  ];

  const wordPressPackages = [
    {
      id: 'starter',
      name: 'Starter WordPress',
      description: 'Perfect for small businesses and personal websites.',
      basePrice: 800,
      color: 'from-green-400 to-emerald-500',
      positioning: 'Essential',
      features: [
        'Custom WordPress Theme',
        'Responsive Design',
        'Contact Form',
        'Basic SEO Setup',
        '3 Pages Included',
        '1 Month Support'
      ],
      bestFor: 'Small businesses, personal sites, portfolios'
    },
    {
      id: 'business',
      name: 'Business WordPress',
      description: 'For growing businesses that need more functionality.',
      basePrice: 1500,
      color: 'from-blue-400 to-cyan-500',
      positioning: 'Professional',
      features: [
        'Custom WordPress Theme',
        'Responsive Design',
        'Advanced Contact Forms',
        'SEO Optimization',
        'Blog Setup',
        'Social Media Integration',
        'Analytics Setup',
        '5 Pages Included',
        '3 Months Support'
      ],
      bestFor: 'Growing businesses, service providers, agencies'
    },
    {
      id: 'premium',
      name: 'Premium WordPress',
      description: 'Full-featured websites with advanced functionality.',
      basePrice: 2500,
      color: 'from-purple-400 to-pink-500',
      positioning: 'Complete',
      features: [
        'Custom WordPress Theme',
        'Responsive Design',
        'Advanced Forms & Integrations',
        'Complete SEO Setup',
        'Blog & Content Management',
        'Social Media Integration',
        'Analytics & Tracking',
        'Performance Optimization',
        'Security Setup',
        'Unlimited Pages',
        '6 Months Support'
      ],
      bestFor: 'Large businesses, e-commerce, complex sites'
    }
  ];

  const additionalFeatures = [
    // Advanced Page Elements (not in drag-and-drop)
    { value: 'advanced-hero', label: 'Advanced Hero Section with Video/Animations', price: 300 },
    { value: 'testimonials', label: 'Customer Testimonials Section', price: 250 },
    { value: 'team-section', label: 'Team/Staff Section', price: 200 },
    { value: 'services-grid', label: 'Services Grid/Layout', price: 350 },
    { value: 'portfolio-gallery', label: 'Advanced Portfolio Gallery', price: 400 },
    { value: 'pricing-tables', label: 'Pricing Tables Section', price: 300 },
    { value: 'faq-section', label: 'FAQ Accordion Section', price: 200 },
    { value: 'newsletter-signup', label: 'Newsletter Signup Integration', price: 150 },
    { value: 'social-feeds', label: 'Social Media Feed Integration', price: 250 },
    { value: 'countdown-timer', label: 'Countdown Timer/Limited Offers', price: 200 },
    { value: 'before-after', label: 'Before/After Comparison Slider', price: 300 },
    { value: 'interactive-map', label: 'Interactive Maps Integration', price: 250 },
    
    // E-commerce & Business Features
    { value: 'ecommerce', label: 'Full E-commerce Integration (WooCommerce)', price: 800 },
    { value: 'membership', label: 'Membership/Subscription System', price: 600 },
    { value: 'booking', label: 'Appointment Booking System', price: 500 },
    { value: 'event-calendar', label: 'Event Calendar Integration', price: 400 },
    { value: 'job-board', label: 'Job Board/Listings System', price: 700 },
    { value: 'directory', label: 'Business Directory Integration', price: 600 },
    
    // Advanced Functionality
    { value: 'multilingual', label: 'Multilingual Website Setup', price: 400 },
    { value: 'custom-plugins', label: 'Custom Plugin Development', price: 1000 },
    { value: 'api-integration', label: 'Third-party API Integration', price: 700 },
    { value: 'webhooks', label: 'Webhook Integration', price: 300 },
    { value: 'advanced-forms', label: 'Advanced Forms with Conditional Logic', price: 400 },
    { value: 'user-dashboard', label: 'Custom User Dashboard', price: 800 },
    { value: 'file-upload', label: 'Advanced File Upload System', price: 350 },
    { value: 'search-functionality', label: 'Advanced Search Functionality', price: 300 },
    
    // Performance & Security
    { value: 'advanced-security', label: 'Advanced Security Features', price: 300 },
    { value: 'backup-system', label: 'Automated Backup System', price: 200 },
    { value: 'cdn-setup', label: 'CDN Setup & Optimization', price: 250 },
    { value: 'caching', label: 'Advanced Caching Configuration', price: 200 },
    { value: 'performance-optimization', label: 'Performance Optimization', price: 400 },
    { value: 'seo-advanced', label: 'Advanced SEO Setup & Schema', price: 300 },
    
    // Content Management
    { value: 'content-migration', label: 'Content Migration from Old Site', price: 500 },
    { value: 'bulk-content', label: 'Bulk Content Import/Export', price: 300 },
    { value: 'content-workflow', label: 'Content Approval Workflow', price: 400 },
    { value: 'media-library', label: 'Advanced Media Library Organization', price: 250 },
    
    // Design & Customization
    { value: 'custom-post-types', label: 'Custom Post Types & Fields', price: 400 },
    { value: 'theme-customization', label: 'Deep Theme Customization', price: 600 },
    { value: 'responsive-optimization', label: 'Mobile-First Responsive Optimization', price: 300 },
    { value: 'accessibility', label: 'WCAG Accessibility Compliance', price: 400 },
    { value: 'brand-consistency', label: 'Brand Consistency Implementation', price: 250 }
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

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleCustomizationToggle = (customization) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.includes(customization)
        ? prev.customizations.filter(c => c !== customization)
        : [...prev.customizations, customization]
    }));
  };

  const calculateQuote = () => {
    const selectedPackage = wordPressPackages.find(pkg => pkg.id === formData.selectedPackage);
    if (!selectedPackage) return null;

    let totalPrice = selectedPackage.basePrice;

    // Add customization costs
    const customizationCost = formData.features.reduce((total, customization) => {
      const feature = additionalFeatures.find(f => f.value === customization);
      return total + (feature ? feature.price : 0);
    }, 0);

    totalPrice += customizationCost;

    // Apply timeline multiplier
    const timeline = timelines.find(t => t.value === formData.timeline);
    if (timeline) {
      totalPrice *= timeline.multiplier;
    }

    return {
      package: selectedPackage,
      customizationCost,
      timelineMultiplier: timeline?.multiplier || 1,
      totalPrice: Math.round(totalPrice),
      timeline: timeline?.label || 'Standard'
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Business Information</h3>
              <p className="text-gray-300 mb-6">Tell us about your business to customize your WordPress website.</p>
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
                <label className="block text-white font-medium mb-2">Website Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {websiteTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('websiteType', type.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.websiteType === type.value
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
              <h3 className="text-xl font-bold text-white mb-4">Website Requirements</h3>
              <p className="text-gray-300 mb-6">Select the features and design style for your WordPress website.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-4">Design Style</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {designStyles.map(style => (
                    <button
                      key={style.value}
                      onClick={() => handleInputChange('designStyle', style.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.designStyle === style.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{style.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-4">Content Management</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contentManagement.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleInputChange('contentManagement', option.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.contentManagement === option.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-4">Additional Features</label>
                <p className="text-gray-400 text-sm mb-4">Select advanced features not available in the basic drag-and-drop builder.</p>
                
                {/* Advanced Page Elements */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    Advanced Page Elements
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionalFeatures.slice(0, 12).map(feature => (
                      <div
                        key={feature.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature.value)
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{feature.label}</div>
                          <div className="text-cyan-400 font-semibold text-sm">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* E-commerce & Business Features */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    E-commerce & Business Features
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionalFeatures.slice(12, 18).map(feature => (
                      <div
                        key={feature.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature.value)
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{feature.label}</div>
                          <div className="text-cyan-400 font-semibold text-sm">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Functionality */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                    Advanced Functionality
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionalFeatures.slice(18, 26).map(feature => (
                      <div
                        key={feature.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature.value)
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{feature.label}</div>
                          <div className="text-cyan-400 font-semibold text-sm">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance & Security */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    Performance & Security
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionalFeatures.slice(26, 32).map(feature => (
                      <div
                        key={feature.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature.value)
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{feature.label}</div>
                          <div className="text-cyan-400 font-semibold text-sm">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Management & Design */}
                <div className="mb-6">
                  <h5 className="text-white font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    Content Management & Design
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {additionalFeatures.slice(32, 42).map(feature => (
                      <div
                        key={feature.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature.value)
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => handleFeatureToggle(feature.value)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="font-medium text-white text-sm">{feature.label}</div>
                          <div className="text-cyan-400 font-semibold text-sm">+${feature.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Project Timeline</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Choose Your WordPress Package</h3>
              <p className="text-gray-300 mb-6">Select the package that best fits your website needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wordPressPackages.map(pkg => (
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

      case 3:
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

      case 4:
        const quote = calculateQuote();
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Quote Summary</h3>
              <p className="text-gray-300 mb-6">Review your WordPress website quote and requirements.</p>
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
                      <div><span className="text-gray-400">Website:</span> <span className="text-white ml-2">{websiteTypes.find(t => t.value === formData.websiteType)?.label}</span></div>
                      <div><span className="text-gray-400">Design:</span> <span className="text-white ml-2">{designStyles.find(s => s.value === formData.designStyle)?.label}</span></div>
                      <div><span className="text-gray-400">Timeline:</span> <span className="text-white ml-2">{quote.timeline}</span></div>
                    </div>
                  </div>

                  {/* Package & Pricing */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Package & Pricing</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-400">Package:</span> <span className="text-white ml-2">{quote.package.name}</span></div>
                      <div><span className="text-gray-400">Base Price:</span> <span className="text-white ml-2">${quote.package.basePrice.toLocaleString()}</span></div>
                      {quote.customizationCost > 0 && (
                        <div><span className="text-gray-400">Add-ons:</span> <span className="text-white ml-2">+${quote.customizationCost.toLocaleString()}</span></div>
                      )}
                      {quote.timelineMultiplier !== 1 && (
                        <div><span className="text-gray-400">Timeline:</span> <span className="text-white ml-2">{quote.timelineMultiplier > 1 ? '+' : ''}{Math.round((quote.timelineMultiplier - 1) * 100)}%</span></div>
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

                {/* Selected Features */}
                {formData.features.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-bold text-white mb-3">Selected Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {formData.features.map(feature => {
                        const featureData = additionalFeatures.find(f => f.value === feature);
                        return (
                          <div key={feature} className="text-sm text-gray-300 flex items-center">
                            <svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{featureData?.label} (+${featureData?.price})</span>
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
        return formData.businessName && formData.businessType && formData.websiteType;
      case 1:
        return formData.designStyle && formData.contentManagement && formData.timeline;
      case 2:
        return formData.selectedPackage;
      case 3:
        return formData.contactInfo.name && formData.contactInfo.email;
      case 4:
        return true; // Final step - always valid
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
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
              <h2 className="text-2xl font-bold text-white">WordPress Quote Generator</h2>
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
              onClick={currentStep === 4 ? undefined : handleNext}
              disabled={!isStepValid() || currentStep === 4}
              className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? 'Quote Generated ✓' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPressQuoteGenerator;
