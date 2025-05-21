import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('features');

  // Feature toggle states
  const [featureToggles, setFeatureToggles] = useState({
    portfolioSharing: true,
    apiAccess: false,
    userRegistration: true,
    advancedAnalytics: true,
    twoFactorAuth: true,
  });

  // Global parameters
  const [globalParams, setGlobalParams] = useState({
    defaultCurrency: 'USD',
    priceUpdateFrequency: '60',
    sessionTimeout: '30',
    maxLoginAttempts: '5',
  });

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    automaticBackups: true,
    errorReporting: true,
    anonymousMetrics: true,
  });

  // Updates a feature toggle
  const updateFeatureToggle = (feature: keyof typeof featureToggles, value: boolean) => {
    setFeatureToggles(prev => ({
      ...prev,
      [feature]: value,
    }));
  };

  // Updates a global parameter
  const updateGlobalParam = (param: keyof typeof globalParams, value: string) => {
    setGlobalParams(prev => ({
      ...prev,
      [param]: value,
    }));
  };

  // Updates a system setting
  const updateSystemSetting = (setting: keyof typeof systemSettings, value: boolean) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Save feature toggles
  const saveFeatureToggles = () => {
    // This would save the feature toggles to the server
    toast({
      title: 'Features saved',
      description: 'Feature toggles have been updated.',
    });
  };

  // Save global parameters
  const saveGlobalParams = () => {
    // This would save the global parameters to the server
    toast({
      title: 'Parameters saved',
      description: 'Global parameters have been updated.',
    });
  };

  // Save system settings
  const saveSystemSettings = () => {
    // This would save the system settings to the server
    toast({
      title: 'Settings saved',
      description: 'System settings have been updated.',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Feature Toggles</TabsTrigger>
          <TabsTrigger value="params">Global Parameters</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Feature Toggles */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
              <CardDescription>
                Enable or disable features throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Portfolio Sharing */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Portfolio Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to share their portfolios via public links.
                    </p>
                  </div>
                  <Switch
                    checked={featureToggles.portfolioSharing}
                    onCheckedChange={(value) => updateFeatureToggle('portfolioSharing', value)}
                  />
                </div>

                <Separator />

                {/* API Access */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">API Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to generate API keys for external applications.
                    </p>
                  </div>
                  <Switch
                    checked={featureToggles.apiAccess}
                    onCheckedChange={(value) => updateFeatureToggle('apiAccess', value)}
                  />
                </div>

                <Separator />

                {/* User Registration */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">User Registration</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new users to register accounts.
                    </p>
                  </div>
                  <Switch
                    checked={featureToggles.userRegistration}
                    onCheckedChange={(value) => updateFeatureToggle('userRegistration', value)}
                  />
                </div>

                <Separator />

                {/* Advanced Analytics */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Advanced Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed portfolio performance analytics.
                    </p>
                  </div>
                  <Switch
                    checked={featureToggles.advancedAnalytics}
                    onCheckedChange={(value) => updateFeatureToggle('advancedAnalytics', value)}
                  />
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to enable two-factor authentication.
                    </p>
                  </div>
                  <Switch
                    checked={featureToggles.twoFactorAuth}
                    onCheckedChange={(value) => updateFeatureToggle('twoFactorAuth', value)}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={saveFeatureToggles}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Parameters */}
        <TabsContent value="params">
          <Card>
            <CardHeader>
              <CardTitle>Global Parameters</CardTitle>
              <CardDescription>
                Configure global settings that affect the entire application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Default Currency */}
                <div className="space-y-2">
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select
                    value={globalParams.defaultCurrency}
                    onValueChange={(value) => updateGlobalParam('defaultCurrency', value)}
                  >
                    <SelectTrigger id="default-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Update Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="price-update-frequency">Price Update Frequency (seconds)</Label>
                  <Input
                    id="price-update-frequency"
                    type="number"
                    min="10"
                    max="600"
                    value={globalParams.priceUpdateFrequency}
                    onChange={(e) => updateGlobalParam('priceUpdateFrequency', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    How often to update cryptocurrency prices. Minimum 10 seconds.
                  </p>
                </div>

                {/* Session Timeout */}
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="120"
                    value={globalParams.sessionTimeout}
                    onChange={(e) => updateGlobalParam('sessionTimeout', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long before inactive sessions are logged out. Minimum 5 minutes.
                  </p>
                </div>

                {/* Max Login Attempts */}
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input
                    id="max-login-attempts"
                    type="number"
                    min="1"
                    max="10"
                    value={globalParams.maxLoginAttempts}
                    onChange={(e) => updateGlobalParam('maxLoginAttempts', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of failed login attempts before account lockout.
                  </p>
                </div>

                <div className="pt-4">
                  <Button onClick={saveGlobalParams}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure critical system settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the application in maintenance mode. Only administrators can access the site.
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(value) => updateSystemSetting('maintenanceMode', value)}
                  />
                </div>

                <Separator />

                {/* Automatic Backups */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automatic daily database backups.
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.automaticBackups}
                    onCheckedChange={(value) => updateSystemSetting('automaticBackups', value)}
                  />
                </div>

                <Separator />

                {/* Error Reporting */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Error Reporting</Label>
                    <p className="text-sm text-muted-foreground">
                      Send anonymous error reports to improve the application.
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.errorReporting}
                    onCheckedChange={(value) => updateSystemSetting('errorReporting', value)}
                  />
                </div>

                <Separator />

                {/* Anonymous Usage Metrics */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Anonymous Usage Metrics</Label>
                    <p className="text-sm text-muted-foreground">
                      Collect anonymous usage data to improve user experience.
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.anonymousMetrics}
                    onCheckedChange={(value) => updateSystemSetting('anonymousMetrics', value)}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={saveSystemSettings}>Save Changes</Button>
                </div>

                {/* Database Backup */}
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-2">Database Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create backups and manage your database.
                  </p>

                  <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <Button variant="outline">Create Backup</Button>
                    <Button variant="outline">View Backups</Button>
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
