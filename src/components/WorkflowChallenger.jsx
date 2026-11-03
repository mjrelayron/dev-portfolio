import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Search, 
  Filter, 
  Trophy, 
  Star, 
  Clock, 
  Users, 
  ChevronRight,
  Zap,
  Settings,
  BookOpen,
  Target,
  Award,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkflowChallenger = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeTab, setActiveTab] = useState('tutorials');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // Show all difficulty levels by default
  const [tutorials, setTutorials] = useState({ videos: [] });
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState(null);
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [loadedVideoIds, setLoadedVideoIds] = useState(new Set());
  const [totalCachedVideos, setTotalCachedVideos] = useState(0);
  const [apiStatus, setApiStatus] = useState('ready'); // 'ready', 'cached', 'youtube', 'exhausted'
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [cachedVideosExhausted, setCachedVideosExhausted] = useState(false);
  const [consecutiveDuplicatePages, setConsecutiveDuplicatePages] = useState(0);
  const [nextPageToken, setNextPageToken] = useState(null);
  
  // New pagination state
  const [displayedVideos, setDisplayedVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [videosPerPage] = useState(6); // Initial load
  const [videosPerScroll] = useState(3); // Load 3 more on scroll

  // Automatic API key generation
  const attemptAutoKeyGeneration = async () => {
    if (isGeneratingKey) return;
    
    setIsGeneratingKey(true);
    setApiStatus('generating');
    
    try {
      console.log('🤖 Starting automatic API key generation...');
      
      // Try to call the API key generation server
      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ New API key generated automatically!');
        console.log(`🔑 Key: ${data.key}`);
        
        // Update the API keys array with the new key
        const newKey = data.key.replace('...', ''); // This is just for display, we need the full key
        YOUTUBE_API_KEYS.push(newKey);
        setCurrentApiKeyIndex(YOUTUBE_API_KEYS.length - 1);
        
        // Reset states and try again
        setCachedVideosExhausted(false);
        setHasMoreVideos(true);
        setApiStatus('ready');
        
        // Retry the search with new key
        setTimeout(() => {
          searchYouTubeTutorials(selectedTool, searchQuery, difficultyFilter, nextPageToken, true);
        }, 1000);
        
      } else {
        const errorData = await response.json();
        console.log('❌ Automatic key generation failed:', errorData.error);
        setApiStatus('exhausted');
        setHasMoreVideos(false);
      }
    } catch (error) {
      console.log('❌ Could not connect to API key server:', error.message);
      console.log('💡 Make sure to run: npm run youtube:server');
      setApiStatus('exhausted');
      setHasMoreVideos(false);
    } finally {
      setIsGeneratingKey(false);
    }
  };

  // Load tutorials when tool is selected
  useEffect(() => {
    if (selectedTool && selectedTool !== null) {
      searchYouTubeTutorials(selectedTool, '', difficultyFilter);
    }
  }, [selectedTool, difficultyFilter]);
  
  // Scroll handler for loading more videos
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingMore) return; // Don't load if already loading
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Load more when user scrolls to 80% of the page
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        loadMoreVideos();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayedVideos, allVideos, isLoadingMore]);
  
  // Function to load more videos (3 at a time)
  const loadMoreVideos = () => {
    if (displayedVideos.length >= allVideos.length) return; // No more videos to load
    
    setIsLoadingMore(true);
    
    // Simulate "searching and curating" delay
    setTimeout(() => {
      const nextVideos = allVideos.slice(
        displayedVideos.length,
        displayedVideos.length + videosPerScroll
      );
      
      setDisplayedVideos(prev => [...prev, ...nextVideos]);
      setIsLoadingMore(false);
    }, 1500); // 1.5 second delay to give users time to watch current videos
  };

  // Removed scroll handler - no more pagination needed

  // Generate recommended content
  const generateRecommendedContent = () => {
    const recommended = {
      tutorials: tutorials.slice(0, 3),
      challenges: mockChallenges.slice(0, 2)
    };
    setRecommendedContent(recommended);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (selectedTool) {
      searchYouTubeTutorials(selectedTool, searchQuery, difficultyFilter);
    }
  };

  // Handle difficulty filter change
  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    setLoadedVideoIds(new Set());
    setCurrentPage(0);
    setTotalCachedVideos(0);
    setCachedVideosExhausted(false);
    setConsecutiveDuplicatePages(0);
    if (selectedTool) {
      searchYouTubeTutorials(selectedTool, searchQuery, difficulty);
    }
  };

  const tools = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect your favorite apps and automate workflows',
      icon: '⚡',
      color: 'from-blue-500 to-purple-600',
      features: ['Easy drag-and-drop', '1000+ integrations', 'Multi-step workflows'],
      available: true
    },
    {
      id: 'n8n',
      name: 'N8N',
      description: 'Open-source workflow automation tool',
      icon: '🔧',
      color: 'from-orange-500 to-red-600',
      features: ['Self-hosted', 'Node-based editor', 'Custom functions'],
      available: true
    },
    {
      id: 'power-automate',
      name: 'Power Automate',
      description: 'Microsoft\'s cloud-based automation service',
      icon: '🔌',
      color: 'from-blue-600 to-indigo-700',
      features: ['Office 365 integration', 'AI-powered', 'Enterprise-ready'],
      available: false,
      comingSoon: true
    },
    {
      id: 'automate-io',
      name: 'Automate.io',
      description: 'Simple automation for your business',
      icon: '🚀',
      color: 'from-green-500 to-teal-600',
      features: ['Multi-app workflows', 'Easy setup', 'Business automation'],
      available: false,
      comingSoon: true
    }
  ];

  const difficultyLevels = [
    { id: 'all', label: 'All Levels', color: 'wc-level' },
    { id: 'beginner', label: 'Beginner', color: 'wc-level wc-level--beginner' },
    { id: 'intermediate', label: 'Intermediate', color: 'wc-level wc-level--intermediate' },
    { id: 'advanced', label: 'Advanced', color: 'wc-level wc-level--advanced' }
  ];

  // YouTube API Integration with key rotation
  const YOUTUBE_API_KEYS = [
    import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCk35ADtOhAbziEVuPZYdvQon3D9SBJ-U4',
    'AIzaSyAWFfu9CTq6kRS9TgSGXUJNP6kTE2TQ7yI', // New API key
    // Add more API keys for rotation
  ];
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState(0);
  
  const searchYouTubeTutorials = async (tool, query = '', difficulty = 'beginner') => {
    console.log(`🔍 searchYouTubeTutorials called with: tool="${tool}", query="${query}", difficulty="${difficulty}"`);
    
    // Don't make API call if tool is null or undefined
    if (!tool) {
      console.log('❌ No tool selected, skipping API call');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call backend API for scraped videos - get all videos at once
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://backend-production-cd9f.up.railway.app';
      
      // Try different endpoints
      let url = `${backendUrl}/api/videos/search?tool=${encodeURIComponent(tool)}&query=${encodeURIComponent(query)}&difficulty=${encodeURIComponent(difficulty)}`;
      
      console.log(`🌐 Calling backend for scraped videos: ${url}`);
      
      let response = await fetch(url);
      
      // If the main endpoint fails, try without query parameter
      if (!response.ok) {
        console.log('🔄 Main endpoint failed, trying without query parameter...');
        url = `${backendUrl}/api/videos/search?tool=${encodeURIComponent(tool)}&difficulty=${encodeURIComponent(difficulty)}`;
        console.log(`🌐 Trying alternative URL: ${url}`);
        response = await fetch(url);
      }
      
      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Log cache status
      if (data.fromCache) {
        console.log(`📚 Using scraped videos: ${data.videos?.length || 0} videos`);
        console.log(`🎯 Scraped for: ${tool} - ${difficulty}`);
        setTotalCachedVideos(data.totalVideos || 0);
        setApiStatus('cached');
      } else {
        console.log(`🌐 Fresh videos from YouTube API: ${data.videos?.length || 0} videos`);
        console.log(`🎯 Search query: "${query || 'N/A'}"`);
        setApiStatus('youtube');
      }
      
      // Pre-filter videos for relevance to the selected tool
      let videos = data.videos || [];
      
      // Filter out videos not relevant to the tool
      videos = videos.filter(video => {
        const toolName = selectedTool.toLowerCase();
        const title = (video.title || '').toLowerCase();
        const description = (video.description || '').toLowerCase();
        const channel = (video.channelTitle || '').toLowerCase();
        
        // Video must mention the tool in title, description, or channel
        return title.includes(toolName) || 
               description.includes(toolName) || 
               channel.includes(toolName) ||
               video.tool === toolName;
      });
      
      console.log(`📚 Loaded ${videos.length} relevant videos for ${selectedTool}`);
      
      // Set all videos but only display first 6
      setAllVideos(videos);
      setDisplayedVideos(videos.slice(0, videosPerPage));
      setTutorials({ videos }); // Keep for compatibility
      setLoadedVideoIds(new Set(videos.map(v => v.id)));
      setHasMoreVideos(videos.length > videosPerPage);
      setCurrentPage(0);
      setCachedVideosExhausted(false);
      setConsecutiveDuplicatePages(0);
    } catch (error) {
      console.error('Backend API failed:', error);
      setLoading(false);
      
      // No fallback - show empty state
      console.log('📚 Backend API failed - showing empty state');
      setTutorials({ videos: [] });
      setLoadedVideoIds(new Set());
      setTotalCachedVideos(0);
      setApiStatus('ready');
      setHasMoreVideos(false);
      setCachedVideosExhausted(false);
    } finally {
        setLoading(false);
      }
  };

  const generateMockTutorials = (tool, query, difficulty) => {
    const toolNames = {
      zapier: 'Zapier',
      n8n: 'N8N',
      'power-automate': 'Power Automate'
    };
    
    const channels = {
      zapier: ['Zapier Academy', 'Zapier Official', 'Automation Pro'],
      n8n: ['N8N Community', 'N8N Official', 'Workflow Master'],
      'power-automate': ['Microsoft Power Platform', 'Power Automate Pro', 'Office 365 Academy']
    };
    
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      title: `${toolNames[tool]} ${difficulty === 'all' ? 'Tutorial' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} ${i + 1}: ${getRandomTitle(tool, difficulty)}`,
      description: `Learn ${toolNames[tool]} ${difficulty} concepts with this comprehensive tutorial`,
      duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
      difficulty: difficulty === 'all' ? ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] : difficulty,
      views: Math.floor(Math.random() * 50000) + 1000,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg`,
      channel: channels[tool][Math.floor(Math.random() * channels[tool].length)],
      videoId: `video_${i + 1}`,
      publishedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
  };

  const getRandomTitle = (tool, difficulty) => {
    const titles = {
      zapier: {
        beginner: ['Your First Zap', 'Connecting Apps', 'Simple Automations'],
        intermediate: ['Multi-Step Zaps', 'Filters & Conditions', 'Advanced Triggers'],
        advanced: ['Custom Apps', 'Webhooks', 'Enterprise Features']
      },
      n8n: {
        beginner: ['Node Basics', 'Simple Workflows', 'Getting Started'],
        intermediate: ['Complex Logic', 'Error Handling', 'Data Processing'],
        advanced: ['Custom Nodes', 'Self-Hosting', 'Enterprise Setup']
      },
      make: {
        beginner: ['Scenario Building', 'Basic Connections', 'Simple Automations'],
        intermediate: ['Advanced Logic', 'Data Transformations', 'Complex Scenarios'],
        advanced: ['Custom Modules', 'API Integration', 'Enterprise Solutions']
      },
      'power-automate': {
        beginner: ['Flow Creation', 'Basic Triggers', 'Simple Actions'],
        intermediate: ['Conditional Logic', 'Data Operations', 'Advanced Triggers'],
        advanced: ['Custom Connectors', 'Premium Features', 'Enterprise Integration']
      }
    };
    
    const toolTitles = titles[tool]?.[difficulty] || titles[tool]?.beginner || ['Tutorial'];
    return toolTitles[Math.floor(Math.random() * toolTitles.length)];
  };

  // Mock data for tutorials (keeping for fallback)
  const mockTutorials = [
    {
      id: 1,
      title: 'Getting Started with Zapier: Your First Automation',
      description: 'Learn the basics of creating your first Zapier automation from scratch',
      duration: 480, // 8 minutes
      difficulty: 'beginner',
      views: 12500,
      rating: 4.8,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channel: 'Zapier Academy'
    },
    {
      id: 2,
      title: 'Advanced N8N Workflows: Error Handling & Debugging',
      description: 'Master error handling and debugging techniques in N8N',
      duration: 1200, // 20 minutes
      difficulty: 'advanced',
      views: 8500,
      rating: 4.9,
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
      channel: 'N8N Community'
    },
  ];

  // Mock data for challenges
  const mockChallenges = [
    {
      id: 1,
      title: 'E-commerce Order Processing Optimization',
      description: 'Your online store receives orders from multiple channels. Design an automation that processes, validates, and routes orders efficiently.',
      difficulty: 'intermediate',
      completionCount: 45,
      averageScore: 4.2,
      createdBy: 'Sarah Chen',
      tags: ['ecommerce', 'orders', 'validation'],
      submissions: 12
    },
    {
      id: 2,
      title: 'Lead Qualification & CRM Integration',
      description: 'Create a workflow that automatically qualifies leads and updates your CRM system based on lead behavior and engagement.',
      difficulty: 'advanced',
      completionCount: 23,
      averageScore: 4.5,
      createdBy: 'Mike Rodriguez',
      tags: ['crm', 'leads', 'qualification'],
      submissions: 8
    },
    {
      id: 3,
      title: 'Social Media Content Distribution',
      description: 'Build an automation that schedules and distributes content across multiple social media platforms with optimal timing.',
      difficulty: 'beginner',
      completionCount: 67,
      averageScore: 4.0,
      createdBy: 'Emma Wilson',
      tags: ['social-media', 'scheduling', 'content'],
      submissions: 15
    }
  ];

  useEffect(() => {
    setTutorials(mockTutorials);
    setChallenges(mockChallenges);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Filter displayed videos based on search
  const filteredTutorials = displayedVideos.filter(tutorial => {
    if (!tutorial) return false;
    
    const matchesSearch = searchQuery === '' || 
                         tutorial.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || tutorial.difficulty === difficultyFilter;
    
    return matchesSearch && matchesDifficulty;
  });

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || challenge.difficulty === difficultyFilter;
    const matchesTool = !selectedTool || challenge.tags.some(tag => tag.includes(selectedTool?.toLowerCase()));
    
    return matchesSearch && matchesDifficulty && matchesTool;
  });

  if (!selectedTool) {
    return (
      <section className="py-1">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Choose Your Automation Tool</h2>
            <p className="text-gray-300">
              Select your preferred automation tool to get personalized tutorials and challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => tool.available && setSelectedTool(tool.id)}
                className={`wc-card relative p-6 transition-all ${
                  tool.available 
                    ? 'wc-card--action cursor-pointer' 
                    : 'wc-card--soon cursor-not-allowed'
                } group`}
              >
                {tool.comingSoon && (
                  <div className="wc-badge absolute top-4 right-4">
                    Coming Soon
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`wc-tool-icon w-16 h-16 rounded-[14px] bg-gradient-to-r ${tool.color} flex items-center justify-center text-2xl ${!tool.available && 'grayscale'}`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{tool.name}</h3>
                    <p className="text-gray-300 mb-4">{tool.description}</p>
                    {tool.comingSoon && (
                      <div className="wc-note mb-3 px-3 py-1.5">
                        <p className="text-sm font-medium wc-note__text">
                          🎬 Curating high-quality videos for you...
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  return (
    <section className="py-1">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="wc-hero relative overflow-hidden">
          {/* Background with animated gradient */}
          <div className="wc-hero__bg absolute inset-0"></div>
          <div className="hidden"></div>
          
          {/* Animated background elements */}
          <div className="hidden"></div>
          <div className="hidden"></div>
          
          <div className="relative z-10 text-white p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-6 lg:space-y-0">
              {/* Left Content */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  <div className="wc-tool-icon w-16 h-16 rounded-[14px] bg-navy flex items-center justify-center text-3xl">
                    {selectedToolData.icon}
                  </div>
                  <div className="hidden"></div>
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-2xl lg:text-3xl font-bold mb-2 text-white">
                    {selectedToolData.name} Learning Hub
                  </h2>
                  <p className="text-gray-300">Master automation with personalized content and real-world challenges</p>
                </div>
              </div>
              {/* Right Content - Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setSelectedTool(null)}
                  className="btn-3d btn-3d--ghost btn-3d--sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Change Tool</span>
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="btn-3d btn-3d--sm"
                >
                  <Home className="w-4 h-4" />
                  <span>Visit My Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Login Tip Section - Separate */}
        <div className="mt-6 mb-4">
          <div className="wc-note wc-noop p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="wc-dot shrink-0"></div>
                <span className="text-gray-200 font-medium">💡 <strong>Pro Tip:</strong> Login to save your progress and unlock personalized recommendations</span>
              </div>
              <button className="btn-3d btn-3d--ghost btn-3d--sm whitespace-nowrap">
                Login Now
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10 mt-4">
          <div className="flex gap-2 overflow-x-auto px-1 pb-2 scrollbar-none">
            {[
              { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'recommended', label: 'Recommended', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`wc-tab flex items-center gap-2 py-2.5 px-3 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'is-active'
                    : ''
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="py-6">
          {activeTab === 'tutorials' && (
            <div>
              {/* Search and Filters */}
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tutorials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="wc-input w-full pl-10 pr-4 py-3"
                    />
                  </div>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => handleDifficultyChange(e.target.value)}
                    className="wc-input px-4 py-3"
                    style={{ colorScheme: 'dark' }}
                  >
                    {difficultyLevels.map(level => (
                      <option key={level.id} value={level.id}>{level.label}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="btn-3d"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </form>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                  <span className="ml-3 text-gray-300">Loading tutorials...</span>
                </div>
              )}


              {/* Tutorials Grid */}
              {!loading && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {filteredTutorials.map((tutorial) => (
                    <div key={tutorial.id} className="wc-card wc-card--action overflow-hidden">
                      <div className="relative">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            difficultyLevels.find(d => d.id === tutorial.difficulty)?.color
                          }`}>
                            {difficultyLevels.find(d => d.id === tutorial.difficulty)?.label}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-white bg-[rgba(13,16,36,0.85)] px-2 py-1 rounded-md">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{tutorial.duration ? formatDuration(tutorial.duration) : 'N/A'}</span>
                        </div>
                        
                        {/* Enhanced Quality Score Badge */}
                        {tutorial.quality_score && (
                          <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold ${
                            tutorial.quality_score >= 80 ? 'bg-green-500 text-white' :
                            tutorial.quality_score >= 60 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                          }`}>
                            {tutorial.quality_score}/100
                          </div>
                        )}
                        {tutorial.isSeries && (
                          <div className="absolute top-2 left-2">
                            <span className="wc-badge">
                              {tutorial.seriesType} {tutorial.seriesNumber}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2">{tutorial.title}</h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{(tutorial.viewCount !== undefined && tutorial.viewCount !== null) ? tutorial.viewCount.toLocaleString() : 'Views not available'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{tutorial.rating || 'N/A'}</span>
                          </div>
                        </div>
                        {/* Enhanced Quality Metrics */}
                        {tutorial.quality_score && (
                          <div className="mb-3 space-y-2">
                            {/* Overall Quality Score */}
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>Overall Quality</span>
                              <span className="font-semibold text-white">{tutorial.quality_score}/100</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  tutorial.quality_score >= 80 ? 'bg-green-500' :
                                  tutorial.quality_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${tutorial.quality_score}%` }}
                              ></div>
                            </div>

                            {/* Detailed Quality Breakdown */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {tutorial.content_quality_score && (
                                <div className="flex justify-between text-gray-400">
                                  <span>Content</span>
                                  <span className="font-medium text-white">{tutorial.content_quality_score}</span>
                                </div>
                              )}
                              {tutorial.educational_score && (
                                <div className="flex justify-between text-gray-400">
                                  <span>Educational</span>
                                  <span className="font-medium text-white">{tutorial.educational_score}</span>
                                </div>
                              )}
                              {tutorial.engagement_score && (
                                <div className="flex justify-between text-gray-400">
                                  <span>Engagement</span>
                                  <span className="font-medium text-white">{tutorial.engagement_score}</span>
                                </div>
                              )}
                              {tutorial.authority_score && (
                                <div className="flex justify-between text-gray-400">
                                  <span>Authority</span>
                                  <span className="font-medium text-white">{tutorial.authority_score}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Content Features */}
                        {(tutorial.has_timestamps || tutorial.has_code_examples || tutorial.has_hands_on_demo) && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {tutorial.has_timestamps && (
                                <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Timestamps
                                </span>
                              )}
                              {tutorial.has_code_examples && (
                                <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Settings className="w-3 h-3 mr-1" />
                                  Code Examples
                                </span>
                              )}
                              {tutorial.has_hands_on_demo && (
                                <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                                  <Play className="w-3 h-3 mr-1" />
                                  Hands-on Demo
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* User Ratings */}
                        {tutorial.user_ratings && tutorial.user_rating_count > 0 && (
                          <div className="mb-3 flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(tutorial.user_ratings) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
                                ))}
                              </div>
                              <span className="ml-1 text-gray-400">({tutorial.user_rating_count})</span>
                            </div>
                            <span className="text-gray-400">{tutorial.user_ratings}/5</span>
                          </div>
                        )}
                        {/* Tags */}
                        {tutorial.tags && tutorial.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {tutorial.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="chip">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <button 
                          onClick={() => window.open(tutorial.url || `https://www.youtube.com/watch?v=${tutorial.videoId || tutorial.id}`, '_blank')}
                          className="btn-3d btn-3d--sm w-full"
                        >
                          <Play className="w-4 h-4" />
                          <span>Watch Tutorial</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Loading More Videos */}
                {isLoadingMore && (
                  <div className="mt-8 flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
                    <p className="text-cyan-300 text-lg font-medium">🔍 Searching for more quality videos...</p>
                    <p className="text-gray-400 text-sm mt-2">Curating the best content for you</p>
                  </div>
                )}
                
                {/* Show More Indicator */}
                {!isLoadingMore && displayedVideos.length < allVideos.length && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      <span>Scroll down to load more videos ({allVideos.length - displayedVideos.length} more available)</span>
                    </div>
                  </div>
                )}
                
                {/* All Videos Loaded */}
                {displayedVideos.length >= allVideos.length && allVideos.length > 0 && (
                  <div className="mt-8 text-center py-6">
                    <div className="inline-flex flex-col items-center">
                      <div className="text-4xl mb-2">🎉</div>
                      <p className="text-gray-300 font-medium">You've seen all {allVideos.length} videos!</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more content</p>
                    </div>
                  </div>
                )}

                  {/* Scraped Videos Information */}
                  {apiStatus === 'cached' && tutorials.videos && tutorials.videos.length > 0 && (
                    <div className="col-span-full wc-note p-4 mb-4 mt-6">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-sm">🤖</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-white mb-2">
                            AI-Powered Video Discovery
                          </h3>
                          <p className="text-sm text-gray-300 mb-3">
                            These videos are intelligently scraped and analyzed using AI to provide you with the highest quality automation tutorials. Each video is scored for quality and usefulness.
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="text-gray-400">Features:</span>
                            <span className="chip">🤖 AI-analyzed content</span>
                            <span className="chip">⭐ Quality scored</span>
                            <span className="chip">🔄 Auto-updated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}


                  {/* Empty State */}
                  {filteredTutorials.length === 0 && !isLoadingMore && (
                    <div className="mt-8 text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No tutorials found</h3>
                      <p className="text-gray-300 mb-6">Try adjusting your search or difficulty filter</p>
                      <button 
                        onClick={() => {
                          setSearchQuery('');
                          setDifficultyFilter('beginner');
                          searchYouTubeTutorials(selectedTool, '', 'beginner');
                        }}
                        className="btn-3d"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'challenges' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Real-World Automation Challenges</h3>
                <p className="text-gray-300">Tackle practical business problems and build your automation skills</p>
              </div>

              {/* Challenges List */}
              <div className="space-y-6">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="wc-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            difficultyLevels.find(d => d.id === challenge.difficulty)?.color
                          }`}>
                            {difficultyLevels.find(d => d.id === challenge.difficulty)?.label}
                          </span>
                        </div>
                        <p className="text-gray-300 mb-4">{challenge.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {challenge.tags.map((tag, index) => (
                            <span key={index} className="chip">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.completionCount} completed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{challenge.averageScore}/5.0 avg</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{challenge.submissions} submissions</span>
                        </div>
                      </div>
                      <button className="btn-3d btn-3d--sm wc-noop">
                        <Target className="w-4 h-4" />
                        <span>Start Challenge</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recommended' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Recommended for You</h3>
                <p className="text-gray-300">Based on your learning progress and interests</p>
              </div>
              
              <div className="grid gap-6">
                {/* Recommended Tutorials */}
                <div className="wc-card p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-white">Tutorials You Might Like</h4>
                  </div>
                  <div className="space-y-4">
                    {tutorials.length > 0 ? tutorials.slice(0, 2).map((tutorial) => (
                      <div key={tutorial.id} className="wc-row flex items-center space-x-4 p-4">
                        <img 
                          src={tutorial.thumbnail} 
                          alt={tutorial.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{tutorial.title}</h5>
                          <p className="text-gray-300 text-sm">{tutorial.channel}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor(tutorial.duration / 60)}:{(tutorial.duration % 60).toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-gray-400">
                        <BookOpen className="w-8 h-8 mx-auto mb-2" />
                        <p>No tutorials available yet</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Challenges */}
                <div className="wc-card p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-lg font-semibold text-white">Challenges for Your Level</h4>
                  </div>
                  <div className="space-y-4">
                    {mockChallenges.slice(0, 2).map((challenge) => (
                      <div key={challenge.id} className="wc-row p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-white font-medium mb-2">{challenge.title}</h5>
                            <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="wc-level wc-level--beginner">
                                {challenge.difficulty}
                              </span>
                              <span>{challenge.estimatedTime}</span>
                            </div>
                          </div>
                          <button className="btn-3d btn-3d--sm wc-noop">
                            Try It
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkflowChallenger;
