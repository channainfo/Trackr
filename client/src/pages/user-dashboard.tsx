import { useLocation } from 'wouter';
import Header from '@/components/layout/header';
import BottomNav from '@/components/layout/bottom-nav';
import PortfolioView from './portfolio-view';
import MarketView from './market-view';
import ActivityView from './activity-view';
import SettingsView from './settings-view';

export default function UserDashboard() {
  const [location] = useLocation();

  // Determine which view to show based on route
  let currentView = 'portfolio';

  if (location === '/market') {
    currentView = 'market';
  } else if (location === '/activity') {
    currentView = 'activity';
  } else if (location === '/settings') {
    currentView = 'settings';
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pb-16 md:pb-0 container mx-auto px-4 py-6">
        {currentView === 'portfolio' && <PortfolioView />}
        {currentView === 'market' && <MarketView />}
        {currentView === 'activity' && <ActivityView />}
        {currentView === 'settings' && <SettingsView />}
      </main>

      <BottomNav />
    </div>
  );
}
