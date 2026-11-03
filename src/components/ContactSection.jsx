import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useTheme } from 'next-themes';

const ContactSection = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = (resolvedTheme ?? 'light') === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const primaryTextClass = isDarkMode ? 'text-white' : 'text-[#3c281c]';
  const secondaryTextClass = isDarkMode ? 'text-gray-300' : 'text-[#5f4735]';
  const accentTextClass = isDarkMode ? 'text-cyan-400' : 'text-[#b88760]';
  const cardSurfaceClass = isDarkMode
    ? 'card p-6 md:p-8'
    : 'rounded-3xl border border-[#e4ccb0] bg-[#fffbf5]/95 shadow-[0_18px_40px_rgba(90,58,40,0.14)] p-6 md:p-8';
  const inputSurfaceClass = isDarkMode
    ? 'bg-gray-800/50 border border-gray-600 focus:border-cyan-400 text-white placeholder-gray-400'
    : 'bg-white border border-[#dcc3a7] focus:border-[#b88760] text-[#3c281c] placeholder-[#a18876]';
  const iconVariants = isDarkMode
    ? {
        email: 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white',
        phone: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        location: 'bg-gradient-to-r from-green-400 to-cyan-400 text-white',
      }
    : {
        email: 'bg-[#e0edff] border border-[#cddff1] text-[#2f3d4a]',
        phone: 'bg-[#f7e3f3] border border-[#e7c7df] text-[#4b2f3e]',
        location: 'bg-[#e4f6ea] border border-[#cde4d4] text-[#2f4034]',
      };
  const socialCardClass = isDarkMode
    ? 'flex items-center space-x-3 p-3 md:p-4 rounded-lg border border-gray-600 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-400/10'
    : 'flex items-center space-x-3 p-3 md:p-4 rounded-lg border border-[#e4ccb0] bg-white hover:bg-[#f6eadb] transition-all duration-300 shadow-[0_10px_24px_rgba(90,58,40,0.1)]';
  const isSubmittingDisabledClass = isSubmitting ? 'opacity-50 cursor-not-allowed' : '';

  const resumeButtonClass = isDarkMode
    ? 'btn btn-primary inline-flex items-center space-x-2'
    : 'inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#b88760] text-white font-semibold shadow-[0_18px_40px_rgba(90,58,40,0.18)] hover:bg-[#a46f4d] transition-all';
  const submitButtonBaseClass = isDarkMode
    ? 'btn btn-primary inline-flex items-center space-x-2 px-6 py-3 text-sm md:text-base'
    : 'inline-flex items-center space-x-2 px-6 py-3 text-sm md:text-base rounded-full bg-[#b88760] text-white font-semibold shadow-[0_18px_40px_rgba(90,58,40,0.18)] hover:bg-[#a46f4d] transition-all';

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/melvin-jr-elayron/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: 'hover:text-blue-400'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/bonch223',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      color: 'hover:text-gray-300'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/bonch223/',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'hover:text-blue-500'
    },
    {
      name: 'Email',
      url: 'mailto:mjr.elayron@gmail.com',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: 'hover:text-cyan-400'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    // Initialize EmailJS with your public key
    emailjs.init('tBuSbZ57Q0Hn6k-dJ');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear status when user starts typing
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;
    
    if (!name.trim()) {
      setErrorMessage('Please enter your name.');
      return false;
    }
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    
    if (!subject.trim()) {
      setErrorMessage('Please enter a subject.');
      return false;
    }
    
    if (!message.trim()) {
      setErrorMessage('Please enter your message.');
      return false;
    }
    
    if (message.trim().length < 10) {
      setErrorMessage('Please enter a more detailed message (at least 10 characters).');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    
    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // EmailJS template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'MJR Elayron',
        reply_to: formData.email,
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        'service_2wtte0j', // Your EmailJS service ID
        'template_5arjl6k', // Your EmailJS template ID
        templateParams,
        'tBuSbZ57Q0Hn6k-dJ' // Your EmailJS public key
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to send message. Please try again or contact me directly at mjr.elayron@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section relative z-10">
      <div className={`absolute inset-0 ${isDarkMode ? '' : 'bg-[#fff7ec]'}`} aria-hidden="true"></div>
      <div className="section-content relative">

        <div className="text-center mb-16 relative">
          <h2 className="heading-secondary mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${secondaryTextClass}`}>
            Ready to bring your ideas to life? Let's collaborate and create something amazing together. 
            I'm always excited to work on new projects and meet fellow creators.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          {/* Left Side - Contact Info */}
          <div className={`space-y-6 md:space-y-8 ${isVisible ? 'animate-slide-left' : 'opacity-0'}`}>
            <div className={cardSurfaceClass}>
              <h3 className="heading-tertiary mb-4 md:mb-6 text-gradient">Let's Connect</h3>
              <p className={`${secondaryTextClass} leading-relaxed mb-6 md:mb-8 text-sm md:text-base`}>
                Whether you have a project in mind, want to collaborate, or just want to say hello, 
                I'd love to hear from you. Feel free to reach out through any of the channels below.
              </p>

              {/* Contact Methods */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconVariants.email}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${primaryTextClass} font-semibold text-sm md:text-base`}>Email</p>
                    <p className={`${secondaryTextClass} text-xs md:text-sm break-all`}>mjr.elayron@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconVariants.phone}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${primaryTextClass} font-semibold text-sm md:text-base`}>Phone</p>
                    <p className={`${secondaryTextClass} text-xs md:text-sm`}>+63 994 5063 085</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconVariants.location}`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${primaryTextClass} font-semibold text-sm md:text-base`}>Location</p>
                    <p className={`${secondaryTextClass} text-xs md:text-sm`}>Tagum City, DDN, Philippines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
          <div className={cardSurfaceClass}>
              <h3 className="heading-tertiary mb-6 text-gradient">Follow Me</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${socialCardClass} ${social.color}`}
                  >
                    <span className={`${isDarkMode ? 'text-white' : 'text-[#503828]'}`}>{social.icon}</span>
                    <span className={`${primaryTextClass} font-medium text-sm md:text-base`}>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Resume Download */}
          <div className={`${cardSurfaceClass} text-center`}>
              <h3 className="heading-tertiary mb-4 text-gradient">Download Resume</h3>
              <p className={`${secondaryTextClass} mb-6 text-sm md:text-base`}>
                Want to know more about my experience and skills? 
                Download my resume for a detailed overview.
              </p>
              <div className="flex justify-center">
                <a 
                  href="/resume/MJR-Elayron-Resume.pdf" 
                  download
                className={resumeButtonClass}
                >
                  <span>Download PDF</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className={`${isVisible ? 'animate-slide-right' : 'opacity-0'}`}>
            <div className={cardSurfaceClass}>
              <h3 className="heading-tertiary mb-6 text-gradient">Send Message</h3>
              
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-green-500/20 border border-green-500/30' : 'bg-[#e6f6ea] border border-[#cde4d4]'}`}>
                    <div className="flex items-center space-x-3">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className={`${isDarkMode ? 'text-green-400' : 'text-[#2f4034]'} font-semibold`}>Message Sent Successfully!</h4>
                        <p className={`${secondaryTextClass} text-sm`}>Thank you for reaching out! Your message has been sent to mjr.elayron@gmail.com. I'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className={`rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-red-500/20 border border-red-500/30' : 'bg-[#fde4ec] border border-[#f1c5d6]'}`}>
                    <div className="flex items-center space-x-3">
                      <svg className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-[#a53a4f]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className={`${isDarkMode ? 'text-red-400' : 'text-[#a53a4f]'} font-semibold`}>Failed to Send Message</h4>
                        <p className={`${secondaryTextClass} text-sm`}>{errorMessage}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className={`block font-medium mb-2 text-sm md:text-base ${primaryTextClass}`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${inputSurfaceClass}`}
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block font-medium mb-2 text-sm md:text-base ${primaryTextClass}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${inputSurfaceClass}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={`block font-medium mb-2 text-sm md:text-base ${primaryTextClass}`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${inputSurfaceClass}`}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={`block font-medium mb-2 text-sm md:text-base ${primaryTextClass}`}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full px-3 md:px-4 py-2 md:py-3 rounded-lg focus:outline-none transition-colors resize-none text-sm md:text-base ${inputSurfaceClass}`}
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${submitButtonBaseClass} ${isSubmittingDisabledClass}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400">
            © 2024 MJR Elayron. Built with React and lots of ☕
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
