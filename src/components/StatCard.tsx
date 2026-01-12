import type { ReactNode } from 'react';


interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  gradient: string;
}

export default function StatCard({ title, value, icon, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
         
        </div>
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}