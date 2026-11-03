import React, { useState, useRef, useEffect } from 'react';
import { aiContext } from '../data/ai-context';
import { track } from '@vercel/analytics/react';
import { useNavigate } from 'react-router-dom';

const AIChatPage = () => {
    const navigate = useNavigate();

    // Load from localStorage with 48-hour expiry check (Same logic as ChatWidget)
    const [messages, setMessages] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('melbot_chat_history');
            const savedTime = localStorage.getItem('melbot_chat_timestamp');

            if (saved && savedTime) {
                const now = new Date().getTime();
                const twoDays = 48 * 60 * 60 * 1000;

                if (now - parseInt(savedTime) < twoDays) {
                    return JSON.parse(saved);
                }
            }
        }
        return [{ role: 'assistant', content: "Hello! I'm MelBot. I can tell you all about the developer's work, skills, and experience. What would you like to know?" }];
    });

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const starterQuestions = [
        "What are your main skills?",
        "Tell me about your best project.",
        "Do you have experience with AI?",
        "How can I hire you?"
    ];

    const scrollToBottom = () => {
        const end = messagesEndRef.current;
        // embedded in a page: scroll the log itself so the surrounding page doesn't jump
        const log = end?.closest('.lab-chat__log');
        if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
        else end?.scrollIntoView({ behavior: "smooth" });
    };

    // Persist messages to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('melbot_chat_history', JSON.stringify(messages));
            localStorage.setItem('melbot_chat_timestamp', new Date().getTime().toString());
        }
        scrollToBottom();
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const handleVoiceInput = () => {
        if (recognitionRef.current) {
            if (isListening) {
                recognitionRef.current.stop();
            } else {
                try {
                    recognitionRef.current.start();
                } catch (error) {
                    console.error("Error starting speech recognition:", error);
                }
            }
        } else {
            alert("Voice input is not supported in this browser.");
        }
    };

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English')) || voices[0];
            utterance.voice = preferredVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleLinkClick = (link) => {
        if (link.startsWith('http')) {
            window.open(link, '_blank', 'noopener,noreferrer');
        } else {
            navigate(link);
        }
    };

    // Helper to render message content (Consistent with ChatWidget)
    const renderMessageContent = (content) => {
        const lines = content.split('\n');
        const renderedContent = [];
        let projectBuffer = [];

        lines.forEach((line, index) => {
            // Check for Project Line Marker (>>>)
            if (line.trim().startsWith('>>>')) {
                const match = line.match(/>>> :::([^|]+)\|(.+?)::: - (.+)/);
                if (match) {
                    projectBuffer.push({ title: match[1], link: match[2], desc: match[3] });
                }
            } else {
                // If we have buffered projects, render them as a carousel first
                if (projectBuffer.length > 0) {
                    renderedContent.push(
                        <div key={`carousel-${index}`} className="flex gap-3 overflow-x-auto pb-2 mb-2 scrollbar-hide -mx-2 px-2">
                            {projectBuffer.map((proj, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleLinkClick(proj.link)}
                                    className="flex-shrink-0 w-64 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{proj.title}</h4>
                                        <svg className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2">{proj.desc}</p>
                                </div>
                            ))}
                        </div>
                    );
                    projectBuffer = [];
                }

                // Render normal text (handling inline chips, bold, bullets)
                if (line.trim()) {
                    const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
                    const cleanLine = isBullet ? line.trim().substring(2) : line;

                    renderedContent.push(
                        <div key={`text-${index}`} className={`mb-1 ${isBullet ? 'pl-4 relative' : ''}`}>
                            {isBullet && (
                                <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                            )}
                            {cleanLine.split(/(:::[^|]+\|.+?:::)/g).map((part, i) => {
                                const match = part.match(/:::([^|]+)\|(.+?):::/);
                                if (match) {
                                    const [_, title, link] = match;

                                    // Handle static tags
                                    if (link === 'tag') {
                                        return (
                                            <span
                                                key={i}
                                                className="inline-flex items-center px-2.5 py-0.5 mx-1 my-0.5 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-full border border-gray-200 dark:border-white/10"
                                            >
                                                {title}
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleLinkClick(link)}
                                            className="inline-flex items-center px-2 py-0.5 mx-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold rounded-md hover:bg-cyan-200 dark:hover:bg-cyan-900/50 transition-colors"
                                        >
                                            {title}
                                        </button>
                                    );
                                }

                                // Parse Bold Text
                                return part.split(/(\*\*.*?\*\*)/g).map((subPart, j) => {
                                    if (subPart.startsWith('**') && subPart.endsWith('**')) {
                                        return <strong key={`${i}-${j}`} className="font-bold text-gray-900 dark:text-white">{subPart.slice(2, -2)}</strong>;
                                    }
                                    return subPart;
                                });
                            })}
                        </div>
                    );
                }
            }
        });

        // Flush remaining buffer
        if (projectBuffer.length > 0) {
            renderedContent.push(
                <div key="carousel-end" className="flex gap-3 overflow-x-auto pb-2 mt-2 scrollbar-hide -mx-2 px-2">
                    {projectBuffer.map((proj, i) => (
                        <div
                            key={i}
                            onClick={() => handleLinkClick(proj.link)}
                            className="flex-shrink-0 w-64 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{proj.title}</h4>
                                <svg className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2">{proj.desc}</p>
                        </div>
                    ))}
                </div>
            );
        }

        return renderedContent;
    };

    const handleSubmit = async (e, overrideInput = null) => {
        if (e) e.preventDefault();
        const messageToSend = overrideInput || input;

        if (!messageToSend.trim() || isLoading) return;

        setInput('');
        const newHistory = [...messages, { role: 'user', content: messageToSend }];
        setMessages(newHistory);
        setIsLoading(true);
        track('ai_chat_sent', { type: 'full_page' });

        try {
            // Send context history
            const contextHistory = newHistory.slice(-10).map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                text: msg.content
            }));

            const response = await fetch('https://mjre-portfolio.vercel.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageToSend,
                    history: contextHistory,
                    context: aiContext
                }),
            });

            const data = await response.json();

            if (data.error) {
                console.error('Server Error Details:', data);
                throw new Error(data.error + (data.details ? ` - ${data.details}` : ''));
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="lab-chat">
            {/* Header */}
            <header className="lab-chat__bar">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="lab-chat__avatar" aria-hidden="true">🤖</div>
                    <div className="min-w-0">
                        <h2 className="font-bold text-lg text-white leading-tight">MelBot</h2>
                        <p className="flex items-center text-xs text-green-400">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5" aria-hidden="true"></span>
                            Online · powered by Gemini
                        </p>
                    </div>
                </div>
                <button onClick={() => navigate('/lab')} className="lab-key inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Lab
                </button>
            </header>

            {/* Chat Area */}
            <div className="lab-chat__log space-y-5" role="log" aria-live="polite" aria-label="Conversation with MelBot">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[88%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 text-sm ${msg.role === 'user' ? 'lab-chat__me ml-2.5' : 'bg-gray-700 mr-2.5'}`} aria-hidden="true">
                                {msg.role === 'user' ? '👤' : '🤖'}
                            </div>

                            {/* Bubble */}
                            <div className={`lab-bubble ${msg.role === 'user' ? 'lab-bubble--me' : 'lab-bubble--bot'}`}>
                                <span className="sr-only">{msg.role === 'user' ? 'You:' : 'MelBot:'}</span>
                                {renderMessageContent(msg.content)}
                                {msg.role === 'assistant' && (
                                    <button
                                        onClick={() => speakResponse(msg.content)}
                                        className="mt-2 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                                        title="Read aloud"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                                        <span>Read aloud</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start" aria-label="MelBot is typing">
                        <div className="flex items-center space-x-2 ml-11">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="lab-chat__input">
                {/* Starter Chips */}
                {messages.length < 3 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {starterQuestions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => handleSubmit(null, q)}
                                className="lab-chip-btn"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <label htmlFor="melbot-page-input" className="sr-only">Message MelBot</label>
                    <input
                        id="melbot-page-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything..."
                        className="lab-chat__field"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                        {/* Voice Button */}
                        <button
                            type="button"
                            onClick={handleVoiceInput}
                            className={`lab-icon-btn ${isListening ? 'is-live' : ''}`}
                            title="Voice Input"
                            aria-label={isListening ? 'Stop voice input' : 'Voice input'}
                            aria-pressed={isListening}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="lab-icon-btn lab-icon-btn--send"
                            aria-label="Send message"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-6-6l6 6-6 6" /></svg>
                        </button>
                    </div>
                </form>
                <p className="text-center mt-2 text-xs text-gray-400">
                    Voice input supported in Chrome/Edge. Press the mic to speak.
                </p>
            </div>
        </div>
    );
};

export default AIChatPage;
