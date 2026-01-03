import { QrCode, Scan, History, BarChart3, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { theme } from '../theme';

export default function Dashboard() {
  const qrStats = {
    totalGenerated: 156,
    totalScanned: 89,
    todayGenerated: 12,
    todayScanned: 8,
    generatedGrowth: 15.3,
    scannedGrowth: 8.7
  };

  const recentActivity = [
    { id: 1, type: 'generated', data: 'https://example.com', time: '2 minutes ago' },
    { id: 2, type: 'scanned', data: 'Contact: John Doe', time: '5 minutes ago' },
    { id: 3, type: 'generated', data: 'Welcome Message', time: '10 minutes ago' },
    { id: 4, type: 'scanned', data: 'Product Info', time: '15 minutes ago' },
    { id: 5, type: 'generated', data: 'Event Details', time: '20 minutes ago' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to QR Code Manager! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Generated"
          value={qrStats.totalGenerated}
          icon={<QrCode size={24} />}
          trend={qrStats.generatedGrowth}
          gradient={theme.gradients.primary}
        />
        <StatCard
          title="Total Scanned"
          value={qrStats.totalScanned}
          icon={<Scan size={24} />}
          trend={qrStats.scannedGrowth}
          gradient={theme.gradients.secondary}
        />
        <StatCard
          title="Today Generated"
          value={qrStats.todayGenerated}
          icon={<TrendingUp size={24} />}
          gradient={theme.gradients.dark}
        />
        <StatCard
          title="Today Scanned"
          value={qrStats.todayScanned}
          icon={<BarChart3 size={24} />}
          gradient={theme.gradients.primary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary.main}20` }}>
                  {activity.type === 'generated' ? (
                    <QrCode size={20} style={{ color: theme.colors.primary.main }} />
                  ) : (
                    <Scan size={20} style={{ color: theme.colors.primary.main }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.type === 'generated' ? 'Generated QR Code' : 'Scanned QR Code'}
                  </p>
                  <p className="text-sm text-gray-600 truncate">{activity.data}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-bold text-gray-900">98.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Daily Usage</span>
                <span className="font-bold text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Most Used Type</span>
                <span className="font-bold text-gray-900">URL</span>
              </div>
            </div>
          </div>

          <div
            className="rounded-xl shadow-sm p-6 text-white"
            style={{ background: theme.gradients.secondary }}
          >
            <h3 className="text-lg font-bold mb-2">System Status</h3>
            <p className="text-sm text-white/90 mb-4">All systems operational</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>QR Generator</span>
                <span className="bg-green-400 px-2 py-1 rounded text-xs font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Scanner</span>
                <span className="bg-green-400 px-2 py-1 rounded text-xs font-medium">
                  Ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
