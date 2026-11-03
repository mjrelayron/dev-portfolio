import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  BarChart3,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const BACKEND_URL = 'https://backend-production-cd9f.up.railway.app';

const ScrapingDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [hideFailedJobs, setHideFailedJobs] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [jobDetails, setJobDetails] = useState(null);
  const [backendOffline, setBackendOffline] = useState(false); // shown instead of a misleading empty state

  // New job form
  const [newJob, setNewJob] = useState({
    job_name: '',
    tool: 'all',
    max_videos_per_term: 50,
    min_quality_score: 60
  });

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh job details when modal is open and job is running
  useEffect(() => {
    if (showJobDetails && jobDetails?.job?.status === 'running') {
      const interval = setInterval(() => {
        if (jobDetails?.job?.id) {
          fetchJobDetails(jobDetails.job.id);
        }
      }, 5000); // Refresh every 5 seconds for running jobs
      return () => clearInterval(interval);
    }
  }, [showJobDetails, jobDetails?.job?.status, jobDetails?.job?.id]);

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, statsRes, schedulesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/jobs/jobs?limit=20`),
        fetch(`${BACKEND_URL}/api/jobs/dashboard/stats`),
        fetch(`${BACKEND_URL}/api/jobs/schedules`)
      ]);
      setBackendOffline(false);

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (schedulesRes.ok) {
        const schedulesData = await schedulesRes.json();
        setSchedules(schedulesData.schedules || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setBackendOffline(true);
    }
  };

  const createJob = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/jobs/jobs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob)
      });

      if (response.ok) {
        await fetchDashboardData();
        setShowCreateJob(false);
        setNewJob({
          job_name: '',
          tool: 'all',
          max_videos_per_term: 50,
          min_quality_score: 60
        });
      }
    } catch (error) {
      console.error('Failed to create job:', error);
    } finally {
      setLoading(false);
    }
  };

  const startJob = async (jobId) => {
    try {
      await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}/start`, {
        method: 'POST'
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to start job:', error);
    }
  };

  const pauseJob = async (jobId) => {
    try {
      await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}/pause`, {
        method: 'POST'
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to pause job:', error);
    }
  };

  const cancelJob = async (jobId) => {
    try {
      await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}/cancel`, {
        method: 'POST'
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  };

  const toggleSchedule = async (scheduleId) => {
    try {
      await fetch(`${BACKEND_URL}/api/jobs/schedules/${scheduleId}/toggle`, {
        method: 'PATCH'
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const bulkDeleteFailedJobs = async () => {
    if (!confirm('Are you sure you want to delete all failed jobs? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/jobs/bulk/failed`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete failed jobs');
      }
    } catch (error) {
      console.error('Failed to bulk delete failed jobs:', error);
      alert('Failed to delete failed jobs');
    }
  };

  const deleteSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/schedules/${scheduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete schedule');
      }
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('Failed to delete schedule');
    }
  };

  const cleanupDuplicateSchedules = async () => {
    if (!confirm('Are you sure you want to delete all duplicate schedules? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/schedules/bulk/cleanup`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        await fetchDashboardData();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to cleanup duplicate schedules');
      }
    } catch (error) {
      console.error('Failed to cleanup duplicate schedules:', error);
      alert('Failed to cleanup duplicate schedules');
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setJobDetails(data);
        setShowJobDetails(true);
      } else {
        alert('Failed to fetch job details');
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      alert('Failed to fetch job details');
    }
  };

  const rerunJob = async (jobId) => {
    if (!confirm('Are you sure you want to re-run this job? This will create a new job with the same settings.')) {
      return;
    }

    try {
      setLoading(true);
      
      // Get the original job details
      const jobResponse = await fetch(`${BACKEND_URL}/api/jobs/jobs/${jobId}`);
      if (!jobResponse.ok) {
        throw new Error('Failed to fetch job details');
      }
      
      const jobData = await jobResponse.json();
      const originalJob = jobData.job;
      
      // Create a new job with the same settings
      const createResponse = await fetch(`${BACKEND_URL}/api/jobs/jobs/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_name: `${originalJob.job_name || `Job #${originalJob.id}`} (Re-run)`,
          tool: originalJob.tool,
          max_videos_per_term: originalJob.max_videos_per_term,
          min_quality_score: originalJob.min_quality_score
        })
      });

      if (createResponse.ok) {
        const newJobData = await createResponse.json();
        const newJob = newJobData.job;
        
        // Start the new job immediately
        await fetch(`${BACKEND_URL}/api/jobs/jobs/${newJob.id}/start`, {
          method: 'POST'
        });
        
        alert(`New job created and started! Job ID: ${newJob.id}`);
        await fetchDashboardData();
        setShowJobDetails(false);
      } else {
        throw new Error('Failed to create new job');
      }
    } catch (error) {
      console.error('Failed to re-run job:', error);
      alert('Failed to re-run job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <Square className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'cancelled':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="lab-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="chip">
            <BarChart3 className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            Live · {BACKEND_URL.replace('https://', '')}
          </span>
          <p className="text-gray-400">Monitor and control video scraping jobs</p>
        </div>

        {backendOffline && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-4" role="status">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-400" aria-hidden="true" />
            <div>
              <p className="font-semibold text-white">Can't reach the scraping backend right now</p>
              <p className="text-sm text-gray-300">The Railway service may be asleep or blocking this origin. Job data will appear once it responds — try Refresh in a moment.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="lab-tile p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Running Jobs</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.running_jobs || 0}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            </div>

            <div className="lab-tile p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-400">{stats.completed_jobs || 0}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="lab-tile p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Failed</p>
                  <p className="text-3xl font-bold text-red-400">{stats.failed_jobs || 0}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="lab-tile p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Videos Scraped</p>
                  <p className="text-3xl font-bold text-cyan-400">{stats.total_videos_scraped || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateJob(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Scraping Job</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="flex items-center space-x-2 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>

          {stats && stats.failed_jobs > 0 && (
            <button
              onClick={bulkDeleteFailedJobs}
              className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete All Failed ({stats.failed_jobs})</span>
            </button>
          )}

          <button
            onClick={() => setHideFailedJobs(!hideFailedJobs)}
            className={`flex items-center space-x-2 border px-6 py-3 rounded-lg transition-all ${
              hideFailedJobs
                ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            {hideFailedJobs ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            <span>{hideFailedJobs ? 'Show Failed' : 'Hide Failed'}</span>
          </button>

          {schedules.length > 1 && (
            <button
              onClick={cleanupDuplicateSchedules}
              className="flex items-center space-x-2 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-6 py-3 rounded-lg hover:bg-orange-500/30 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              <span>Cleanup Duplicate Schedules</span>
            </button>
          )}
        </div>

        {/* Create Job Modal */}
        {showCreateJob && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Create New Scraping Job</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Job Name</label>
                  <input
                    type="text"
                    value={newJob.job_name}
                    onChange={(e) => setNewJob({ ...newJob, job_name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., Daily scrape for Zapier"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Tool</label>
                  <select
                    value={newJob.tool}
                    onChange={(e) => setNewJob({ ...newJob, tool: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Tools</option>
                    <option value="zapier">Zapier</option>
                    <option value="n8n">n8n</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Max Videos Per Term</label>
                  <input
                    type="number"
                    value={newJob.max_videos_per_term}
                    onChange={(e) => setNewJob({ ...newJob, max_videos_per_term: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Min Quality Score</label>
                  <input
                    type="number"
                    value={newJob.min_quality_score}
                    onChange={(e) => setNewJob({ ...newJob, min_quality_score: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={createJob}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Job'}
                </button>
                <button
                  onClick={() => setShowCreateJob(false)}
                  className="flex-1 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetails && jobDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Job Details: {jobDetails.job?.job_name || `Job #${jobDetails.job?.id}`}
                </h2>
                <button
                  onClick={() => setShowJobDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Job Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Status</p>
                  <p className={`text-lg font-semibold ${getStatusColor(jobDetails.job?.status).replace('border', 'text').replace('px-3 py-1 text-xs font-medium rounded-full', '')}`}>
                    {jobDetails.job?.status?.toUpperCase()}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Tool</p>
                  <p className="text-lg font-semibold text-white">{jobDetails.job?.tool || 'all'}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Videos Found</p>
                  <p className="text-lg font-semibold text-white">{jobDetails.job?.total_videos_found || 0}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Videos Saved</p>
                  <p className="text-lg font-semibold text-white">{jobDetails.job?.total_videos_saved || 0}</p>
                </div>
              </div>

              {/* Error Message */}
              {jobDetails.job?.last_error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                  <h3 className="text-red-400 font-semibold mb-2">Error Details:</h3>
                  <p className="text-red-300 text-sm font-mono bg-black/20 p-3 rounded border">
                    {jobDetails.job.last_error}
                  </p>
                </div>
              )}

              {/* Progress */}
              {jobDetails.progress && jobDetails.progress.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Progress History</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {jobDetails.progress.map((entry, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">{entry.current_search_term}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(entry.started_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Processed: {entry.videos_processed_in_batch} | Inserted: {entry.videos_inserted_in_batch}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logs */}
              {jobDetails.logs && jobDetails.logs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Job Logs</h3>
                  <div className="bg-black/20 border border-white/10 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <div className="space-y-1 font-mono text-sm">
                      {jobDetails.logs.map((log, index) => (
                        <div key={index} className={`flex items-start space-x-2 ${
                          log.log_level === 'error' ? 'text-red-400' :
                          log.log_level === 'warning' ? 'text-yellow-400' :
                          'text-gray-300'
                        }`}>
                          <span className="text-gray-500 text-xs mt-0.5 w-16 flex-shrink-0">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-gray-400 text-xs w-16 flex-shrink-0 uppercase">
                            [{log.log_level}]
                          </span>
                          <span className="flex-1">{log.log_message || log.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* No logs message */}
              {(!jobDetails.logs || jobDetails.logs.length === 0) && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No logs available for this job yet.</p>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-6">
                {jobDetails.job?.status === 'failed' && (
                  <button
                    onClick={() => rerunJob(jobDetails.job.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Re-running...' : 'Re-run Job'}
                  </button>
                )}
                <button
                  onClick={() => setShowJobDetails(false)}
                  className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Jobs List */}
        <div className="lab-tile p-5 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Jobs</h2>
            <p className="text-sm text-gray-400">Click on any job to view detailed logs and progress</p>
          </div>
          
          <div className="space-y-4">
            {jobs.filter(job => !hideFailedJobs || job.status !== 'failed').length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">
                  {hideFailedJobs 
                    ? 'No non-failed jobs to display. Toggle "Show Failed" to see all jobs.' 
                    : 'No scraping jobs yet. Create one to get started!'
                  }
                </p>
              </div>
            ) : (
              jobs
                .filter(job => !hideFailedJobs || job.status !== 'failed')
                .map((job) => (
                <div
                  key={job.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-cyan-400/40 transition-all cursor-pointer"
                  onClick={() => fetchJobDetails(job.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(job.status)}
                        <h3 className="text-lg font-semibold text-white">{job.job_name || `Job #${job.id}`}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(job.status)}`}>
                          {job.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-3">
                        <div>
                          <span className="text-gray-500">Tool:</span> {job.tool || 'all'}
                        </div>
                        <div>
                          <span className="text-gray-500">Found:</span> {job.total_videos_found || 0}
                        </div>
                        <div>
                          <span className="text-gray-500">Saved:</span> {job.total_videos_saved || 0}
                        </div>
                        <div>
                          <span className="text-gray-500">Progress:</span> {job.completed_search_terms || 0}/{job.total_search_terms || 0}
                        </div>
                      </div>

                      {job.status === 'running' && job.current_search_term && (
                        <div className="mb-2">
                          <p className="text-sm text-cyan-400">Currently: {job.current_search_term}</p>
                          <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(job.completed_search_terms / job.total_search_terms) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      {job.status === 'pending' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startJob(job.id); }}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                          title="Start"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}

                      {job.status === 'running' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); pauseJob(job.id); }}
                          className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all"
                          title="Pause"
                        >
                          <Pause className="w-5 h-5" />
                        </button>
                      )}

                      {job.status === 'paused' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startJob(job.id); }}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                          title="Resume"
                        >
                          <Play className="w-5 h-5" />
                        </button>
                      )}

                      {(job.status === 'running' || job.status === 'paused' || job.status === 'pending') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); cancelJob(job.id); }}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                          title="Cancel"
                        >
                          <Square className="w-5 h-5" />
                        </button>
                      )}

                      {job.status === 'failed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); rerunJob(job.id); }}
                          className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all"
                          title="Re-run Job"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      )}

                      {(job.status === 'failed' || job.status === 'completed' || job.status === 'cancelled') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteJob(job.id); }}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Schedules */}
        <div className="lab-tile p-5">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-cyan-400" />
            Automated Schedules
          </h2>

          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{schedule.schedule_name}</h3>
                  <p className="text-sm text-gray-400">Cron: {schedule.cron_expression} | Tool: {schedule.tool}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total runs: {schedule.total_runs || 0} | Success: {schedule.successful_runs || 0} | Failed: {schedule.failed_runs || 0}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      schedule.is_active
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {schedule.is_active ? 'Active' : 'Inactive'}
                  </button>
                  
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                    title="Delete Schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapingDashboard;

