interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, string>;
}

export default function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const colorClass = colorMap[status] || 'bg-gray-100 text-gray-700';
  
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}