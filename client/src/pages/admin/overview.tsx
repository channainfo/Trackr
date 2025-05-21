import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Users, Wallet, PieChart, UserPlus, ArrowUp, ArrowDown } from 'lucide-react';

export default function AdminOverview() {
  // Query for admin dashboard stats
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  // Query for activity logs
  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['/api/admin/logs'],
  });

  // Calculate some stats from users
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(user => !user.isAdmin).length || 0;

  // Get recent activity
  const recentActivity = activityLogs?.slice(0, 5) || [];

  // Random stats for demonstration
  const statsCards = [
    {
      title: 'Total Users',
      value: totalUsers,
      description: '+12% from last month',
      icon: <Users className="h-8 w-8" />,
      iconClass: 'text-indigo-500 bg-indigo-500/10',
      trend: 'up',
    },
    {
      title: 'Active Portfolios',
      value: activeUsers,
      description: '+8% from last month',
      icon: <Wallet className="h-8 w-8" />,
      iconClass: 'text-green-500 bg-green-500/10',
      trend: 'up',
    },
    {
      title: 'Tracked Assets',
      value: '12,584',
      description: '+23% from last month',
      icon: <PieChart className="h-8 w-8" />,
      iconClass: 'text-blue-500 bg-blue-500/10',
      trend: 'up',
    },
    {
      title: 'New Sign Ups',
      value: '137',
      description: '-3% from last month',
      icon: <UserPlus className="h-8 w-8" />,
      iconClass: 'text-purple-500 bg-purple-500/10',
      trend: 'down',
    },
  ];

  // User growth data (would come from API)
  const monthlyGrowth = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 150 },
    { month: 'Mar', users: 180 },
    { month: 'Apr', users: 170 },
    { month: 'May', users: 210 },
    { month: 'Jun', users: 250 },
  ];

  // Find the maximum value for scaling
  const maxUsers = Math.max(...monthlyGrowth.map(data => data.users));

  // Format date for activity logs
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  // Get icon and class for activity types
  function getActivityIcon(action: string) {
    if (action === 'user_registered') {
      return {
        icon: <UserPlus className="h-4 w-4" />,
        className: 'bg-green-500/20 text-green-500',
      };
    } else if (action.includes('login')) {
      return {
        icon: <Users className="h-4 w-4" />,
        className: 'bg-blue-500/20 text-blue-500',
      };
    } else {
      return {
        icon: <Wallet className="h-4 w-4" />,
        className: 'bg-indigo-500/20 text-indigo-500',
      };
    }
  }

  if (isLoadingUsers || isLoadingLogs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.iconClass}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-xs flex items-center">
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Growth Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>Monthly user registration trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between px-2">
            {monthlyGrowth.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-primary w-12 rounded-t-sm transition-all duration-500 ease-in-out"
                  style={{ height: `${(data.users / maxUsers) * 100}%` }}
                ></div>
                <div className="text-xs mt-2 text-muted-foreground">{data.month}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent activity to display</p>
            ) : (
              recentActivity.map((activity, index) => {
                const { icon, className } = getActivityIcon(activity.action);
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${className}`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-medium">{activity.action.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        User ID: {activity.userId || 'System'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
