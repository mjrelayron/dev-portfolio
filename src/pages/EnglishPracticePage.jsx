import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EnglishPracticePage = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "Hello! I'm MelBot, your English & Tech Tutor. I'm here to help you practice your conversation skills while we talk about tech, life, or whatever is on your mind. I'll also give you feedback on your grammar and vocabulary. What shall we talk about today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        const end = messagesEndRef.current;
        // embedded in a page: scroll the log itself so the surrounding page doesn't jump
        const log = end?.closest('.lab-chat__log');
        if (log) log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' });
        else end?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
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
            alert("Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.");
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const messageToSend = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
        setIsLoading(true);

        try {
            const response = await fetch('https://mjre-portfolio.vercel.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageToSend,
                    mode: 'tutor', // Enable Tutor Mode
                    history: messages.map(m => ({ role: m.role, text: m.content }))
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Let's try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="lab-chat">
            {/* Header */}
            <header className="lab-chat__bar">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="lab-chat__avatar" aria-hidden="true">🎓</div>
                    <div className="min-w-0">
                        <h2 className="font-bold text-lg text-white leading-tight">English Practice with MelBot</h2>
                        <p className="text-xs text-gray-400">Grammar Critic • Tech Tutor • Conversationalist</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/lab')}
                    className="lab-key inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold"
                >
                    ← Lab
                </button>
            </header>

            {/* Chat Area */}
            <div className="lab-chat__log" role="log" aria-live="polite" aria-label="Practice conversation">
                <div className="space-y-5">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`lab-bubble max-w-[88%] md:max-w-[80%] ${msg.role === 'user' ? 'lab-bubble--me' : 'lab-bubble--bot'}`}>
                                <span className="sr-only">{msg.role === 'user' ? 'You:' : 'MelBot:'}</span>
                                {/* Render Markdown-like content (simple implementation) */}
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start" aria-label="MelBot is typing">
                            <div className="lab-bubble lab-bubble--bot flex space-x-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="lab-chat__input">
                <form onSubmit={handleSubmit} className="relative flex items-center">
                    <label htmlFor="practice-input" className="sr-only">Your message</label>
                    <input
                        id="practice-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="lab-chat__field"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
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
                <p className="text-center text-xs text-gray-400 mt-2">
                    MelBot is learning from our conversation to help you better.
                </p>
            </div>
        </div>
    );
};

export default EnglishPracticePage;
