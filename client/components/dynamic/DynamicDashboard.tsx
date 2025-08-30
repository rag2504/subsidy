import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Leaf, 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Activity,
  RefreshCw,
  Zap,
  Globe,
  Database
} from 'lucide-react';
import { 
  apiClient, 
  DashboardStats, 
  ProjectData, 
  SubsidyData, 
  NotificationData,
  apiUtils 
} from '@/lib/api';
import DashboardCard from './DashboardCard';
import DataTable, { columnRenderers } from './DataTable';
import LiveCharts, { chartConfigs, useLiveChartData } from './LiveCharts';
import NotificationBanner, { LiveNotificationBanner } from './NotificationBanner';
import IEADataChart from './IEADataChart';

interface DynamicDashboardProps {
  className?: string;
}

export default function DynamicDashboard({ className = '' }: DynamicDashboardProps) {
  // State for dynamic data
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [subsidies, setSubsidies] = useState<SubsidyData[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  
  // External API data states
  const [eiaEnergyData, setEiaEnergyData] = useState<EIAEnergyData | null>(null);
  const [wattTimeData, setWattTimeData] = useState<WattTimeCarbonData | null>(null);
  const [euHydrogenProjects, setEuHydrogenProjects] = useState<HydrogenProjectData[]>([]);
  const [ieaData, setIeaData] = useState<IEAData[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real-time chart data
  const liveSubsidyData = useLiveChartData(chartConfigs.subsidyTrend.data, 10000);
  const liveGh2Data = useLiveChartData(chartConfigs.gh2Production.data, 15000);
  const liveCarbonData = useLiveChartData(chartConfigs.carbonCredits.data, 12000);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel including external APIs
        const [
          stats, 
          projectsData, 
          subsidiesData, 
          notificationsData,
          eiaData,
          wattTimeData,
          euProjects,
          ieaHistoricalData
        ] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getProjects(),
          apiClient.getSubsidies(),
          apiClient.getNotifications(),
          apiClient.getEIAEnergyData(),
          apiClient.getWattTimeCarbonIntensity(),
          apiClient.getEuropeanHydrogenProjects(),
          apiClient.getIEAHydrogenData(),
        ]);

        setDashboardStats(stats);
        setProjects(projectsData);
        setSubsidies(subsidiesData);
        setNotifications(notificationsData);
        setEiaEnergyData(eiaData);
        setWattTimeData(wattTimeData);
        setEuHydrogenProjects(euProjects);
        setIeaData(ieaHistoricalData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Set up real-time updates
  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeStats = apiClient.subscribe('dashboard-stats', (data: DashboardStats) => {
      setDashboardStats(data);
    });

    const unsubscribeProjects = apiClient.subscribe('projects', (data: ProjectData[]) => {
      setProjects(data);
    });

    const unsubscribeSubsidies = apiClient.subscribe('subsidies', (data: SubsidyData[]) => {
      setSubsidies(data);
    });

    const unsubscribeNotifications = apiClient.subscribe('notifications', (data: NotificationData[]) => {
      setNotifications(data);
    });

    // Start real-time updates
    apiClient.startRealTimeUpdates();

    // Cleanup subscriptions
    return () => {
      unsubscribeStats();
      unsubscribeProjects();
      unsubscribeSubsidies();
      unsubscribeNotifications();
      apiClient.stopRealTimeUpdates();
    };
  }, []);

  // Handle notification actions
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await apiClient.markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  // Refresh data
  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);

      const [stats, projectsData, subsidiesData, notificationsData] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getProjects(),
        apiClient.getSubsidies(),
        apiClient.getNotifications(),
      ]);

      setDashboardStats(stats);
      setProjects(projectsData);
      setSubsidies(subsidiesData);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Failed to refresh data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Project table columns
  const projectColumns = [
    { key: 'name', label: 'Project Name', sortable: true },
    { key: 'producerName', label: 'Producer', sortable: true },
    { 
      key: 'totalSubsidy', 
      label: 'Total Subsidy', 
      sortable: true,
      render: columnRenderers.currency 
    },
    { 
      key: 'disbursedAmount', 
      label: 'Disbursed', 
      sortable: true,
      render: columnRenderers.currency 
    },
    { 
      key: 'gh2Volume', 
      label: 'GH₂ Volume (kg)', 
      sortable: true,
      render: (value: number) => apiUtils.formatNumber(value)
    },
    { 
      key: 'carbonCredits', 
      label: 'Carbon Credits', 
      sortable: true,
      render: (value: number) => apiUtils.formatNumber(value)
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: columnRenderers.status 
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      sortable: true,
      render: columnRenderers.date 
    },
  ];

  // Subsidy table columns
  const subsidyColumns = [
    { key: 'projectId', label: 'Project ID', sortable: true },
    { key: 'producerName', label: 'Producer', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: columnRenderers.currency 
    },
    { key: 'milestone', label: 'Milestone', sortable: true },
    { 
      key: 'gh2Volume', 
      label: 'GH₂ Volume (kg)', 
      sortable: true,
      render: (value: number) => apiUtils.formatNumber(value)
    },
    { 
      key: 'carbonCredits', 
      label: 'Carbon Credits', 
      sortable: true,
      render: (value: number) => apiUtils.formatNumber(value)
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: columnRenderers.status 
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      sortable: true,
      render: columnRenderers.relativeTime 
    },
  ];

  if (loading && !dashboardStats) {
    return (
      <div className={`space-y-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Live Notification Banner */}
      <LiveNotificationBanner />

      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            <span className="text-gradient">Dynamic Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300">
            Real-time subsidy tracking with live updates and blockchain integration
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-secondary"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="glass-card p-4 rounded-xl border border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <div className="w-4 h-4 text-red-400">⚠️</div>
            </div>
            <div className="flex-1">
              <p className="text-red-400 font-medium">Error</p>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRefresh}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Subsidy Released"
          value={dashboardStats?.totalSubsidyReleased || 0}
          subtitle="This month"
          icon={<DollarSign className="w-6 h-6 text-white" />}
          trend={{ value: dashboardStats?.monthlyGrowth || 0, isPositive: true }}
          loading={loading}
          error={!!error}
        />
        <DashboardCard
          title="Active Projects"
          value={dashboardStats?.activeProjects || 0}
          subtitle="Currently running"
          icon={<Activity className="w-6 h-6 text-white" />}
          trend={{ value: 12.5, isPositive: true }}
          loading={loading}
          error={!!error}
        />
        <DashboardCard
          title="GH₂ Volume Verified"
          value={dashboardStats?.gh2VolumeVerified || 0}
          subtitle="kg CO₂ equivalent"
          icon={<Leaf className="w-6 h-6 text-white" />}
          trend={{ value: 8.3, isPositive: true }}
          loading={loading}
          error={!!error}
        />
        <DashboardCard
          title="Success Rate"
          value={`${dashboardStats?.successRate || 0}%`}
          subtitle="Processing efficiency"
          icon={<Shield className="w-6 h-6 text-white" />}
          trend={{ value: 0.2, isPositive: true }}
          loading={loading}
          error={!!error}
        />
      </div>

      {/* Live Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveCharts
          type="line"
          data={liveSubsidyData}
          title="Subsidy Disbursement Trend"
          subtitle="Real-time monthly subsidy release amounts"
          loading={loading}
          error={!!error}
        />
        <LiveCharts
          type="bar"
          data={liveGh2Data}
          title="GH₂ Production Growth"
          subtitle="Quarterly production volumes"
          loading={loading}
          error={!!error}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveCharts
          type="area"
          data={liveCarbonData}
          title="Carbon Credits Generated"
          subtitle="Weekly carbon credit accumulation"
          loading={loading}
          error={!!error}
        />
        <LiveCharts
          type="bar"
          data={chartConfigs.projectStatus.data}
          title="Project Status Distribution"
          subtitle="Current project status breakdown"
          loading={loading}
          error={!!error}
        />
      </div>

      {/* IEA Historical Data Chart */}
      <IEADataChart
        data={ieaData}
        loading={loading}
        error={!!error}
      />

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataTable
          data={projects}
          columns={projectColumns}
          loading={loading}
          error={!!error}
          onRefresh={handleRefresh}
          onRowClick={(project) => {
            console.log('Project clicked:', project);
            // Navigate to project details
          }}
        />
        <DataTable
          data={subsidies}
          columns={subsidyColumns}
          loading={loading}
          error={!!error}
          onRefresh={handleRefresh}
          onRowClick={(subsidy) => {
            console.log('Subsidy clicked:', subsidy);
            // Navigate to subsidy details
          }}
        />
      </div>

      {/* External API Data Integration */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">External Data Integration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* EIA Energy Data */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">EIA Energy Data</span>
            </div>
            <p className="text-gray-400 text-xs mb-2">Real-time energy generation</p>
            {eiaEnergyData ? (
              <div className="text-green-400 text-sm font-medium">
                {apiUtils.formatNumber(eiaEnergyData.data[0]?.value || 0)} MWh
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Loading...</div>
            )}
          </div>

          {/* WattTime Carbon Intensity */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">Carbon Intensity</span>
            </div>
            <p className="text-gray-400 text-xs mb-2">Grid emissions (gCO₂/MWh)</p>
            {wattTimeData ? (
              <div className={`text-sm font-medium ${wattTimeData.value > 300 ? 'text-red-400' : 'text-green-400'}`}>
                {wattTimeData.value} gCO₂/MWh
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Loading...</div>
            )}
          </div>

          {/* EU Hydrogen Projects */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">EU Projects</span>
            </div>
            <p className="text-gray-400 text-xs mb-2">European Hydrogen Observatory</p>
            <div className="text-blue-400 text-sm font-medium">
              {euHydrogenProjects.length} Projects
            </div>
          </div>

          {/* IEA Historical Data */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">IEA Data</span>
            </div>
            <p className="text-gray-400 text-xs mb-2">Historical & forecasting</p>
            <div className="text-orange-400 text-sm font-medium">
              {ieaData.length} Data Points
            </div>
          </div>
        </div>

        {/* EU Projects Table */}
        {euHydrogenProjects.length > 0 && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-4">European Hydrogen Projects</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-gray-400">Project</th>
                    <th className="text-left py-2 text-gray-400">Country</th>
                    <th className="text-left py-2 text-gray-400">Capacity</th>
                    <th className="text-left py-2 text-gray-400">Technology</th>
                    <th className="text-left py-2 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {euHydrogenProjects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-2 text-white">{project.name}</td>
                      <td className="py-2 text-gray-400">{project.country}</td>
                      <td className="py-2 text-gray-400">{project.capacity} MW</td>
                      <td className="py-2 text-gray-400">{project.technology}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'Operational' ? 'bg-green-500/20 text-green-400' :
                          project.status === 'Under Construction' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Blockchain Integration Status */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Database className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Blockchain Integration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Ethereum Network</p>
              <p className="text-gray-400 text-sm">Connected</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Smart Contracts</p>
              <p className="text-gray-400 text-sm">Deployed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <p className="text-white font-medium">Transaction Sync</p>
              <p className="text-gray-400 text-sm">Live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
