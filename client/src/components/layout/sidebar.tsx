import { useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, Users, Settings, FileText, LogOut } from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();

  const menuItems = [
    {
      title: 'Overview',
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      href: '/admin',
      active: location === '/admin',
    },
    {
      title: 'User Management',
      icon: <Users className="mr-2 h-4 w-4" />,
      href: '/admin/users',
      active: location === '/admin/users',
    },
    {
      title: 'System Settings',
      icon: <Settings className="mr-2 h-4 w-4" />,
      href: '/admin/settings',
      active: location === '/admin/settings',
    },
    {
      title: 'Activity Logs',
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: '/admin/logs',
      active: location === '/admin/logs',
    },
  ];

  return (
    <div className={cn('pb-12 w-64 border-r hidden md:block', className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 flex items-center border-b mb-4">
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
            className="h-6 w-6 text-primary mr-2"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="text-xl font-bold">CryptoFolio</span>
          <span className="bg-primary/10 text-primary text-xs ml-2 px-1.5 py-0.5 rounded">Admin</span>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.href)}
                className={cn(
                  'w-full justify-start',
                  item.active && 'bg-primary/10 text-primary hover:bg-primary/20',
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 absolute bottom-0 left-0 right-0 p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
