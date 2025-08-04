'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Key, Database, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });

  const [apiSettings, setApiSettings] = useState({
    openaiKey: '',
    defaultModel: 'gpt-4',
  });

  const [dbPreferences, setDbPreferences] = useState({
    defaultTimeout: '30',
    maxRows: '1000',
    autoSave: true,
  });

  const [notifications, setNotifications] = useState({
    queryComplete: true,
    errorAlerts: true,
    weeklyReport: false,
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-amber-500" />
              User Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2 text-amber-500" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure your AI model settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API Key</Label>
              <Input
                id="openaiKey"
                type="password"
                placeholder="sk-..."
                value={apiSettings.openaiKey}
                onChange={(e) => setApiSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                Your API key is stored securely and never shared
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultModel">Default Model</Label>
              <Input
                id="defaultModel"
                value={apiSettings.defaultModel}
                onChange={(e) => setApiSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Database Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-amber-500" />
              Database Preferences
            </CardTitle>
            <CardDescription>
              Configure database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timeout">Query Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                value={dbPreferences.defaultTimeout}
                onChange={(e) => setDbPreferences(prev => ({ ...prev, defaultTimeout: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxRows">Max Rows to Return</Label>
              <Input
                id="maxRows"
                type="number"
                value={dbPreferences.maxRows}
                onChange={(e) => setDbPreferences(prev => ({ ...prev, maxRows: e.target.value }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-save Queries</Label>
                <p className="text-xs text-gray-500">
                  Automatically save successful queries to history
                </p>
              </div>
              <Switch
                checked={dbPreferences.autoSave}
                onCheckedChange={(checked) => setDbPreferences(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-amber-500" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Query Completion</Label>
                <p className="text-xs text-gray-500">
                  Get notified when queries finish running
                </p>
              </div>
              <Switch
                checked={notifications.queryComplete}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, queryComplete: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Error Alerts</Label>
                <p className="text-xs text-gray-500">
                  Get notified when queries fail
                </p>
              </div>
              <Switch
                checked={notifications.errorAlerts}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, errorAlerts: checked }))}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Weekly Reports</Label>
                <p className="text-xs text-gray-500">
                  Receive weekly usage reports
                </p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyReport: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600"
          >
            {saving ? (
              <>
                <Settings className="h-4 w-4 mr-2 animate-spin" />
                Saving Settings...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}