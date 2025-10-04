import { useState, useMemo } from "react";
import { Shield, AlertTriangle, Eye, MapPin, Clock, Users, Activity, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { campusEntities, activityRecords, securityAlerts, getEntityStats } from "@/lib/campus-data";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Security() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const entityStats = getEntityStats();
  const activeAlerts = securityAlerts.filter(alert => alert.status === 'active');

  // Generate security metrics data
  const securityMetrics = useMemo(() => {
    const now = new Date();
    const timeRanges = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    
    const range = timeRanges[selectedTimeRange as keyof typeof timeRanges];
    const cutoff = new Date(now.getTime() - range);
    
    const recentActivities = activityRecords.filter(activity => 
      activity.timestamp >= cutoff
    );
    
    const recentAlerts = securityAlerts.filter(alert => 
      alert.timestamp >= cutoff
    );

    return {
      totalActivities: recentActivities.length,
      predictedActivities: recentActivities.filter(a => a.isPredicted).length,
      securityIncidents: recentAlerts.length,
      resolutionRate: entityStats.resolutionRate,
      averageConfidence: recentActivities.reduce((sum, a) => sum + a.confidence, 0) / recentActivities.length || 0,
    };
  }, [selectedTimeRange, entityStats.resolutionRate]);

  // Generate chart data
  const activityTrendData = useMemo(() => {
    const hours = selectedTimeRange === "24h" ? 24 : selectedTimeRange === "7d" ? 7 : 30;
    const interval = selectedTimeRange === "24h" ? 1 : selectedTimeRange === "7d" ? 1 : 1;
    const data = [];
    
    for (let i = hours - 1; i >= 0; i -= interval) {
      const time = new Date(Date.now() - i * (selectedTimeRange === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
      const activities = activityRecords.filter(a => {
        const activityTime = new Date(a.timestamp);
        return activityTime >= time && activityTime < new Date(time.getTime() + (selectedTimeRange === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));
      });
      
      data.push({
        time: selectedTimeRange === "24h" ? `${time.getHours()}:00` : time.toLocaleDateString(),
        activities: activities.length,
        predicted: activities.filter(a => a.isPredicted).length,
        regular: activities.filter(a => !a.isPredicted).length,
      });
    }
    
    return data;
  }, [selectedTimeRange]);

  const locationData = useMemo(() => {
    const locationCounts: { [key: string]: number } = {};
    activityRecords.forEach(activity => {
      locationCounts[activity.location] = (locationCounts[activity.location] || 0) + 1;
    });
    
    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  const alertSeverityData = useMemo(() => {
    const severityCounts = securityAlerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(severityCounts).map(([severity, count]) => ({
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      count,
      color: severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f97316' : severity === 'medium' ? '#eab308' : '#22c55e'
    }));
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Monitoring</h1>
        <p className="text-muted-foreground">Real-time security analytics and threat detection</p>
      </div>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              Last {selectedTimeRange}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Activities</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{securityMetrics.predictedActivities}</div>
            <p className="text-xs text-muted-foreground">
              ML predictions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{securityMetrics.securityIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Active alerts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{securityMetrics.resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Entity resolution
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {(securityMetrics.averageConfidence * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              ML confidence
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="library">Main Library</SelectItem>
            <SelectItem value="lab">Computer Lab A</SelectItem>
            <SelectItem value="cafeteria">Cafeteria</SelectItem>
            <SelectItem value="gym">Gymnasium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Trend</CardTitle>
            <CardDescription>Real-time activity monitoring and predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="regular" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                <Area type="monotone" dataKey="predicted" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Location Activity</CardTitle>
            <CardDescription>Most active campus locations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alert Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Severity</CardTitle>
            <CardDescription>Distribution of security alerts by severity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={alertSeverityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {alertSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Security Alerts</CardTitle>
            <CardDescription>Latest security incidents and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.title}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {alert.description}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                      {alert.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Security Analysis</CardTitle>
          <CardDescription>Comprehensive security insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="threats" className="w-full">
            <TabsList>
              <TabsTrigger value="threats">Threat Analysis</TabsTrigger>
              <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="threats" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">High-Risk Entities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {campusEntities
                        .filter(e => e.status === 'missing' || e.status === 'anomalous')
                        .slice(0, 5)
                        .map((entity) => (
                        <div key={entity.id} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <div className="font-medium text-sm">{entity.name}</div>
                            <div className="text-xs text-muted-foreground">{entity.type}</div>
                          </div>
                          <Badge variant="destructive">{entity.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Suspicious Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {activityRecords
                        .filter(a => a.confidence < 0.7)
                        .slice(0, 5)
                        .map((activity) => (
                        <div key={activity.id} className="p-2 border rounded">
                          <div className="text-sm font-medium">{activity.activityType}</div>
                          <div className="text-xs text-muted-foreground">{activity.location}</div>
                          <div className="text-xs text-red-600">
                            Low confidence: {(activity.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="patterns" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Peak Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">9:00 AM</div>
                      <div className="text-sm text-muted-foreground">Most active time</div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Hot Spots</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">Library</div>
                      <div className="text-sm text-muted-foreground">45% of activities</div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Anomaly Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">12%</div>
                      <div className="text-sm text-muted-foreground">Unusual patterns</div>
                      <Progress value={12} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4">
              <div className="space-y-4">
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Security Recommendation</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Consider increasing monitoring in the Computer Lab A area due to recent unusual activity patterns.
                  </p>
                </div>
                
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Maintenance Alert</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Update biometric scanning systems in the Main Library to improve entity resolution accuracy.
                  </p>
                </div>
                
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Performance Update</span>
                  </div>
                  <p className="text-sm text-green-800">
                    ML prediction accuracy has improved by 15% this week. Consider expanding prediction coverage.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
