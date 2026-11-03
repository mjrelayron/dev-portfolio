import React, { useState, useEffect } from 'react';

const AIQuoteGenerator = ({
    onBack,
    onGenerateQuote,
    simulatorData = null
}) => {
    const [formData, setFormData] = useState({
        projectType: '',
        complexity: 'medium',
        integrations: [],
        timeline: 'standard',
        contactInfo: {
            name: '',
            email: '',
            company: ''
        }
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [quoteData, setQuoteData] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (simulatorData) {
            setFormData(prev => ({
                ...prev,
                projectType: simulatorData.solutionType || '',
                complexity: simulatorData.estimatedVolume > 5000 ? 'high' : 'medium'
            }));
        }
    }, [simulatorData]);

    const steps = [
        'Project Scope',
        'Technical Requirements',
        'Contact Details',
        'Quote Summary'
    ];

    const projectTypes = [
        { id: 'chatbot', label: 'AI Chatbot / Agent', basePrice: 3000 },
        { id: 'scraper', label: 'Web Scraper / Data Pipeline', basePrice: 1500 },
        { id: 'workflow', label: 'Workflow Automation', basePrice: 2000 },
        { id: 'rag', label: 'RAG / Document Search', basePrice: 4000 }
    ];

    const complexityLevels = [
        { id: 'low', label: 'MVP / Prototype', multiplier: 1 },
        { id: 'medium', label: 'Production Ready', multiplier: 1.5 },
        { id: 'high', label: 'Enterprise Scale', multiplier: 2.5 }
    ];

    const calculateQuote = () => {
        const base = projectTypes.find(p => p.id === formData.projectType)?.basePrice || 2000;
        const multiplier = complexityLevels.find(c => c.id === formData.complexity)?.multiplier || 1;
        const total = base * multiplier;

        return {
            totalPrice: total,
            breakdown: [
                { item: 'Core Development', cost: total * 0.6 },
                { item: 'AI Model Integration', cost: total * 0.2 },
                { item: 'Testing & Deployment', cost: total * 0.2 }
            ],
            timeline: formData.complexity === 'high' ? '4-6 weeks' : '2-3 weeks'
        };
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setQuoteData(calculateQuote());
        setCurrentStep(3);
        setIsGenerating(false);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Project Scope</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projectTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setFormData({ ...formData, projectType: type.id })}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${formData.projectType === type.id
                                            ? 'border-cyan-400 bg-cyan-400/10'
                                            : 'border-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="font-bold text-white">{type.label}</div>
                                    <div className="text-sm text-gray-400">Starts at ${type.basePrice}</div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentStep(1)}
                            disabled={!formData.projectType}
                            className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg disabled:opacity-50 mt-4"
                        >
                            Next Step
                        </button>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Complexity Level</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {complexityLevels.map(level => (
                                <button
                                    key={level.id}
                                    onClick={() => setFormData({ ...formData, complexity: level.id })}
                                    className={`p-4 rounded-lg border-2 text-left transition-all ${formData.complexity === level.id
                                            ? 'border-purple-400 bg-purple-400/10'
                                            : 'border-gray-700 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="font-bold text-white">{level.label}</div>
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setCurrentStep(0)} className="px-6 py-3 text-gray-400">Back</button>
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 bg-cyan-600 text-white font-bold py-3 rounded-lg"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white">Contact Details</h3>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                            value={formData.contactInfo.name}
                            onChange={e => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, name: e.target.value } })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
                            value={formData.contactInfo.email}
                            onChange={e => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value } })}
                        />
                        <div className="flex gap-4 mt-4">
                            <button onClick={() => setCurrentStep(1)} className="px-6 py-3 text-gray-400">Back</button>
                            <button
                                onClick={handleGenerate}
                                disabled={!formData.contactInfo.email}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg"
                            >
                                {isGenerating ? 'Calculating...' : 'Generate Quote'}
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-4xl">
                            💰
                        </div>
                        <h3 className="text-2xl font-bold text-white">Estimated Investment</h3>
                        <div className="text-5xl font-bold text-cyan-400 my-6">
                            ${quoteData.totalPrice.toLocaleString()}
                        </div>
                        <div className="bg-white/5 p-6 rounded-lg text-left max-w-md mx-auto">
                            {quoteData.breakdown.map((item, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                                    <span className="text-gray-300">{item.item}</span>
                                    <span className="text-white font-bold">${item.cost.toLocaleString()}</span>
                                </div>
                            ))}
                            <div className="mt-4 pt-4 border-t border-gray-600 flex justify-between">
                                <span className="text-gray-400">Est. Timeline</span>
                                <span className="text-cyan-400 font-bold">{quoteData.timeline}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onGenerateQuote(quoteData, formData)}
                            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 mt-4"
                        >
                            Book Consultation
                        </button>
                        <button onClick={onBack} className="text-gray-400 mt-4 block mx-auto">Close</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="lab-stage">
            <div className="lab-quote lab-quote--padded">
                {renderStep()}
            </div>
        </div>
    );
};

export default AIQuoteGenerator;
