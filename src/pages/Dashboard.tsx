import { QrCode, Scan, BarChart3, TrendingUp, FileText, Image, Activity, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import { theme } from '../theme';
import { useAxios } from '../hooks/useAxios';
import { useEffect, useState } from 'react';

interface DashboardData {
  stats: {
    totalQRs: number;
    totalTemplates: number;
    totalLogos: number;
    activeQRs: number;
    recentQRs: number;
    totalDownloads: number;
  };
  charts: {
    qrTrend: Array<{ _id: string; count: number }>;
    templateUsage: Array<{ templateName: string; count: number }>;
  };
}

export default function Dashboard() {
  const { get } = useAxios()

  const [data, setData] = useState<DashboardData>({
    stats: {
      totalQRs: 0,
      totalTemplates: 0,
      totalLogos: 0,
      activeQRs: 0,
      recentQRs: 0,
      totalDownloads: 0
    },
    charts: {
      qrTrend: [],
      templateUsage: []
    }
  })
  
  const getDashboardData = async () => {
    try {
      const res = await get('/admin/dashboard/stats')
      console.log(res)
      if(res.success){
        setData(res.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    getDashboardData()
  }, [])


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to QR Code Manager! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total QR Codes"
          value={data.stats.totalQRs}
          icon={<QrCode size={24} />}
          trend={data.stats.recentQRs}
          gradient={theme.gradients.primary}
        />
        <StatCard
          title="Templates"
          value={data.stats.totalTemplates}
          icon={<FileText size={24} />}
          gradient={theme.gradients.secondary}
        />
        <StatCard
          title="Logos"
          value={data.stats.totalLogos}
          icon={<Image size={24} />}
          gradient={theme.gradients.dark}
        />
        <StatCard
          title="Active QRs"
          value={data.stats.activeQRs}
          icon={<Activity size={24} />}
          gradient={theme.gradients.primary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">QR Generation Trend</h2>
          <div className="space-y-4">
            {data.charts.qrTrend.length > 0 ? (
              data.charts.qrTrend.map((trend, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${theme.colors.primary.main}20` }}>
                    <QrCode size={20} style={{ color: theme.colors.primary.main }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {trend.count} QR Codes Generated
                    </p>
                    <p className="text-sm text-gray-600">{trend._id}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <QrCode size={48} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Template Usage</h3>
            <div className="space-y-4">
              {data.charts.templateUsage.length > 0 ? (
                data.charts.templateUsage.map((template, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600">{template.templateName}</span>
                    <span className="font-bold text-gray-900">{template.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No template usage data</p>
                </div>
              )}
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
