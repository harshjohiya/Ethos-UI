import { Shield, AlertTriangle, Users, Activity, Search, Clock, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { CampusActivityChart } from "@/components/CampusActivityChart";
import { EntityResolutionChart } from "@/components/EntityResolutionChart";
import { LocationActivityChart } from "@/components/LocationActivityChart";
import { RecentAlertsTable } from "@/components/RecentAlertsTable";
import { campusEntities, securityAlerts, activityRecords, getEntityStats } from "@/lib/campus-data";

export default function Dashboard() {
  const entityStats = getEntityStats();
  const activeAlerts = securityAlerts.filter(alert => alert.status === 'active');
  const recentActivities = activityRecords.slice(0, 10);
  const predictedActivities = activityRecords.filter(a => a.isPredicted).length;

  // Generate activity trend data for the last 24 hours
  const activityTrendData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000);
    const activities = activityRecords.filter(a => {
      const activityHour = new Date(a.timestamp).getHours();
      return activityHour === hour.getHours();
    });
    
    return {
      time: `${hour.getHours()}:00`,
      activities: activities.length,
      predicted: activities.filter(a => a.isPredicted).length,
      regular: activities.filter(a => !a.isPredicted).length,
    };
  });

  // Generate entity resolution data
  const entityResolutionData = [
    { type: 'Students', count: campusEntities.filter(e => e.type === 'student' && e.status === 'active').length, color: '#22c55e' },
    { type: 'Staff', count: campusEntities.filter(e => e.type === 'staff' && e.status === 'active').length, color: '#3b82f6' },
    { type: 'Assets', count: campusEntities.filter(e => e.type === 'asset' && e.status === 'active').length, color: '#8b5cf6' },
    { type: 'Missing', count: campusEntities.filter(e => e.status === 'missing').length, color: '#ef4444' },
    { type: 'Anomalous', count: campusEntities.filter(e => e.status === 'anomalous').length, color: '#f59e0b' },
  ];

  // Generate location activity data
  const locationCounts: { [key: string]: number } = {};
  activityRecords.forEach(activity => {
    locationCounts[activity.location] = (locationCounts[activity.location] || 0) + 1;
  });
  
  const locationActivityData = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Campus Security Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring and entity resolution overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Entities"
          value={entityStats.total.toString()}
          change={`${entityStats.resolutionRate}% resolved`}
          changeType="positive"
          icon={Users}
        />
        <MetricCard
          title="Active Alerts"
          value={activeAlerts.length.toString()}
          change={`${Math.round((activeAlerts.length / securityAlerts.length) * 100)}% of total`}
          changeType={activeAlerts.length > 5 ? "negative" : "positive"}
          icon={AlertTriangle}
        />
        <MetricCard
          title="Recent Activities"
          value={recentActivities.length.toString()}
          change="Last 24 hours"
          changeType="positive"
          icon={Activity}
        />
        <MetricCard
          title="ML Predictions"
          value={predictedActivities.toString()}
          change="AI-generated"
          changeType="positive"
          icon={Search}
        />
      </div>

      {/* Additional Security Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Security Score"
          value="94.2%"
          change="+2.1% from last week"
          changeType="positive"
          icon={Shield}
        />
        <MetricCard
          title="Response Time"
          value="12 min"
          change="Average for critical alerts"
          changeType="positive"
          icon={Clock}
        />
        <MetricCard
          title="Prediction Accuracy"
          value="94.2%"
          change="ML model performance"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Data Sources"
          value="5"
          change="Swipe, WiFi, CCTV, Booking, Helpdesk"
          changeType="positive"
          icon={Search}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CampusActivityChart data={activityTrendData} />
        <EntityResolutionChart data={entityResolutionData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <LocationActivityChart data={locationActivityData} />
        <RecentAlertsTable alerts={securityAlerts} />
      </div>
    </div>
  );
}
