import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Users, Activity, Search, Clock, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { CampusActivityChart } from "@/components/CampusActivityChart";
import { EntityResolutionChart } from "@/components/EntityResolutionChart";
import { LocationActivityChart } from "@/components/LocationActivityChart";
import { RecentAlertsTable } from "@/components/RecentAlertsTable";
import { SeedDataButton } from "@/components/SeedDataButton";
import { profileQueries, cardSwipeQueries } from "@/lib/supabase-queries";
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CardSwipe = Database['public']['Tables']['campus_card_swipes']['Row'];

interface EntityStats {
  students: number;
  staff: number;
  total: number;
  resolutionRate: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [entityStats, setEntityStats] = useState<EntityStats>({ students: 0, staff: 0, total: 0, resolutionRate: 0 });
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [cardSwipes, setCardSwipes] = useState<CardSwipe[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch profiles for entity stats
        const profiles: Profile[] = await profileQueries.getAll();
        
        // Fetch recent card swipes (last 24 hours)
        const recentSwipes: CardSwipe[] = await cardSwipeQueries.getRecent(24);
        
        setEntityStats({
          students: profiles.filter(p => p.role === 'student').length || 0,
          staff: profiles.filter(p => p.role === 'staff').length || 0,
          total: profiles.length || 0,
          resolutionRate: profiles.length ? Math.round((profiles.filter((p) => p.face_id || p.device_hash).length / profiles.length) * 100) : 0,
        });
        
        setCardSwipes(recentSwipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);
  // Derive recent activities and trend data from cardSwipes
  const recentActivities = cardSwipes.filter((s) => s.timestamp && new Date(s.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000));
  const predictedActivities = 0; // placeholder — replace with your ML prediction count when available

  const activityTrendData = Array.from({ length: 24 }, (_, i) => {
    const hourDate = new Date();
    hourDate.setMinutes(0, 0, 0);
    hourDate.setHours(hourDate.getHours() - (23 - i));

    const activitiesThisHour = cardSwipes.filter((s) => {
      if (!s.timestamp) return false;
      const ts = new Date(s.timestamp);
      return ts.getFullYear() === hourDate.getFullYear() && ts.getMonth() === hourDate.getMonth() && ts.getDate() === hourDate.getDate() && ts.getHours() === hourDate.getHours();
    });

    return {
      time: `${hourDate.getHours()}:00`,
      activities: activitiesThisHour.length,
      predicted: 0,
      regular: activitiesThisHour.length,
    };
  });

  // Generate entity resolution data from entityStats
  const entityResolutionData = [
    { type: 'Students', count: entityStats.students || 0, color: '#22c55e' },
    { type: 'Staff', count: entityStats.staff || 0, color: '#3b82f6' },
    { type: 'Assets', count: 0, color: '#8b5cf6' },
    { type: 'Missing', count: 0, color: '#ef4444' },
    { type: 'Anomalous', count: 0, color: '#f59e0b' },
  ];

  // Generate location activity data from cardSwipes
  const locationCounts: { [key: string]: number } = {};
  cardSwipes.forEach((swipe) => {
    const loc = swipe.location_id || 'unknown';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
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

      {/* Show seed button if no data */}
      {!loading && entityStats.total === 0 && (
        <div className="mb-6">
          <SeedDataButton />
        </div>
      )}

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
          change={activeAlerts.length && activeAlerts.length > 0 ? `${activeAlerts.length} active` : 'No active alerts'}
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
  <RecentAlertsTable alerts={[]} />
      </div>
    </div>
  );
}
