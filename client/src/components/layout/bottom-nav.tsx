import { useLocation } from 'wouter';
import { Wallet, TrendingUp, LineChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Portfolio',
      icon: <Wallet size={24} />,
    },
    {
      path: '/market',
      label: 'Market',
      icon: <TrendingUp size={24} />,
    },
    {
      path: '/activity',
      label: 'Activity',
      icon: <LineChart size={24} />,
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings size={24} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border bg-background z-50">
      <nav className="flex justify-around py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className="flex flex-col items-center p-2 w-full"
            >
              <div
                className={cn(
                  'flex flex-col items-center transition-all duration-200',
                  isActive ? 'text-primary -translate-y-1' : 'text-muted-foreground',
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
