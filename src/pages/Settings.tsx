import { useState } from "react";
import { Settings as SettingsIcon, Shield, Bell, Database, Users, Activity, Save, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export default function Settings() {
  const [settings, setSettings] = useState({
    // System Settings
    systemName: "Campus Security Monitoring",
    systemVersion: "1.0.0",
    maintenanceMode: false,
    dataRetentionDays: 90,
    
    // Security Settings
    enableBiometricAuth: true,
    enableDeviceFingerprinting: true,
    enableLocationTracking: true,
    alertThreshold: 0.7,
    maxFailedAttempts: 3,
    
    // ML Settings
    enablePredictions: true,
    predictionConfidence: 0.8,
    modelUpdateFrequency: 24,
    enableExplainableAI: true,
    
    // Notification Settings
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    enablePushNotifications: true,
    alertFrequency: "immediate",
    quietHoursStart: "22:00",
    quietHoursEnd: "06:00",
    
    // Data Sources
    enableSwipeLogs: true,
    enableWifiLogs: true,
    enableBookingSystem: true,
    enableCCTV: true,
    enableHelpdesk: true,
    
    // Privacy Settings
    anonymizeData: false,
    dataEncryption: true,
    auditLogging: true,
    gdprCompliance: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      systemName: "Campus Security Monitoring",
      systemVersion: "1.0.0",
      maintenanceMode: false,
      dataRetentionDays: 90,
      enableBiometricAuth: true,
      enableDeviceFingerprinting: true,
      enableLocationTracking: true,
      alertThreshold: 0.7,
      maxFailedAttempts: 3,
      enablePredictions: true,
      predictionConfidence: 0.8,
      modelUpdateFrequency: 24,
      enableExplainableAI: true,
      enableEmailAlerts: true,
      enableSMSAlerts: false,
      enablePushNotifications: true,
      alertFrequency: "immediate",
      quietHoursStart: "22:00",
      quietHoursEnd: "06:00",
      enableSwipeLogs: true,
      enableWifiLogs: true,
      enableBookingSystem: true,
      enableCCTV: true,
      enableHelpdesk: true,
      anonymizeData: false,
      dataEncryption: true,
      auditLogging: true,
      gdprCompliance: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Configure campus security monitoring system</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
        <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset to Defaults
        </Button>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="ml">ML Engine</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Basic system settings and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.systemName}
                    onChange={(e) => handleSettingChange('systemName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemVersion">Version</Label>
                  <Input
                    id="systemVersion"
                    value={settings.systemVersion}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataRetentionDays">Data Retention (Days)</Label>
                <Input
                  id="dataRetentionDays"
                  type="number"
                  value={settings.dataRetentionDays}
                  onChange={(e) => handleSettingChange('dataRetentionDays', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable system for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">System Status</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">Database</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">ML Engine</span>
                    <Badge variant="default">Running</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm font-medium">API Services</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Configuration
              </CardTitle>
              <CardDescription>
                Security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Authentication Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Biometric Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable biometric scanning for entity identification
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBiometricAuth}
                      onCheckedChange={(checked) => handleSettingChange('enableBiometricAuth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Device Fingerprinting</Label>
                      <p className="text-sm text-muted-foreground">
                        Track devices for enhanced security
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableDeviceFingerprinting}
                      onCheckedChange={(checked) => handleSettingChange('enableDeviceFingerprinting', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Location Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track entity locations for security monitoring
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableLocationTracking}
                      onCheckedChange={(checked) => handleSettingChange('enableLocationTracking', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Alert Thresholds</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Alert Confidence Threshold</Label>
                    <div className="px-3">
                      <Slider
                        value={[settings.alertThreshold * 100]}
                        onValueChange={([value]) => handleSettingChange('alertThreshold', value / 100)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>{Math.round(settings.alertThreshold * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFailedAttempts">Max Failed Attempts</Label>
                    <Input
                      id="maxFailedAttempts"
                      type="number"
                      value={settings.maxFailedAttempts}
                      onChange={(e) => handleSettingChange('maxFailedAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Engine Settings */}
        <TabsContent value="ml" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Machine Learning Configuration
              </CardTitle>
              <CardDescription>
                ML prediction engine and model settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Prediction Engine</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Predictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable ML-based activity predictions
                      </p>
                    </div>
                    <Switch
                      checked={settings.enablePredictions}
                      onCheckedChange={(checked) => handleSettingChange('enablePredictions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Explainable AI</Label>
                      <p className="text-sm text-muted-foreground">
                        Provide explanations for ML predictions
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableExplainableAI}
                      onCheckedChange={(checked) => handleSettingChange('enableExplainableAI', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Model Configuration</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Prediction Confidence Threshold</Label>
                    <div className="px-3">
                      <Slider
                        value={[settings.predictionConfidence * 100]}
                        onValueChange={([value]) => handleSettingChange('predictionConfidence', value / 100)}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>{Math.round(settings.predictionConfidence * 100)}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="modelUpdateFrequency">Model Update Frequency (Hours)</Label>
                    <Input
                      id="modelUpdateFrequency"
                      type="number"
                      value={settings.modelUpdateFrequency}
                      onChange={(e) => handleSettingChange('modelUpdateFrequency', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Model Performance</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Accuracy</div>
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-xs text-muted-foreground">Current model</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Precision</div>
                    <div className="text-2xl font-bold text-blue-600">91.8%</div>
                    <div className="text-xs text-muted-foreground">Prediction quality</div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-sm font-medium">Recall</div>
                    <div className="text-2xl font-bold text-purple-600">89.5%</div>
                    <div className="text-xs text-muted-foreground">Detection rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Configuration
              </CardTitle>
              <CardDescription>
                Alert and notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send alerts via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableEmailAlerts}
                      onCheckedChange={(checked) => handleSettingChange('enableEmailAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send critical alerts via SMS
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSMSAlerts}
                      onCheckedChange={(checked) => handleSettingChange('enableSMSAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send push notifications to mobile devices
                      </p>
                    </div>
                    <Switch
                      checked={settings.enablePushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('enablePushNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Alert Frequency</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Alert Frequency</Label>
                    <Select
                      value={settings.alertFrequency}
                      onValueChange={(value) => handleSettingChange('alertFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="batched">Batched (5 min)</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursStart">Quiet Hours Start</Label>
                      <Input
                        id="quietHoursStart"
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietHoursEnd">Quiet Hours End</Label>
                      <Input
                        id="quietHoursEnd"
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Settings */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Privacy & Data Protection
              </CardTitle>
              <CardDescription>
                Data privacy and compliance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data Sources</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Swipe Logs</Label>
                      <p className="text-sm text-muted-foreground">
                        Process card swipe data
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSwipeLogs}
                      onCheckedChange={(checked) => handleSettingChange('enableSwipeLogs', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Wi-Fi Logs</Label>
                      <p className="text-sm text-muted-foreground">
                        Process Wi-Fi connection data
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableWifiLogs}
                      onCheckedChange={(checked) => handleSettingChange('enableWifiLogs', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Booking System</Label>
                      <p className="text-sm text-muted-foreground">
                        Process room/equipment bookings
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableBookingSystem}
                      onCheckedChange={(checked) => handleSettingChange('enableBookingSystem', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>CCTV Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Process CCTV footage data
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableCCTV}
                      onCheckedChange={(checked) => handleSettingChange('enableCCTV', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Helpdesk Integration</Label>
                      <p className="text-sm text-muted-foreground">
                        Process helpdesk ticket data
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableHelpdesk}
                      onCheckedChange={(checked) => handleSettingChange('enableHelpdesk', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Privacy Controls</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Anonymization</Label>
                      <p className="text-sm text-muted-foreground">
                        Anonymize personal data in logs
                      </p>
                    </div>
                    <Switch
                      checked={settings.anonymizeData}
                      onCheckedChange={(checked) => handleSettingChange('anonymizeData', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Encryption</Label>
                      <p className="text-sm text-muted-foreground">
                        Encrypt stored data
                      </p>
                    </div>
                    <Switch
                      checked={settings.dataEncryption}
                      onCheckedChange={(checked) => handleSettingChange('dataEncryption', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log all system access and changes
                      </p>
                    </div>
                    <Switch
                      checked={settings.auditLogging}
                      onCheckedChange={(checked) => handleSettingChange('auditLogging', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>GDPR Compliance</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable GDPR compliance features
                      </p>
                    </div>
                    <Switch
                      checked={settings.gdprCompliance}
                      onCheckedChange={(checked) => handleSettingChange('gdprCompliance', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Data Export & Deletion</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Export User Data
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Request Data Deletion
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
