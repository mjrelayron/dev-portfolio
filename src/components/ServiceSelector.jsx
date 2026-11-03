import React, { useState, useEffect } from 'react';

const ServiceSelector = ({ onSelectService, onClose, onShowProcessPage }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    // Reset any existing scroll issues and lock body scroll
    document.body.style.overflow = 'hidden';
    // Force a reflow to ensure styles are applied
    document.body.offsetHeight;

    return () => {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Additional effect to handle reopening after returning from process page
  useEffect(() => {
    if (isVisible) {
      // Reset scroll position and lock body scroll
      document.body.style.overflow = 'hidden';
      // Reset any scroll position in the modal
      const modalContainer = document.querySelector('.service-selector-modal');
      if (modalContainer) {
        modalContainer.scrollTop = 0;
      }
    }
  }, [isVisible]);

  const services = [
    {
      id: 'seo',
      title: 'SEO Optimization',
      subtitle: 'Boost Your Search Rankings',
      description: 'Analyze your website, research keywords, and optimize for search engines.',
      icon: '🔍',
      color: '#10B981',
      gradient: 'from-green-400 to-emerald-600',
      features: ['Website Analysis', 'Keyword Research', 'Meta Optimization', 'Performance Audit'],
      simulator: 'SEO Simulator',
      available: true
    },
    {
      id: 'wordpress',
      title: 'WordPress Development',
      subtitle: 'Build Beautiful Websites',
      description: 'Create responsive, custom WordPress sites with drag-and-drop ease.',
      icon: '🌐',
      color: '#3B82F6',
      gradient: 'from-blue-400 to-blue-600',
      features: ['Custom Themes', 'Plugin Development', 'E-commerce Setup', 'Performance Optimization'],
      simulator: 'WordPress Builder',
      available: true
    },
    {
      id: 'fullstack',
      title: 'Full Stack Development',
      subtitle: 'Complete Web Solutions',
      description: 'Design databases, build APIs, and create full-featured web applications.',
      icon: '💻',
      color: '#8B5CF6',
      gradient: 'from-purple-400 to-purple-600',
      features: ['Database Design', 'API Development', 'Frontend & Backend', 'Deployment'],
      simulator: 'Full Stack Designer',
      available: true
    },
    {
      id: 'uiux',
      title: 'UI/UX Design',
      subtitle: 'Create Amazing Experiences',
      description: 'Design intuitive interfaces and user experiences that convert.',
      icon: '🎨',
      color: '#F59E0B',
      gradient: 'from-yellow-400 to-orange-500',
      features: ['Wireframing', 'Prototyping', 'User Research', 'Design Systems'],
      simulator: 'Design Studio',
      available: false,
      status: 'Under Development'
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      subtitle: 'Grow Your Business',
      description: 'Create campaigns, analyze performance, and drive conversions.',
      icon: '📈',
      color: '#EF4444',
      gradient: 'from-red-400 to-pink-500',
      features: ['Campaign Creation', 'Analytics Setup', 'Content Strategy', 'Conversion Optimization'],
      simulator: 'Marketing Lab',
      available: false,
      status: 'Coming Soon'
    },
    {
      id: 'ai-automation',
      title: 'AI & Automation',
      subtitle: 'Intelligent Solutions',
      description: 'Deploy custom AI agents, chatbots, and automated workflows.',
      icon: '🤖',
      color: '#8B5CF6',
      gradient: 'from-violet-500 to-fuchsia-500',
      features: ['Custom Chatbots', 'Workflow Automation', 'Data Scraping', 'RAG Systems'],
      simulator: 'AI Architect',
      available: true
    },
    {
      id: 'tech-consult',
      title: 'Tech Consultation',
      subtitle: 'Strategic Guidance',
      description: 'Get expert advice on technology choices and business strategy.',
      icon: '💡',
      color: '#06B6D4',
      gradient: 'from-cyan-400 to-teal-500',
      features: ['Tech Audits', 'Strategy Planning', 'Architecture Review', 'Best Practices'],
      simulator: 'Consultation Hub',
      available: false,
      status: 'Coming Soon'
    }
  ];

  const handleServiceSelect = (service) => {
    if (!service.available) return; // Don't allow selection of unavailable services

    setSelectedService(service);
    // Add a small delay for smooth transition
    setTimeout(() => {
      onSelectService(service);
    }, 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    // Restore body scroll immediately
    document.body.style.overflow = 'unset';
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const availableServices = services.filter((service) => service.available);
  const onRequestServices = services.filter((service) => !service.available);
  // ProcessPage has no AI & Automation timeline, so that card links to its simulator only
  const hasProcess = (id) => id !== 'ai-automation';

  return (
    <div className={`lab-stage transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="service-selector-modal lab-stage__inner">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <p className="mono-label text-cyan-400">Step 1 · Choose a service</p>
            <h2 className="mt-1 text-2xl md:text-3xl font-bold text-white">
              Which simulator do you want to run?
            </h2>
            <p className="mt-2 text-gray-300">
              Each simulator is a simplified, hands-on version of how I run that kind of project.
              Finish one and it hands you a matching quote.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="lab-key inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            Close
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableServices.map((service) => (
            <div
              key={service.id}
              className={`lab-service group cursor-pointer ${selectedService?.id === service.id ? 'is-selected' : ''}`}
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex items-start gap-4">
                <div className="lab-service__icon" style={{ background: `${service.color}2e`, borderColor: `${service.color}66` }} aria-hidden="true">
                  {service.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-white">{service.title}</h3>
                  <p className="text-cyan-400 text-sm font-medium">{service.subtitle}</p>
                </div>
              </div>

              <p className="mt-3 text-gray-300 text-[0.95rem] leading-relaxed">{service.description}</p>

              <ul className="mt-3 flex flex-wrap gap-2" aria-label={`${service.title} covers`}>
                {service.features.map((feature, idx) => (
                  <li key={idx} className="chip">{feature}</li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 relative z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceSelect(service);
                  }}
                  className="bg-gradient-to-r inline-flex items-center gap-2 px-5 py-2.5 text-[0.95rem]"
                >
                  <span>Try {service.simulator}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                {hasProcess(service.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowProcessPage(service.id);
                    }}
                    className="text-cyan-400 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    View complete process
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Services without a simulator: process details only */}
        {onRequestServices.length > 0 && (
          <div className="mt-8">
            <h3 className="mono-label text-gray-400">No simulator for these — scoped on a call</h3>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {onRequestServices.map((service) => (
                <div key={service.id} className="lab-service lab-service--compact">
                  <div className="flex items-center gap-3">
                    <span className="lab-service__icon lab-service__icon--sm" style={{ background: `${service.color}2e`, borderColor: `${service.color}66` }} aria-hidden="true">
                      {service.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white leading-tight">{service.title}</h4>
                      <p className="text-sm text-gray-400">{service.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onShowProcessPage(service.id)}
                    className="mt-3 text-cyan-400 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    See how I'd run it
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 max-w-3xl text-sm text-gray-400">
          These simulators are simplified versions of the real process — enough to give you real insight
          and a ballpark number before we work together.
        </p>
      </div>
    </div>
  );
};

export default ServiceSelector;
