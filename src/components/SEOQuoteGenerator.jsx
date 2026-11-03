import React, { useState, useEffect } from 'react';

const SEOQuoteGenerator = ({ 
  onBack, 
  onGenerateQuote, 
  simulatorData = null 
}) => {
  const [formData, setFormData] = useState({
    businessType: '',
    websiteType: '',
    currentTraffic: '',
    websiteUrl: '',
    targetKeywords: '',
    competitionLevel: '',
    selectedPackage: '',
    customizations: [],
    contactInfo: {
      name: '',
      email: '',
      phone: '',
      company: ''
    }
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [quoteData, setQuoteData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlValidation, setUrlValidation] = useState({ isValid: false, message: '', isValidating: false });

  const steps = [
    'Business Information',
    'SEO Requirements', 
    'Package Selection',
    'Contact Information',
    'Quote Summary'
  ];

  // Initialize with simulator data if available
  useEffect(() => {
    if (simulatorData) {
      setFormData(prev => ({
        ...prev,
        websiteUrl: simulatorData.websiteUrl || '',
        targetKeywords: simulatorData.keywords || '',
        websiteType: simulatorData.websiteUrl ? 'existing' : 'new'
      }));
      
      // Validate the URL from simulator data
      if (simulatorData.websiteUrl) {
        const validation = validateUrl(simulatorData.websiteUrl);
        setUrlValidation({
          isValid: validation.isValid,
          message: validation.message,
          isValidating: false
        });
      }
    }
  }, [simulatorData]);

  const businessTypes = [
    { value: 'local-business', label: 'Local Business' },
    { value: 'ecommerce', label: 'E-commerce Store' },
    { value: 'service-provider', label: 'Service Provider' },
    { value: 'blog-content', label: 'Blog/Content Site' },
    { value: 'saas-startup', label: 'SaaS/Startup' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  const websiteTypes = [
    { value: 'new', label: 'New Website (0-6 months)' },
    { value: 'existing', label: 'Existing Website' },
    { value: 'redesign', label: 'Website Redesign' }
  ];

  const trafficLevels = [
    { value: 'low', label: 'Low (0-1,000 visitors/month)' },
    { value: 'medium', label: 'Medium (1,000-10,000 visitors/month)' },
    { value: 'high', label: 'High (10,000+ visitors/month)' }
  ];

  const competitionLevels = [
    { value: 'low', label: 'Low Competition' },
    { value: 'medium', label: 'Medium Competition' },
    { value: 'high', label: 'High Competition' },
    { value: 'very-high', label: 'Very High Competition' }
  ];

  const seoPackages = [
    {
      id: 'starter',
      name: 'Starter SEO Package',
      monthlyPrice: 1200,
      description: 'Perfect for small businesses and startups wanting solid SEO foundations',
      positioning: 'Build your SEO foundation',
      color: 'from-green-400 to-emerald-500',
      includes: [
        'Technical SEO Audit & Fixes (initial month)',
        'Local SEO Setup (Google Business Profile + citations)',
        'Content Optimization (up to 5 pages/month)',
        'Monthly Reporting & Monitoring',
        '3 months minimum commitment'
      ],
      bestFor: 'Small businesses, startups, local services',
      keywords: 'up to 10',
      backlinks: 'included in content optimization',
      competitorAnalysis: 'Not included'
    },
    {
      id: 'growth',
      name: 'Growth SEO Package',
      monthlyPrice: 2200,
      description: 'For growing businesses that want stronger rankings and traffic',
      positioning: 'Scale your rankings & traffic',
      color: 'from-cyan-400 to-blue-500',
      includes: [
        'Technical SEO Audit & Fixes (initial month)',
        'Local SEO Setup & Ongoing Optimization',
        'Content Optimization (up to 10 pages/month)',
        'Link Building Campaign (3–5 quality backlinks/month)',
        'Competitor Analysis (quarterly)',
        'Monthly Reporting & Monitoring with insights',
        '3 months minimum commitment'
      ],
      bestFor: 'Growing businesses, e-commerce, service providers',
      keywords: 'up to 25',
      backlinks: '3-5 per month',
      competitorAnalysis: 'Quarterly'
    },
    {
      id: 'authority',
      name: 'Authority SEO Package',
      monthlyPrice: 3500,
      description: 'For brands aiming to dominate search results in their niche',
      positioning: 'Dominate your niche',
      color: 'from-purple-400 to-pink-500',
      includes: [
        'Advanced Technical SEO & Fixes (ongoing monitoring)',
        'Full Content Strategy & Optimization (unlimited pages/month)',
        'Link Building Campaign (8–10 quality backlinks/month)',
        'Local SEO Optimization (multi-location if applicable)',
        'Competitor Analysis (monthly)',
        'Advanced Monthly Reporting & Growth Strategy',
        '3 months minimum commitment'
      ],
      bestFor: 'Enterprise, competitive industries, established brands',
      keywords: 'unlimited',
      backlinks: '8-10 per month',
      competitorAnalysis: 'Monthly'
    }
  ];

  const customizations = [
    {
      value: 'rush-setup',
      label: 'Rush Setup (2 weeks)',
      price: 500,
      description: 'Fast-track initial setup and first month deliverables'
    },
    {
      value: 'extra-keywords',
      label: 'Additional Keywords (+10)',
      price: 200,
      description: 'Target 10 additional keywords beyond package limits'
    },
    {
      value: 'extra-backlinks',
      label: 'Additional Backlinks (+3)',
      price: 300,
      description: '3 additional quality backlinks per month'
    },
    {
      value: 'competitor-analysis-upgrade',
      label: 'Monthly Competitor Analysis',
      price: 400,
      description: 'Upgrade to monthly competitor analysis for Starter/Growth packages'
    },
    {
      value: 'white-label-reporting',
      label: 'White-Label Reporting',
      price: 150,
      description: 'Custom branded reports for your clients'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value
      }
    }));
  };

  const handleCustomizationToggle = (customizationValue) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations.includes(customizationValue)
        ? prev.customizations.filter(s => s !== customizationValue)
        : [...prev.customizations, customizationValue]
    }));
  };

  const validateUrl = (url) => {
    if (!url.trim()) {
      return { isValid: false, message: 'Website URL is required' };
    }
    
    // Remove protocol for validation
    const cleanUrl = url.replace(/^https?:\/\//, '').split('/')[0]; // Get domain only
    
    // Must contain at least one dot for domain extension
    if (!cleanUrl.includes('.')) {
      return { isValid: false, message: 'Please include a domain extension (.com, .org, .net, etc.)' };
    }
    
    // Split domain and extension
    const domainParts = cleanUrl.split('.');
    
    // Must have at least 2 parts (domain + extension)
    if (domainParts.length < 2) {
      return { isValid: false, message: 'Please enter a complete domain (e.g., example.com)' };
    }
    
    // Check domain name (before extension)
    const domainName = domainParts[0];
    if (!domainName || domainName.length === 0) {
      return { isValid: false, message: 'Domain name cannot be empty' };
    }
    
    // Domain must not contain spaces or invalid characters
    if (domainName.includes(' ') || /[^a-zA-Z0-9\-]/.test(domainName)) {
      return { isValid: false, message: 'Domain name can only contain letters, numbers, and hyphens' };
    }
    
    // Check extension (last part)
    const extension = domainParts[domainParts.length - 1];
    if (!extension || extension.length < 2 || extension.length > 6) {
      return { isValid: false, message: 'Domain extension must be 2-6 characters (e.g., .com, .org)' };
    }
    
    // Extension must be letters only
    if (!/^[a-zA-Z]+$/.test(extension)) {
      return { isValid: false, message: 'Domain extension must contain only letters (.com, .org, etc.)' };
    }
    
    // Final URL pattern validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlPattern.test(url)) {
      return { isValid: false, message: 'Please enter a valid website URL' };
    }
    
    // Add https:// if not present
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
    return { isValid: true, message: 'Valid website URL', formattedUrl };
  };

  const handleUrlChange = (url) => {
    // Filter out invalid characters in real-time
    const filteredUrl = url
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\.\-\/]/g, '') // Only allow letters, numbers, dots, hyphens, and slashes
      .replace(/\/+/g, '/') // Remove multiple consecutive slashes
      .replace(/^\/+/, ''); // Remove leading slashes
    
    setFormData(prev => ({ ...prev, websiteUrl: filteredUrl }));
    
    // Debounced validation
    setUrlValidation({ isValid: false, message: '', isValidating: true });
    
    setTimeout(() => {
      const validation = validateUrl(filteredUrl);
      setUrlValidation({
        isValid: validation.isValid,
        message: validation.message,
        isValidating: false
      });
      
      if (validation.formattedUrl) {
        setFormData(prev => ({ ...prev, websiteUrl: validation.formattedUrl }));
      }
    }, 500);
  };

  const formatUrl = (url) => {
    if (!url) return '';
    
    // Remove protocol for display
    return url.replace(/^https?:\/\//, '');
  };

  const calculateQuote = () => {
    // Get selected package
    const selectedPackage = seoPackages.find(pkg => pkg.id === formData.selectedPackage);
    if (!selectedPackage) return null;
    
    // Calculate customization costs
    const customizationCost = formData.customizations.reduce((total, customizationValue) => {
      const customization = customizations.find(c => c.value === customizationValue);
      return total + (customization?.price || 0);
    }, 0);
    
    // Calculate total monthly price
    const totalMonthlyPrice = selectedPackage.monthlyPrice + customizationCost;
    
    // Calculate annual savings (2 months free)
    const annualPrice = totalMonthlyPrice * 10; // 10 months for annual payment
    const monthlySavings = totalMonthlyPrice * 2; // 2 months free
    
    // Generate quote breakdown
    const quote = {
      selectedPackage: selectedPackage,
      customizations: formData.customizations.map(customizationValue => {
        const customization = customizations.find(c => c.value === customizationValue);
        return {
          ...customization,
          value: customizationValue
        };
      }),
      pricing: {
        monthlyPrice: totalMonthlyPrice,
        annualPrice: annualPrice,
        monthlySavings: monthlySavings,
        setupFee: customizationCost > 0 ? customizationCost : 0
      },
      deliverables: selectedPackage.includes,
      nextSteps: generateNextSteps(),
      contractTerms: {
        minimumCommitment: '3 months',
        billingCycle: 'Monthly',
        setupTime: customizationCost > 0 ? '2 weeks' : '1 week'
      }
    };
    
    return quote;
  };

  const generateNextSteps = () => [
    'Initial consultation call (30 minutes)',
    'Contract signing and onboarding',
    'Technical SEO audit and strategy development',
    'First month deliverables within 2-4 weeks'
  ];

  const handleGenerateQuote = async () => {
    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const quote = calculateQuote();
    setQuoteData(quote);
    setCurrentStep(4);
    setIsGenerating(false);
  };

  const handleProceedToQuote = () => {
    if (onGenerateQuote) {
      onGenerateQuote(quoteData, formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Tell us about your business</h3>
              <p className="text-gray-300 mb-6">This helps us tailor the perfect SEO strategy for your needs.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Business Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {businessTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('businessType', type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
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
                <label className="block text-white font-medium mb-2">Website Status</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {websiteTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('websiteType', type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
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

              <div>
                <label className="block text-white font-medium mb-2">Current Website Traffic</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trafficLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('currentTraffic', level.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.currentTraffic === level.value
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="font-medium text-white">{level.label}</div>
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
              <h3 className="text-xl font-bold text-white mb-4">SEO Requirements</h3>
              <p className="text-gray-300 mb-6">Help us understand your SEO goals and competition.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Website URL
                  {urlValidation.message && !urlValidation.isValid && !urlValidation.isValidating && (
                    <span className="text-red-400 text-sm ml-2">*</span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formatUrl(formData.websiteUrl)}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="example.com"
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                      urlValidation.isValid 
                        ? 'border-green-400 bg-green-400/5' 
                        : urlValidation.message && !urlValidation.isValidating
                        ? 'border-red-400 bg-red-400/5'
                        : 'border-gray-600 focus:border-cyan-400'
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {urlValidation.isValidating ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                    ) : urlValidation.isValid ? (
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : urlValidation.message && !urlValidation.isValidating ? (
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                {urlValidation.message && (
                  <p className={`text-sm mt-2 flex items-center space-x-1 ${
                    urlValidation.isValid ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {urlValidation.isValid ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                    <span>{urlValidation.message}</span>
                  </p>
                )}
                {!urlValidation.message && !urlValidation.isValidating && (
                  <p className="text-xs text-gray-500 mt-2">
                    Enter your domain with extension (e.g., your-website.com, company.org, business.net)
                  </p>
                )}
                {simulatorData?.websiteUrl && (
                  <p className="text-sm text-cyan-400 mt-2 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>From simulator: {simulatorData.websiteUrl}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Target Keywords</label>
                <textarea
                  value={formData.targetKeywords}
                  onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                  placeholder="Enter your target keywords (comma-separated)"
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  rows="3"
                />
                {simulatorData?.keywords && (
                  <p className="text-sm text-cyan-400 mt-2 flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>From simulator: {simulatorData.keywords}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Competition Level</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {competitionLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleInputChange('competitionLevel', level.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.competitionLevel === level.value
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
                <label className="block text-white font-medium mb-2">Current SEO Status</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleInputChange('currentTraffic', 'low')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.currentTraffic === 'low'
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-white">Just Starting</div>
                    <div className="text-sm text-gray-400">New to SEO</div>
                  </button>
                  <button
                    onClick={() => handleInputChange('currentTraffic', 'medium')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.currentTraffic === 'medium'
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-white">Some SEO Done</div>
                    <div className="text-sm text-gray-400">Basic optimization</div>
                  </button>
                  <button
                    onClick={() => handleInputChange('currentTraffic', 'high')}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.currentTraffic === 'high'
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="font-medium text-white">Advanced SEO</div>
                    <div className="text-sm text-gray-400">Looking to scale</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Choose Your SEO Package</h3>
              <p className="text-gray-300 mb-6">Select the package that best fits your business needs and goals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seoPackages.map(pkg => (
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
                    <div className="text-2xl font-bold text-cyan-400">${pkg.monthlyPrice.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">per month</div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Keywords:</span>
                      <span className="text-white ml-2">{pkg.keywords}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Backlinks:</span>
                      <span className="text-white ml-2">{pkg.backlinks}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Competitor Analysis:</span>
                      <span className="text-white ml-2">{pkg.competitorAnalysis}</span>
                    </div>
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

            {/* Customizations */}
            {formData.selectedPackage && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Optional Customizations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customizations.map(customization => (
                    <div
                      key={customization.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.customizations.includes(customization.value)
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      onClick={() => handleCustomizationToggle(customization.value)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-white mb-1">{customization.label}</h5>
                          <p className="text-sm text-gray-300 mb-2">{customization.description}</p>
                          <div className="text-cyan-400 font-semibold">+${customization.price}/month</div>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 ml-3 flex items-center justify-center ${
                          formData.customizations.includes(customization.value)
                            ? 'border-cyan-400 bg-cyan-400'
                            : 'border-gray-500'
                        }`}>
                          {formData.customizations.includes(customization.value) && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <p className="text-gray-300 mb-6">We'll use this to send you the detailed quote and schedule a consultation.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.contactInfo.name}
                  onChange={(e) => handleContactChange('name', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Company Name</label>
                <input
                  type="text"
                  value={formData.contactInfo.company}
                  onChange={(e) => handleContactChange('company', e.target.value)}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Your SEO Quote is Ready!</h3>
              <p className="text-gray-300">Here's your personalized SEO optimization package.</p>
            </div>

            {quoteData && (
              <div className="bg-white/5 rounded-lg p-6">
                {/* Package Header */}
                <div className="text-center mb-6">
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r ${quoteData.selectedPackage.color} mb-4`}>
                    {quoteData.selectedPackage.positioning}
                  </div>
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    ${quoteData.pricing.monthlyPrice.toLocaleString()}
                  </div>
                  <div className="text-gray-300 mb-2">per month</div>
                  <div className="text-sm text-gray-400">
                    Minimum 3-month commitment • Cancel anytime after
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">{quoteData.selectedPackage.name}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Base Package</span>
                        <span className="text-white">${quoteData.selectedPackage.monthlyPrice.toLocaleString()}</span>
                      </div>
                      {quoteData.customizations.map(customization => (
                        <div key={customization.value} className="flex justify-between">
                          <span className="text-gray-300">{customization.label}</span>
                          <span className="text-white">+${customization.price}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-600 pt-2 flex justify-between">
                        <span className="text-white font-semibold">Monthly Total</span>
                        <span className="text-white font-semibold">${quoteData.pricing.monthlyPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white mb-3">Annual Savings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Monthly Price × 12</span>
                        <span className="text-white">${(quoteData.pricing.monthlyPrice * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Annual Price (10 months)</span>
                        <span className="text-white">${quoteData.pricing.annualPrice.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 flex justify-between">
                        <span className="text-green-400 font-semibold">You Save</span>
                        <span className="text-green-400 font-semibold">${quoteData.pricing.monthlySavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">Project Details</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Website URL:</span>
                      <span className="text-white ml-2 font-mono">{formData.websiteUrl}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Business Type:</span>
                      <span className="text-white ml-2">{businessTypes.find(bt => bt.value === formData.businessType)?.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Competition Level:</span>
                      <span className="text-white ml-2">{competitionLevels.find(cl => cl.value === formData.competitionLevel)?.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Keywords:</span>
                      <span className="text-white ml-2">{formData.targetKeywords.split(',').length} keywords</span>
                    </div>
                  </div>
                </div>

                {/* Contract Terms */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">Contract Terms</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Minimum Commitment:</span>
                      <span className="text-white ml-2">{quoteData.contractTerms.minimumCommitment}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Billing Cycle:</span>
                      <span className="text-white ml-2">{quoteData.contractTerms.billingCycle}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Setup Time:</span>
                      <span className="text-white ml-2">{quoteData.contractTerms.setupTime}</span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-bold text-white mb-3">What's Included</h4>
                  <ul className="space-y-2">
                    {quoteData.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-lg font-bold text-white mb-3">Next Steps</h4>
                  <ul className="space-y-2">
                    {quoteData.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold text-sm mt-1">{index + 1}.</span>
                        <span className="text-gray-300">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
        return formData.businessType && formData.websiteType && formData.currentTraffic;
      case 1:
        return formData.websiteUrl && urlValidation.isValid && formData.targetKeywords && formData.competitionLevel;
      case 2:
        return formData.selectedPackage; // Package selection is required
      case 3:
        return formData.contactInfo.name && formData.contactInfo.email;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 3) {
      handleGenerateQuote();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="lab-stage">
      <div className="lab-quote">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border-b border-cyan-400/30 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">SEO Quote Generator</h2>
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
          {/* URL Validation Message for Step 1 */}
          {currentStep === 1 && urlValidation.message && !urlValidation.isValid && !urlValidation.isValidating && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400 text-sm font-medium">Please fix the URL above to continue</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700/80 hover:bg-gray-600/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-300"
            >
              Previous
            </button>
            
            <div className="flex space-x-4">
              {currentStep === 4 ? (
                <button
                  onClick={handleProceedToQuote}
                  className="px-8 py-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Get This Quote
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid() || isGenerating}
                  className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 ${
                    !isStepValid() || isGenerating
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                      : currentStep === 1 && !urlValidation.isValid
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:shadow-lg'
                  }`}
                >
                  {isGenerating ? 'Generating...' : 
                   currentStep === 1 && !urlValidation.isValid ? 'Invalid URL' :
                   currentStep === 3 ? 'Generate Quote' : 'Next'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOQuoteGenerator;
