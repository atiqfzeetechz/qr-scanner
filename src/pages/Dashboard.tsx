import { Package, Users, DollarSign, Truck, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { mockDashboardStats, mockOrders } from '../mockData';
import { theme } from '../theme';

export default function Dashboard() {
  const recentOrders = mockOrders.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={mockDashboardStats.totalOrders}
          icon={<Package size={24} />}
          trend={mockDashboardStats.ordersGrowth}
          gradient={theme.gradients.primary}
        />
        <StatCard
          title="Active Orders"
          value={mockDashboardStats.activeOrders}
          icon={<TrendingUp size={24} />}
          gradient={theme.gradients.secondary}
        />
        <StatCard
          title="Total Revenue"
          value={`$${mockDashboardStats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          trend={mockDashboardStats.revenueGrowth}
          gradient={theme.gradients.dark}
        />
        <StatCard
          title="Total Users"
          value={mockDashboardStats.totalUsers}
          icon={<Users size={24} />}
          gradient={theme.gradients.primary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Truck
                          size={16}
                          style={{
                            color:
                              order.vehicleType === 'truck'
                                ? theme.colors.navy.main
                                : theme.colors.secondary.main,
                          }}
                        />
                        <span className="text-sm text-gray-700 capitalize">
                          {order.vehicleType}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">
                      ${order.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Drivers</span>
                <span className="font-bold text-gray-900">
                  {mockDashboardStats.totalDrivers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Vehicles</span>
                <span className="font-bold text-gray-900">
                  {mockDashboardStats.totalVehicles}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Order Value</span>
                <span className="font-bold text-gray-900">
                  $
                  {(
                    mockDashboardStats.totalRevenue / mockDashboardStats.totalOrders
                  ).toFixed(0)}
                </span>
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
                <span>API Status</span>
                <span className="bg-green-400 px-2 py-1 rounded text-xs font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Database</span>
                <span className="bg-green-400 px-2 py-1 rounded text-xs font-medium">
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
