import { useLoaderStore } from '../store/loaderStore';
import { theme } from '../theme';

export default function GlobalLoader() {
  const { isLoading, message } = useLoaderStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm mx-4">
        <div className="relative">
          <div 
            className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-transparent animate-spin"
            style={{ borderTopColor: theme.colors.primary.main }}
          />
          <div 
            className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-transparent animate-spin"
            style={{ 
              borderLeftColor: theme.colors.secondary.main,
              animationDirection: 'reverse',
              animationDuration: '1.5s'
            }}
          />
        </div>
        {message && (
          <p className="text-gray-700 text-center font-medium">{message}</p>
        )}
        <p className="text-gray-500 text-sm text-center">Please wait...</p>
      </div>
    </div>
  );
}