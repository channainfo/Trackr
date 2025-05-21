import { useLocation } from 'wouter';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useState } from 'react';
import AdminOverview from './admin/overview';
import AdminUsers from './admin/users';
import AdminSettings from './admin/settings';
import AdminLogs from './admin/logs';
import { LayoutDashboard, Users, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const [location] = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Determine which view to show based on route
  let currentView = 'overview';

  if (location === '/admin/users') {
    currentView = 'users';
  } else if (location === '/admin/settings') {
    currentView = 'settings';
  } else if (location === '/admin/logs') {
    currentView = 'logs';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />

        {/* Mobile menu overlay */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* Mobile menu */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 bg-background border-r md:hidden transform transition-transform duration-200 ${
            showMobileMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </div>

        <main className="flex-1 pb-16 md:pb-0">
          {/* Mobile menu toggle */}
          <div className="flex items-center p-4 md:hidden border-b">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowMobileMenu(true)}
              className="mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
            <span className="font-semibold">Admin Dashboard</span>
          </div>

          <div className="container p-4">
            {currentView === 'overview' && <AdminOverview />}
            {currentView === 'users' && <AdminUsers />}
            {currentView === 'settings' && <AdminSettings />}
            {currentView === 'logs' && <AdminLogs />}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation for admin dashboard */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background z-40">
        <nav className="flex justify-around py-2">
          <Button
            variant={currentView === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            className="flex flex-col items-center py-2 h-auto w-full"
            onClick={() => window.location.href = '/admin'}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Overview</span>
          </Button>
          <Button
            variant={currentView === 'users' ? 'secondary' : 'ghost'}
            size="sm"
            className="flex flex-col items-center py-2 h-auto w-full"
            onClick={() => window.location.href = '/admin/users'}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Users</span>
          </Button>
          <Button
            variant={currentView === 'settings' ? 'secondary' : 'ghost'}
            size="sm"
            className="flex flex-col items-center py-2 h-auto w-full"
            onClick={() => window.location.href = '/admin/settings'}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
          <Button
            variant={currentView === 'logs' ? 'secondary' : 'ghost'}
            size="sm"
            className="flex flex-col items-center py-2 h-auto w-full"
            onClick={() => window.location.href = '/admin/logs'}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs mt-1">Logs</span>
          </Button>
        </nav>
      </div>
    </div>
  );
}
