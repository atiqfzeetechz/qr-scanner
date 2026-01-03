import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLoaderStore } from '../store/loaderStore';
import { theme } from '../theme';
import logo from '../assets/logo.png';
import { showToast } from '../utils/sweetAlert';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { showLoader, hideLoader } = useLoaderStore();
  const [email, setEmail] = useState('Qrcode@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    showLoader('Logging you in...');

    try {
      if(email!=="Qrcode@example.com"){
        return showToast('error', 'Invalid Credenttials')
      }
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: theme.gradients.primary }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-46 h-46 flex items-center justify-center">
              <img src={logo} alt="QR Manager" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none transition-all pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white rounded-lg font-semibold transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: theme.gradients.primary }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">Demo Credentials:</p>
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> Qrcode@example.com
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Password:</span> any password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}