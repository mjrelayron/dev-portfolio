import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics/react';

const SEOSimulator = ({ onBack, onProceedToQuote, onShowProcessPage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [keywordResults, setKeywordResults] = useState([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [urlValidation, setUrlValidation] = useState({ isValid: false, message: '', isValidating: false });

  useEffect(() => {
    setIsVisible(true);
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, []);

  const steps = [
    'Website Analysis',
    'Keyword Research',
    'Meta Optimization',
    'Results & Recommendations'
  ];

  // URL validation functions
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
    
    setWebsiteUrl(filteredUrl);
    
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
        setWebsiteUrl(validation.formattedUrl);
      }
    }, 500);
  };

  const formatUrl = (url) => {
    if (!url) return '';
    
    // Remove protocol for display
    return url.replace(/^https?:\/\//, '');
  };

  // Simulate website analysis
  const analyzeWebsite = async () => {
    setIsAnalyzing(true);
    
    // Track step completion
    track('simulator_step_completed', { 
      simulator: 'seo', 
      step: 'website_analysis',
      step_number: 1,
      website_url: websiteUrl
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic analysis results
    const results = {
      performance: Math.floor(Math.random() * 40) + 30, // 30-70
      accessibility: Math.floor(Math.random() * 40) + 40, // 40-80
      bestPractices: Math.floor(Math.random() * 30) + 50, // 50-80
      seo: Math.floor(Math.random() * 35) + 35, // 35-70
      issues: [
        'Missing meta descriptions',
        'Images without alt text',
        'Slow loading times',
        'No structured data',
        'Missing sitemap'
      ],
      recommendations: [
        'Optimize images for faster loading',
        'Add meta descriptions to all pages',
        'Implement structured data markup',
        'Create XML sitemap',
        'Improve internal linking structure'
      ]
    };
    
    setAnalysisResults(results);
    setIsAnalyzing(false);
    setCurrentStep(1);
  };

  // Simulate keyword research
  const researchKeywords = async () => {
    if (!keywords.trim()) return;
    
    // Track step completion
    track('simulator_step_completed', { 
      simulator: 'seo', 
      step: 'keyword_research',
      step_number: 2,
      keywords_count: keywords.split(',').length
    });
    
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
    const results = keywordList.map(keyword => ({
      keyword,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100),
      cpc: (Math.random() * 5 + 0.5).toFixed(2),
      trends: Math.random() > 0.5 ? 'rising' : 'stable'
    }));
    
    setKeywordResults(results);
    setCurrentStep(2);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/50';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/50';
    return 'bg-red-500/20 border-red-500/50';
  };

  const handleProceedToQuote = () => {
    // Track simulator completion
    track('simulator_completed', { 
      simulator: 'seo',
      completion_rate: 100,
      steps_completed: 4
    });
    
    const serviceData = {
      service: 'SEO Optimization',
      url: websiteUrl,
      keywords: keywords,
      metaTitle: metaTitle,
      metaDescription: metaDescription,
      analysis: analysisResults,
      keywordResults: keywordResults,
      // Pass comprehensive simulator data for quote generation
      simulatorData: {
        websiteUrl: websiteUrl,
        keywords: keywords,
        analysisResults: analysisResults,
        keywordResults: keywordResults,
        metaOptimization: {
          title: metaTitle,
          description: metaDescription
        }
      }
    };
    onProceedToQuote(serviceData);
  };

  return (
    <div className={`lab-stage transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="lab-stage__inner">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="lab-key inline-flex items-center px-3 py-2 text-sm font-semibold"
          >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Services
            </button>
            
            <div className="flex items-center text-blue-400 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simplified Demo
            </div>
          </div>
          
          <div className="lab-steps flex items-center justify-center space-x-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index <= currentStep 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-600 mx-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 0 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                  🔍
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Website SEO Analysis
                </h2>
                <p className="text-gray-300 text-lg">
                  Enter your website URL and we'll analyze its SEO performance, 
                  identify issues, and provide actionable recommendations.
                </p>
              </div>

              <div className="space-y-6">
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
                      value={formatUrl(websiteUrl)}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="example.com"
                      className={`w-full pl-10 pr-12 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
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
                      Enter your domain with extension (e.g., example.com, company.org, business.net)
                    </p>
                  )}
                </div>

                <button
                  onClick={analyzeWebsite}
                  disabled={!websiteUrl || !urlValidation.isValid || isAnalyzing}
                  className={`w-full font-bold py-4 px-8 rounded-lg transition-all duration-300 ${
                    !websiteUrl || !urlValidation.isValid || isAnalyzing
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                      : urlValidation.isValid
                      ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-white hover:shadow-lg'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Analyzing Website...
                    </div>
                  ) : !urlValidation.isValid && websiteUrl ? (
                    'Invalid URL'
                  ) : (
                    'Analyze Website'
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && analysisResults && (
            <div className="space-y-6">
              <div className="glass-content-pane">
                <h3 className="text-2xl font-bold text-white mb-6">Performance Analysis</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className={`p-4 rounded-lg border ${getScoreBg(analysisResults.performance)}`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResults.performance)}`}>
                        {analysisResults.performance}
                      </div>
                      <div className="text-gray-300 text-sm">Performance</div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getScoreBg(analysisResults.accessibility)}`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResults.accessibility)}`}>
                        {analysisResults.accessibility}
                      </div>
                      <div className="text-gray-300 text-sm">Accessibility</div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getScoreBg(analysisResults.bestPractices)}`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResults.bestPractices)}`}>
                        {analysisResults.bestPractices}
                      </div>
                      <div className="text-gray-300 text-sm">Best Practices</div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getScoreBg(analysisResults.seo)}`}>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getScoreColor(analysisResults.seo)}`}>
                        {analysisResults.seo}
                      </div>
                      <div className="text-gray-300 text-sm">SEO</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-red-400 mb-3">Issues Found</h4>
                    <ul className="space-y-2">
                      {analysisResults.issues.map((issue, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-green-400 mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="glass-content-pane">
                <h3 className="text-2xl font-bold text-white mb-6">Keyword Research</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Enter keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="web design, digital marketing, seo services"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={researchKeywords}
                    disabled={!keywords.trim()}
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Research Keywords
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && keywordResults.length > 0 && (
            <div className="glass-content-pane">
              <h3 className="text-2xl font-bold text-white mb-6">Keyword Research Results</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-600">
                      <th className="text-left text-white py-3">Keyword</th>
                      <th className="text-left text-white py-3">Search Volume</th>
                      <th className="text-left text-white py-3">Difficulty</th>
                      <th className="text-left text-white py-3">CPC</th>
                      <th className="text-left text-white py-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywordResults.map((result, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="text-white py-3 font-medium">{result.keyword}</td>
                        <td className="text-gray-300 py-3">{result.searchVolume.toLocaleString()}</td>
                        <td className="py-3">
                          <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                            result.difficulty >= 70 ? 'bg-red-500/20 text-red-400' :
                            result.difficulty >= 40 ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {result.difficulty}%
                          </div>
                        </td>
                        <td className="text-gray-300 py-3">${result.cpc}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                            result.trends === 'rising' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {result.trends === 'rising' ? '📈 Rising' : '📊 Stable'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-bold text-white mb-4">Meta Tag Optimization</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="Best Web Design Services | Your Company"
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                      maxLength={60}
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {metaTitle.length}/60 characters
                    </div>
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Meta Description</label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Professional web design services that boost your online presence. Get a custom website that converts visitors into customers."
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none resize-none"
                      rows={3}
                      maxLength={160}
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      {metaDescription.length}/160 characters
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  // Track step completion
                  track('simulator_step_completed', { 
                    simulator: 'seo', 
                    step: 'meta_optimization',
                    step_number: 3
                  });
                  setCurrentStep(3);
                }}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all duration-300 mt-8"
              >
                Generate Final Report
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">
                  📊
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  SEO Analysis Complete!
                </h2>
                <p className="text-gray-300 text-lg">
                  Here's what I found and what I can do to improve your website's SEO performance.
                </p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Current Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{analysisResults.seo}</div>
                      <div className="text-gray-300 text-sm">SEO Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{analysisResults.performance}</div>
                      <div className="text-gray-300 text-sm">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{keywordResults.length}</div>
                      <div className="text-gray-300 text-sm">Keywords Researched</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{analysisResults.recommendations.length}</div>
                      <div className="text-gray-300 text-sm">Improvements Ready</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4">What I Can Do For You</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">Technical SEO</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Fix all identified technical issues</li>
                        <li>• Optimize page loading speeds</li>
                        <li>• Implement structured data markup</li>
                        <li>• Create and submit XML sitemaps</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">Content Optimization</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Optimize meta titles and descriptions</li>
                        <li>• Improve internal linking structure</li>
                        <li>• Add alt text to all images</li>
                        <li>• Create keyword-optimized content</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Main Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleProceedToQuote}
                    className="flex-1 bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Get Your SEO Quote
                  </button>
                  
                  <button
                    onClick={() => onShowProcessPage('seo')}
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    See Complete Process Details
                  </button>
                </div>
                
                {/* Secondary Action */}
                <div className="text-center">
                  <button
                    onClick={onBack}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium no-focus-outline"
                  >
                    Try Another Service
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOSimulator;
