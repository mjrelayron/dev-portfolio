import React, { useState, useEffect } from 'react';

const FullStackSimulator = ({ onBack, onProceedToQuote, onShowProcessPage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [databaseTables, setDatabaseTables] = useState([]);
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [frontendComponents, setFrontendComponents] = useState([]);
  const [selectedTechStack, setSelectedTechStack] = useState({
    frontend: '',
    backend: '',
    database: ''
  });

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
    'Project Planning',
    'Database Design',
    'API Development',
    'Frontend Development',
    'Preview & Results'
  ];

  const projectTypes = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Complete online store with cart, payments, and inventory',
      icon: '🛒',
      features: ['User Authentication', 'Product Catalog', 'Shopping Cart', 'Payment Integration', 'Order Management', 'Admin Dashboard']
    },
    {
      id: 'social',
      name: 'Social Media App',
      description: 'Connect users with posts, comments, and real-time features',
      icon: '👥',
      features: ['User Profiles', 'Posts & Media', 'Comments & Likes', 'Real-time Chat', 'Notifications', 'Feed Algorithm']
    },
    {
      id: 'crm',
      name: 'CRM System',
      description: 'Customer relationship management with analytics',
      icon: '📊',
      features: ['Contact Management', 'Sales Pipeline', 'Task Management', 'Reporting', 'Email Integration', 'Document Storage']
    },
    {
      id: 'blog',
      name: 'Content Management',
      description: 'Blog or news platform with rich content features',
      icon: '📝',
      features: ['Content Editor', 'Categories & Tags', 'User Roles', 'SEO Tools', 'Comment System', 'Analytics Dashboard']
    }
  ];

  const techStackOptions = {
    frontend: [
      { id: 'react', name: 'React', description: 'Component-based UI library' },
      { id: 'vue', name: 'Vue.js', description: 'Progressive JavaScript framework' },
      { id: 'angular', name: 'Angular', description: 'Full-featured TypeScript framework' },
      { id: 'svelte', name: 'Svelte', description: 'Compile-time optimized framework' }
    ],
    backend: [
      { id: 'nodejs', name: 'Node.js', description: 'JavaScript runtime for backend' },
      { id: 'python', name: 'Python (Django/FastAPI)', description: 'Rapid development frameworks' },
      { id: 'java', name: 'Java (Spring)', description: 'Enterprise-grade framework' },
      { id: 'csharp', name: 'C# (.NET)', description: 'Microsoft ecosystem framework' }
    ],
    database: [
      { id: 'postgresql', name: 'PostgreSQL', description: 'Advanced relational database' },
      { id: 'mongodb', name: 'MongoDB', description: 'NoSQL document database' },
      { id: 'mysql', name: 'MySQL', description: 'Popular relational database' },
      { id: 'redis', name: 'Redis', description: 'In-memory data store' }
    ]
  };

  const databaseTableTypes = [
    { id: 'users', name: 'Users', icon: '👤', description: 'User accounts and profiles' },
    { id: 'products', name: 'Products', icon: '📦', description: 'Product catalog and inventory' },
    { id: 'orders', name: 'Orders', icon: '📋', description: 'Order management and tracking' },
    { id: 'posts', name: 'Posts', icon: '📄', description: 'Content posts and articles' },
    { id: 'comments', name: 'Comments', icon: '💬', description: 'User comments and interactions' },
    { id: 'categories', name: 'Categories', icon: '📂', description: 'Content categorization' }
  ];

  const apiEndpointTypes = [
    { id: 'auth', name: 'Authentication', icon: '🔐', description: 'User login and registration' },
    { id: 'crud', name: 'CRUD Operations', icon: '⚙️', description: 'Create, read, update, delete' },
    { id: 'search', name: 'Search & Filter', icon: '🔍', description: 'Data search and filtering' },
    { id: 'upload', name: 'File Upload', icon: '📤', description: 'File and media uploads' },
    { id: 'payment', name: 'Payment', icon: '💳', description: 'Payment processing' },
    { id: 'notification', name: 'Notifications', icon: '🔔', description: 'Push notifications' }
  ];

  const frontendComponentTypes = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', description: 'Admin or user dashboard' },
    { id: 'forms', name: 'Forms', icon: '📝', description: 'Data input and validation' },
    { id: 'tables', name: 'Data Tables', icon: '📋', description: 'Data display and management' },
    { id: 'charts', name: 'Charts', icon: '📈', description: 'Data visualization' },
    { id: 'calendar', name: 'Calendar', icon: '📅', description: 'Event and scheduling' },
    { id: 'chat', name: 'Chat', icon: '💬', description: 'Real-time messaging' }
  ];

  const handleAddTable = (tableType) => {
    setDatabaseTables(prev => [...prev, { ...tableType, id: Date.now() }]);
  };

  const handleRemoveTable = (tableId) => {
    setDatabaseTables(prev => prev.filter(table => table.id !== tableId));
  };

  const handleAddEndpoint = (endpointType) => {
    setApiEndpoints(prev => [...prev, { ...endpointType, id: Date.now() }]);
  };

  const handleRemoveEndpoint = (endpointId) => {
    setApiEndpoints(prev => prev.filter(endpoint => endpoint.id !== endpointId));
  };

  const handleAddComponent = (componentType) => {
    setFrontendComponents(prev => [...prev, { ...componentType, id: Date.now() }]);
  };

  const handleRemoveComponent = (componentId) => {
    setFrontendComponents(prev => prev.filter(component => component.id !== componentId));
  };

  const handleTechStackChange = (category, value) => {
    setSelectedTechStack(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleProceedToQuote = () => {
    const serviceData = {
      service: 'Full Stack Development',
      projectType: projectType,
      databaseTables: databaseTables.length,
      apiEndpoints: apiEndpoints.length,
      frontendComponents: frontendComponents.length,
      techStack: selectedTechStack
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
            
            <div className="flex items-center text-purple-400 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Simplified Demo
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Full Stack Development
            </h1>
            <p className="text-gray-300 text-lg">
              Design your complete web application from database to frontend
            </p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="lab-steps flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-4 transition-all duration-300 ${
                    index < currentStep ? 'bg-purple-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Project Planning */}
          {currentStep === 0 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Plan Your Project
                </h2>
                <p className="text-gray-300 text-lg">
                  Tell us about your project and choose your technology stack
                </p>
              </div>

              <div className="space-y-8">
                {/* Project Details */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Project Name</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter your project name"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Type Selection */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Choose Project Type</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {projectTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          projectType === type.id
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setProjectType(type.id)}
                      >
                        <div className="flex items-center mb-4">
                          <span className="text-3xl mr-4">{type.icon}</span>
                          <div>
                            <h4 className="text-white font-bold">{type.name}</h4>
                            <p className="text-gray-400 text-sm">{type.description}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {type.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-300">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                              {feature}
                            </div>
                          ))}
                          {type.features.length > 3 && (
                            <div className="text-sm text-gray-400">
                              +{type.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technology Stack */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Technology Stack</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {Object.entries(techStackOptions).map(([category, options]) => (
                      <div key={category}>
                        <h4 className="text-white font-medium mb-3 capitalize">{category}</h4>
                        <div className="space-y-2">
                          {options.map((option) => (
                            <div
                              key={option.id}
                              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                                selectedTechStack[category] === option.id
                                  ? 'bg-purple-500/20 border border-purple-500'
                                  : 'bg-gray-800 border border-gray-600 hover:border-gray-500'
                              }`}
                              onClick={() => handleTechStackChange(category, option.id)}
                            >
                              <div className="font-medium text-white">{option.name}</div>
                              <div className="text-sm text-gray-400">{option.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentStep(1)}
                disabled={!projectName || !projectType || !selectedTechStack.frontend || !selectedTechStack.backend || !selectedTechStack.database}
                className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                Design Database →
              </button>
            </div>
          )}

          {/* Step 2: Database Design */}
          {currentStep === 1 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Design Your Database
                </h2>
                <p className="text-gray-300 text-lg">
                  Choose the database tables your application needs
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Available Tables */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Available Tables</h3>
                  <div className="space-y-3">
                    {databaseTableTypes.map((table) => (
                      <div
                        key={table.id}
                        className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-purple-400"
                        onClick={() => handleAddTable(table)}
                      >
                        <span className="text-2xl mr-4">{table.icon}</span>
                        <div>
                          <h4 className="text-white font-medium">{table.name}</h4>
                          <p className="text-gray-400 text-sm">{table.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Tables */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Database Schema</h3>
                  <div className="bg-gray-900 rounded-lg p-4 min-h-96">
                    {databaseTables.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🗄️</div>
                          <p>Your database is empty</p>
                          <p className="text-sm mt-1">Add tables from the left</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {databaseTables.map((table) => (
                          <div key={table.id} className="relative group">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-xl mr-3">{table.icon}</span>
                                  <div>
                                    <h4 className="text-white font-medium">{table.name}</h4>
                                    <p className="text-gray-400 text-sm">{table.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveTable(table.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                Primary Key: id | Fields: name, created_at, updated_at
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Build API →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: API Development */}
          {currentStep === 2 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Build Your API
                </h2>
                <p className="text-gray-300 text-lg">
                  Choose the API endpoints your application needs
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Available Endpoints */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Available Endpoints</h3>
                  <div className="space-y-3">
                    {apiEndpointTypes.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-purple-400"
                        onClick={() => handleAddEndpoint(endpoint)}
                      >
                        <span className="text-2xl mr-4">{endpoint.icon}</span>
                        <div>
                          <h4 className="text-white font-medium">{endpoint.name}</h4>
                          <p className="text-gray-400 text-sm">{endpoint.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Endpoints */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your API Endpoints</h3>
                  <div className="bg-gray-900 rounded-lg p-4 min-h-96">
                    {apiEndpoints.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🔌</div>
                          <p>Your API is empty</p>
                          <p className="text-sm mt-1">Add endpoints from the left</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {apiEndpoints.map((endpoint) => (
                          <div key={endpoint.id} className="relative group">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-xl mr-3">{endpoint.icon}</span>
                                  <div>
                                    <h4 className="text-white font-medium">{endpoint.name}</h4>
                                    <p className="text-gray-400 text-sm">{endpoint.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveEndpoint(endpoint.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="mt-3 flex space-x-2">
                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">GET</span>
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">POST</span>
                                <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded">PUT</span>
                                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">DELETE</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Build Frontend →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Frontend Development */}
          {currentStep === 3 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Build Your Frontend
                </h2>
                <p className="text-gray-300 text-lg">
                  Choose the UI components your application needs
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Available Components */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Available Components</h3>
                  <div className="space-y-3">
                    {frontendComponentTypes.map((component) => (
                      <div
                        key={component.id}
                        className="flex items-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors border-2 border-transparent hover:border-purple-400"
                        onClick={() => handleAddComponent(component)}
                      >
                        <span className="text-2xl mr-4">{component.icon}</span>
                        <div>
                          <h4 className="text-white font-medium">{component.name}</h4>
                          <p className="text-gray-400 text-sm">{component.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Components */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Your Frontend Components</h3>
                  <div className="bg-gray-900 rounded-lg p-4 min-h-96">
                    {frontendComponents.length === 0 ? (
                      <div className="flex items-center justify-center h-64 text-gray-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🖥️</div>
                          <p>Your frontend is empty</p>
                          <p className="text-sm mt-1">Add components from the left</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {frontendComponents.map((component) => (
                          <div key={component.id} className="relative group">
                            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-xl mr-3">{component.icon}</span>
                                  <div>
                                    <h4 className="text-white font-medium">{component.name}</h4>
                                    <p className="text-gray-400 text-sm">{component.description}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveComponent(component.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                >
                                  ✕
                                </button>
                              </div>
                              <div className="mt-3 text-xs text-gray-500">
                                Framework: {selectedTechStack.frontend} | Responsive: Yes
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Preview Results →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Preview & Results */}
          {currentStep === 4 && (
            <div className="glass-content-pane">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Your Full Stack Application
                </h2>
                <p className="text-gray-300 text-lg">
                  Here's what I can build for you based on your selections.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <h3 className="text-xl font-bold text-white mb-4">Application Architecture</h3>
                  <div className="bg-gray-900 rounded-lg p-6">
                    <div className="space-y-4">
                      {/* Frontend Layer */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Frontend Layer</h4>
                        <div className="text-blue-100 text-sm">
                          <div>Framework: {techStackOptions.frontend.find(t => t.id === selectedTechStack.frontend)?.name}</div>
                          <div>Components: {frontendComponents.length} UI components</div>
                          <div>Features: Responsive design, modern UI/UX</div>
                        </div>
                      </div>

                      {/* API Layer */}
                      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">API Layer</h4>
                        <div className="text-green-100 text-sm">
                          <div>Framework: {techStackOptions.backend.find(t => t.id === selectedTechStack.backend)?.name}</div>
                          <div>Endpoints: {apiEndpoints.length} API endpoints</div>
                          <div>Features: RESTful API, authentication, validation</div>
                        </div>
                      </div>

                      {/* Database Layer */}
                      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-4">
                        <h4 className="text-white font-bold mb-2">Database Layer</h4>
                        <div className="text-purple-100 text-sm">
                          <div>Database: {techStackOptions.database.find(t => t.id === selectedTechStack.database)?.name}</div>
                          <div>Tables: {databaseTables.length} database tables</div>
                          <div>Features: Optimized queries, data integrity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">Project Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Project:</span>
                        <span className="text-white">{projectName || 'Your Project'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Type:</span>
                        <span className="text-white">{projectTypes.find(p => p.id === projectType)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Database Tables:</span>
                        <span className="text-white">{databaseTables.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">API Endpoints:</span>
                        <span className="text-white">{apiEndpoints.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Frontend Components:</span>
                        <span className="text-white">{frontendComponents.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-white mb-4">What I'll Deliver</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Complete full stack application</li>
                      <li>• Responsive frontend design</li>
                      <li>• RESTful API with documentation</li>
                      <li>• Optimized database schema</li>
                      <li>• Authentication & security</li>
                      <li>• Testing & deployment</li>
                    </ul>
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
                    Get Your Full Stack Quote
                  </button>
                  
                  <button
                    onClick={() => onShowProcessPage('fullstack')}
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

export default FullStackSimulator;
