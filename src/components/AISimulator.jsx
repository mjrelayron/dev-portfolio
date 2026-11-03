import React, { useState, useEffect } from 'react';
import { track } from '@vercel/analytics/react';

// onShowProcessPage is still accepted (same props as the other simulators); ProcessPage has no AI timeline yet
// eslint-disable-next-line no-unused-vars
const AISimulator = ({ onBack, onProceedToQuote, onShowProcessPage }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [solutionType, setSolutionType] = useState(null);
    const [aiModel, setAiModel] = useState(null);
    const [dataSources, setDataSources] = useState([]);
    const [estimatedVolume, setEstimatedVolume] = useState(1000);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationResults, setSimulationResults] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const steps = [
        'Select Solution',
        'Configure Intelligence',
        'Estimate Impact',
        'Architecture Preview'
    ];

    const solutionTypes = [
        {
            id: 'chatbot',
            title: 'AI Support Agent',
            icon: '💬',
            description: '24/7 customer support chatbot trained on your data.',
            features: ['Instant Responses', 'Knowledge Base RAG', 'Human Handoff']
        },
        {
            id: 'scraper',
            title: 'Intelligent Scraper',
            icon: '🕷️',
            description: 'Extract structured data from any website automatically.',
            features: ['Anti-bot Bypass', 'Data Cleaning', 'CRM Integration']
        },
        {
            id: 'workflow',
            title: 'Workflow Automation',
            icon: '⚙️',
            description: 'Connect apps and automate repetitive business tasks.',
            features: ['Multi-step Logic', 'Error Handling', 'API Integrations']
        },
        {
            id: 'rag',
            title: 'Document Intelligence',
            icon: '📄',
            description: 'Chat with your PDF documents and extract insights.',
            features: ['Semantic Search', 'Citation Support', 'Secure Local Processing']
        }
    ];

    const aiModels = [
        { id: 'gpt4', name: 'GPT-4o (OpenAI)', type: 'Cloud', cost: '$$$', speed: 'Fast' },
        { id: 'claude', name: 'Claude 3.5 Sonnet', type: 'Cloud', cost: '$$', speed: 'Fast' },
        { id: 'llama', name: 'Llama 3 (Local)', type: 'On-Prem', cost: '$', speed: 'Variable' }
    ];

    const dataSourceOptions = [
        { id: 'website', label: 'Website Content' },
        { id: 'pdf', label: 'PDF Documents' },
        { id: 'database', label: 'SQL Database' },
        { id: 'api', label: 'External APIs' }
    ];

    const handleSolutionSelect = (id) => {
        setSolutionType(id);
        track('simulator_step_completed', {
            simulator: 'ai',
            step: 'solution_selection',
            solution: id
        });
        setCurrentStep(1);
    };

    const handleModelSelect = (id) => {
        setAiModel(id);
    };

    const toggleDataSource = (id) => {
        setDataSources(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const runSimulation = async () => {
        setIsSimulating(true);

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate results based on inputs
        const results = {
            efficiency: Math.floor(Math.random() * 20) + 70, // 70-90%
            costSavings: Math.floor(Math.random() * 3000) + 2000, // $2000-$5000
            hoursSaved: Math.floor(estimatedVolume * 0.05), // Simple heuristic
            accuracy: aiModel === 'gpt4' ? '98%' : aiModel === 'claude' ? '97%' : '95%',
            architecture: [
                { name: 'Input Source', status: 'Connected' },
                { name: 'Vector DB', status: 'Optimized' },
                { name: 'AI Model', status: 'Ready' },
                { name: 'Output Interface', status: 'Configured' }
            ]
        };

        setSimulationResults(results);
        setIsSimulating(false);
        setCurrentStep(3);

        track('simulator_step_completed', {
            simulator: 'ai',
            step: 'simulation_run',
            model: aiModel
        });
    };

    const handleProceed = () => {
        track('simulator_completed', {
            simulator: 'ai',
            solution: solutionType
        });

        const serviceData = {
            service: 'AI & Automation',
            solutionType,
            aiModel,
            dataSources,
            estimatedVolume,
            simulationResults,
            simulatorData: {
                solutionType,
                aiModel,
                dataSources,
                estimatedVolume,
                simulationResults
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
                            AI Architecture Simulator
                        </div>
                    </div>

                    <div className="lab-steps flex items-center justify-center space-x-2">
                        {steps.map((step, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index <= currentStep
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-600 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <span className={`hidden md:block ml-2 text-sm ${index <= currentStep ? 'text-white' : 'text-gray-400'
                                    }`}>
                                    {step}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className="w-8 h-0.5 bg-gray-600 mx-4 hidden md:block"></div>
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
                                <h2 className="text-3xl font-bold text-white mb-4">
                                    What do you want to build?
                                </h2>
                                <p className="text-gray-300 text-lg">
                                    Select an AI solution pattern to start designing your architecture.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {solutionTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => handleSolutionSelect(type.id)}
                                        className="group p-6 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 text-left"
                                    >
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {type.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400">
                                            {type.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4 text-sm">
                                            {type.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {type.features.map((feature, i) => (
                                                <span key={i} className="text-xs px-2 py-1 rounded bg-black/30 text-gray-300 border border-gray-700">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="glass-content-pane space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Configure Intelligence</h2>
                                <p className="text-gray-300">Choose your AI model and data sources.</p>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-4">Select AI Model</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {aiModels.map((model) => (
                                        <button
                                            key={model.id}
                                            onClick={() => handleModelSelect(model.id)}
                                            className={`p-4 rounded-lg border-2 transition-all ${aiModel === model.id
                                                    ? 'border-cyan-400 bg-cyan-400/10'
                                                    : 'border-gray-700 hover:border-gray-500 bg-white/5'
                                                }`}
                                        >
                                            <div className="font-bold text-white mb-1">{model.name}</div>
                                            <div className="flex justify-between text-xs text-gray-400">
                                                <span>{model.type}</span>
                                                <span>{model.cost}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-medium mb-4">Connect Data Sources</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {dataSourceOptions.map((source) => (
                                        <button
                                            key={source.id}
                                            onClick={() => toggleDataSource(source.id)}
                                            className={`p-4 rounded-lg border transition-all ${dataSources.includes(source.id)
                                                    ? 'border-green-400 bg-green-400/10 text-white'
                                                    : 'border-gray-700 hover:border-gray-500 text-gray-400'
                                                }`}
                                        >
                                            {source.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentStep(2)}
                                disabled={!aiModel || dataSources.length === 0}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                                Next: Estimate Impact
                            </button>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="glass-content-pane space-y-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Estimate Scale</h2>
                                <p className="text-gray-300">How much volume do you expect?</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Monthly Operations (Queries/Pages/Tasks)
                                    </label>
                                    <input
                                        type="range"
                                        min="100"
                                        max="10000"
                                        step="100"
                                        value={estimatedVolume}
                                        onChange={(e) => setEstimatedVolume(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="text-center mt-4 text-3xl font-bold text-cyan-400">
                                        {estimatedVolume.toLocaleString()}
                                    </div>
                                </div>

                                <div className="bg-white/5 p-6 rounded-lg border border-gray-700">
                                    <h4 className="text-white font-bold mb-4">Projected Requirements</h4>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        <li className="flex justify-between">
                                            <span>Compute Load:</span>
                                            <span className="text-white">{estimatedVolume > 5000 ? 'High' : 'Moderate'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Storage:</span>
                                            <span className="text-white">~{(estimatedVolume * 0.5).toFixed(1)} GB</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span>Est. API Cost:</span>
                                            <span className="text-white">${(estimatedVolume * 0.02).toFixed(2)}/mo</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <button
                                onClick={runSimulation}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all flex justify-center items-center"
                            >
                                {isSimulating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                        Running Simulation...
                                    </>
                                ) : (
                                    'Run Architecture Simulation'
                                )}
                            </button>
                        </div>
                    )}

                    {currentStep === 3 && simulationResults && (
                        <div className="glass-content-pane space-y-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🚀
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Architecture Validated</h2>
                                <p className="text-gray-300">Your custom AI solution is ready to be built.</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white/5 p-4 rounded-lg text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-green-400">{simulationResults.efficiency}%</div>
                                    <div className="text-xs text-gray-400">Efficiency Gain</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-cyan-400">${simulationResults.costSavings}</div>
                                    <div className="text-xs text-gray-400">Est. Monthly Savings</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-purple-400">{simulationResults.hoursSaved}h</div>
                                    <div className="text-xs text-gray-400">Hours Saved/Mo</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg text-center border border-gray-700">
                                    <div className="text-2xl font-bold text-yellow-400">{simulationResults.accuracy}</div>
                                    <div className="text-xs text-gray-400">Projected Accuracy</div>
                                </div>
                            </div>

                            <div className="bg-black/30 p-6 rounded-lg border border-gray-800">
                                <h4 className="text-white font-bold mb-4">System Architecture</h4>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    {simulationResults.architecture.map((node, i) => (
                                        <React.Fragment key={i}>
                                            <div className="bg-gray-800 p-3 rounded border border-gray-600 text-center w-full md:w-auto">
                                                <div className="text-cyan-400 font-bold text-sm">{node.name}</div>
                                                <div className="text-xs text-green-400">● {node.status}</div>
                                            </div>
                                            {i < simulationResults.architecture.length - 1 && (
                                                <div className="text-gray-500">➜</div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleProceed}
                                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-lg hover:shadow-lg transition-all"
                                >
                                    Get Implementation Quote
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AISimulator;
