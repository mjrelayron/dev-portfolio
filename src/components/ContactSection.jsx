import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, LoaderCircle } from 'lucide-react';
import { profile } from '../data/profile';
import { useAchievements } from '../store/useAchievements';
import { toast } from '../hud/Toasts';
import '../lab/lab.css';

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/**
 * The EmailJS contact form + direct lines. `prefill` (subject/message) comes
 * from a finished quote in the ServiceFlow.
 *
 * @param {{ prefill?: { subject: string; message: string } | null }} props
 */
const ContactSection = ({ prefill = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [errorField, setErrorField] = useState(null); // which field failed validation
  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    subject: useRef(null),
    message: useRef(null),
  };

  const directLinks = [
    { name: 'Email', value: profile.email, url: `mailto:${profile.email}`, icon: <Mail size={18} aria-hidden="true" /> },
    { name: 'Phone', value: profile.phone, url: `tel:${profile.phone.replace(/\s+/g, '')}`, icon: <Phone size={18} aria-hidden="true" /> },
    { name: 'LinkedIn', value: 'melvin-jr-elayron', url: profile.links.linkedin, icon: <LinkedInIcon />, external: true },
    { name: 'GitHub', value: 'bonch223', url: profile.links.github, icon: <GitHubIcon />, external: true },
    { name: 'Facebook', value: 'bonch223', url: profile.links.facebook, icon: <FacebookIcon />, external: true },
  ];

  useEffect(() => {
    // Initialize EmailJS with your public key
    emailjs.init('tBuSbZ57Q0Hn6k-dJ');
  }, []);

  useEffect(() => {
    if (!prefill) return;
    setFormData(prev => ({ ...prev, subject: prefill.subject || prev.subject, message: prefill.message || prev.message }));
  }, [prefill]);

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
    if (errorField === name) {
      setErrorField(null);
      setErrorMessage('');
    }
  };

  const fail = (field, message) => {
    setErrorField(field);
    setErrorMessage(message);
    return false;
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;

    if (!name.trim()) return fail('name', 'Please enter your name.');

    if (!email.trim()) return fail('email', 'Please enter your email address.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return fail('email', 'Please enter a valid email address.');

    if (!subject.trim()) return fail('subject', 'Please enter a subject.');

    if (!message.trim()) return fail('message', 'Please enter your message.');

    if (message.trim().length < 10) return fail('message', 'Please enter a more detailed message (at least 10 characters).');

    setErrorField(null);
    return true;
  };

  // move focus to the first invalid field
  useEffect(() => {
    if (errorField) fieldRefs[errorField].current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorField]);

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
        useAchievements.getState().unlock('first-contact');
        toast({ kind: 'success', title: 'Message sent', body: "Thanks for reaching out — I'll reply within 24 hours." });
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

  const fieldProps = (name) => ({
    id: `contact-${name}`,
    name,
    ref: fieldRefs[name],
    value: formData[name],
    onChange: handleInputChange,
    required: true,
    'aria-invalid': errorField === name ? 'true' : undefined,
    'aria-describedby': errorField === name ? `contact-${name}-error` : undefined,
    className: 'contact-field',
  });

  const fieldError = (name) =>
    errorField === name ? (
      <p id={`contact-${name}-error`} className="mt-1.5 flex items-center gap-1.5 text-[0.85rem] font-medium text-[var(--danger)]">
        <AlertCircle size={14} aria-hidden="true" /> {errorMessage}
      </p>
    ) : null;

  return (
    <section id="contact" aria-labelledby="contact-form-title" className="grid scroll-mt-[calc(var(--hud-top)+12px)] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:scroll-mt-4">
      {/* Direct lines */}
      <div className="portal-door order-2 gap-0 lg:order-1">
        <p className="mono-label text-ink-3">Direct lines</p>
        <h2 className="mt-1 font-display text-[1.3rem] font-bold text-ink">Skip the form</h2>
        <p className="mt-1 text-[0.92rem] text-ink-2">Prefer your own inbox or a DM? These all reach me.</p>
        <ul className="mt-4 space-y-2">
          {directLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                className="contact-link"
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact-link__icon">{link.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[0.78rem] font-mono uppercase tracking-[0.12em] text-ink-3">{link.name}</span>
                  <span className="block truncate font-semibold">{link.value}</span>
                </span>
                {link.external && <span className="sr-only">(opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2 text-[0.88rem] text-ink-3">
          <MapPin size={15} aria-hidden="true" /> Tagum City, DDN, Philippines · replies within 24h
        </p>
      </div>

      {/* Contact Form */}
      <div className="portal-door order-1 gap-0 sm:p-6 lg:order-2">
        <p className="mono-label text-ink-3">Transmission</p>
        <h2 id="contact-form-title" className="mt-1 font-display text-[1.3rem] font-bold text-ink">Send a message</h2>

        <form id="contact-form" onSubmit={handleSubmit} noValidate className="mt-4 space-y-4" aria-busy={isSubmitting}>
          {/* Status Messages */}
          <div aria-live="polite">
            {submitStatus === 'success' && (
              <div className="contact-status contact-status--success" role="status">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-mint" aria-hidden="true" />
                <div>
                  <h3 className="font-display font-bold text-mint">Message sent successfully!</h3>
                  <p className="text-[0.9rem] text-ink-2">Thank you for reaching out! Your message has been sent to {profile.email}. I'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}
          </div>
          {submitStatus === 'error' && (
            <div className="contact-status contact-status--error" role="alert">
              <AlertCircle size={22} className="mt-0.5 shrink-0 text-[var(--danger)]" aria-hidden="true" />
              <div>
                <h3 className="font-display font-bold text-[var(--danger)]">Failed to send message</h3>
                <p className="text-[0.9rem] text-ink-2">{errorMessage}</p>
              </div>
            </div>
          )}
          {errorField && (
            <p className="sr-only" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-[0.9rem] font-semibold text-ink">
                Name <span aria-hidden="true" className="text-ink-3">*</span>
              </label>
              <input type="text" autoComplete="name" placeholder="Your name" {...fieldProps('name')} />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-[0.9rem] font-semibold text-ink">
                Email <span aria-hidden="true" className="text-ink-3">*</span>
              </label>
              <input type="email" autoComplete="email" inputMode="email" placeholder="your.email@example.com" {...fieldProps('email')} />
              {fieldError('email')}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="mb-1.5 block text-[0.9rem] font-semibold text-ink">
              Subject <span aria-hidden="true" className="text-ink-3">*</span>
            </label>
            <input type="text" placeholder="What's this about?" {...fieldProps('subject')} />
            {fieldError('subject')}
          </div>

          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-[0.9rem] font-semibold text-ink">
              Message <span aria-hidden="true" className="text-ink-3">*</span>
            </label>
            <textarea rows={6} placeholder="Tell me about your project or just say hello!" {...fieldProps('message')} className="contact-field resize-y" />
            {fieldError('message')}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[0.82rem] text-ink-3">All fields are required.</p>
            <button type="submit" disabled={isSubmitting} className="btn-3d btn-violet">
              {isSubmitting ? (
                <>
                  <LoaderCircle size={18} className="contact-spinner" aria-hidden="true" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <span>Send message</span>
                  <Send size={17} aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
