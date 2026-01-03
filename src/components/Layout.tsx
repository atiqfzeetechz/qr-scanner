import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  QrCode,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Scan
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useLoaderStore } from '../store/loaderStore';
import { theme } from '../theme';
import { showConfirm, showToast } from '../utils/sweetAlert';
import logo from '../assets/logo.png';

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
}

interface LayoutProps {
  children: ReactNode;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Generate QR', href: '/admin/generate', icon: Plus },
  { name: 'Scan QR', href: '/admin/scan', icon: Scan },
  { name: 'QR History', href: '/admin/history', icon: History },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showLoader, hideLoader } = useLoaderStore();

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => {
      const isCurrentlyExpanded = prev.includes(menuName);
      if (isCurrentlyExpanded) {
        // Close the current menu
        return prev.filter(name => name !== menuName);
      } else {
        // Close all other menus and open the current one
        return [menuName];
      }
    });
  };

  const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName);

  const isActiveMenu = (item: NavigationItem): boolean => {
    if (item.href && location.pathname === item.href) return true;
    if (item.children) {
      return item.children.some(child => child.href === location.pathname);
    }
    return false;
  };

  const getCurrentPageName = () => {
    const currentPath = location.pathname;

    // Check for exact matches first
    for (const item of navigation) {
      if (item.href === currentPath) {
        return item.name;
      }

      // Check children
      if (item.children) {
        for (const child of item.children) {
          if (child.href === currentPath) {
            return `${item.name} / ${child.name}`;
          }
        }
      }
    }

    return 'Dashboard'; // Default fallback
  };

  const handleLogout = async () => {
    const result = await showConfirm(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      'Yes, Logout',
      'Cancel'
    );

    if (result.isConfirmed) {
      showLoader('Logging out...');

      // Simulate logout delay
      setTimeout(() => {
        logout();
        hideLoader();
        showToast('success', 'Logged out successfully!');
        navigate('/admin/login');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {/* <img src={logo} alt="QR Manager" className="w-8 h-8" /> */}
              <img src={logo} alt="QR Manager" style={{
                  scale:.46
                }} />
              {/* <span className="text-xl font-bold text-gray-900">QR Manager</span> */}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = isActiveMenu(item);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = isMenuExpanded(item.name);

                return (
                  <li key={item.name}>
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          style={isActive ? { background: theme.gradients.primary } : {}}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            {item.name}
                          </div>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        {isExpanded && (
                          <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                            {item.children?.map((child) => (
                              <li key={child.name}>
                                <Link
                                  to={child.href!}
                                  onClick={() => setSidebarOpen(false)}
                                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === child.href
                                    ? 'text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  style={location.pathname === child.href ? { background: theme.gradients.primary } : {}}
                                >
                                  <child.icon size={16} className="text-gray-400" />
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href!}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        style={isActive ? { background: theme.gradients.primary } : {}}
                      >
                        <item.icon size={20} />
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 px-3 py-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: theme.gradients.primary }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}>
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-2">
                <img src={logo} alt="QR Manager" style={{
                  scale:.46
                }} />
                {/* <span className="text-xl font-bold text-gray-900">QR Manager</span> */}
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <img src={logo} alt="QR Manager" className="w-8 h-8" />
              </div>
            )}
            {sidebarCollapsed && <div
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-md p-1.5 text-gray-400 bg-gray-100 hover:text-gray-600 transition-colors"
              style={{
                position: "absolute",
                right: sidebarCollapsed ? '-15px' : '0px'
              }}>
              <ChevronRight size={18} />
            </div>}

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? null : <ChevronLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = isActiveMenu(item);
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = isMenuExpanded(item.name);

                return (
                  <li key={item.name}>
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() => toggleSubmenu(item.name)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors group relative ${sidebarCollapsed ? 'justify-center px-2' : ''
                            } ${isActive
                              ? 'text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          style={isActive ? { background: theme.gradients.primary } : {}}
                          title={sidebarCollapsed ? item.name : ''}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            {!sidebarCollapsed && item.name}
                          </div>
                          {!sidebarCollapsed && (
                            isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                          )}
                          {sidebarCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                              {item.name}
                            </div>
                          )}
                        </button>

                        {!sidebarCollapsed && isExpanded && (
                          <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                            {item.children?.map((child) => (
                              <li key={child.name}>
                                <Link
                                  to={child.href!}
                                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${location.pathname === child.href
                                    ? 'text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                  style={location.pathname === child.href ? { background: theme.gradients.primary } : {}}
                                >
                                  <child.icon size={16} className="text-gray-400" />
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href!}
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors group relative ${sidebarCollapsed ? 'justify-center px-2' : ''
                          } ${isActive
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        style={isActive ? { background: theme.gradients.primary } : {}}
                        title={sidebarCollapsed ? item.name : ''}
                      >
                        <item.icon size={20} />
                        {!sidebarCollapsed && item.name}
                        {sidebarCollapsed && (
                          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-gray-200 p-4">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: theme.gradients.primary }}>
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <LogOut size={18} />
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: theme.gradients.primary }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 transition-colors group relative"
                  title="Sign out"
                >
                  <LogOut size={18} />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    Sign out
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}>
        {/* Header */}
        <header
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 text-white shadow-md"
          style={{ background: theme.gradients.primary }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-1.5 text-white hover:bg-white/10 transition-colors lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="lg:hidden flex items-center gap-2">
              <img src={logo} alt="QR Manager" className="w-8 h-8" />
              {/* <span className="text-lg font-bold">QR Manager</span> */}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <span className="text-lg font-bold">{getCurrentPageName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-medium">
              Welcome, <span className="font-semibold">{user?.name || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="relative">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow" style={{ background: theme.gradients.primary }}>
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-gray-100/50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}