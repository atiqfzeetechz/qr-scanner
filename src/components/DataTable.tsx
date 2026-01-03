import type { ReactNode } from 'react';
import { Search, Grid3X3, List, MoreVertical } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  renderGridItem: (item: any) => ReactNode;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
}

export default function DataTable({
  data,
  columns,
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  viewMode,
  onViewModeChange,
  renderGridItem,
  emptyMessage = "No data found",
  emptyIcon
}: DataTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-3">
          {filters}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-2 ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="tableHeight overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
            {data.map((item) => renderGridItem(item))}
          </div>
        </div>
      ) : (
        <div className="tableHeight overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    {column.label}
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4">
                      {column.render ? column.render(item[column.key], item) : (
                        <span className="text-sm text-gray-700">{item[column.key]}</span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={16} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-12">
          {emptyIcon}
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}