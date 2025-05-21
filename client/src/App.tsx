import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute, AdminRoute } from '@/lib/protected-route';
import NotFound from '@/pages/not-found';
import LandingPage from '@/pages/landing-page';
import UserDashboard from '@/pages/user-dashboard';
import AdminDashboard from '@/pages/admin-dashboard';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      <Route path="/login">
        <LoginPage />
      </Route>

      <Route path="/register">
        <RegisterPage />
      </Route>



      {/* User Dashboard Routes */}
      <ProtectedRoute path="/portfolio" component={UserDashboard} />
      <ProtectedRoute path="/market" component={UserDashboard} />
      <ProtectedRoute path="/activity" component={UserDashboard} />
      <ProtectedRoute path="/settings" component={UserDashboard} />

      {/* Admin Dashboard Routes */}
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/users" component={AdminDashboard} />
      <AdminRoute path="/admin/settings" component={AdminDashboard} />
      <AdminRoute path="/admin/logs" component={AdminDashboard} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
