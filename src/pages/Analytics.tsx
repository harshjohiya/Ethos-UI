import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Shield, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

// Demo data for analytics
const entityResolutionData = [
  { month: "Jan", resolved: 1200, pending: 800, accuracy: 94 },
  { month: "Feb", resolved: 1450, pending: 650, accuracy: 96 },
  { month: "Mar", resolved: 1680, pending: 420, accuracy: 97 },
  { month: "Apr", resolved: 1920, pending: 280, accuracy: 98 },
  { month: "May", resolved: 2100, pending: 200, accuracy: 98 },
  { month: "Jun", resolved: 2350, pending: 150, accuracy: 99 },
];

const securityMetrics = [
  { time: "00:00", threats: 12, incidents: 3 },
  { time: "04:00", threats: 8, incidents: 2 },
  { time: "08:00", threats: 25, incidents: 5 },
  { time: "12:00", threats: 18, incidents: 4 },
  { time: "16:00", threats: 22, incidents: 3 },
  { time: "20:00", threats: 15, incidents: 2 },
];

const entityTypes = [
  { name: "Students", value: 45, color: "#0088FE" },
  { name: "Staff", value: 30, color: "#00C49F" },
  { name: "Visitors", value: 15, color: "#FFBB28" },
  { name: "Vehicles", value: 10, color: "#FF8042" },
];

const topLocations = [
  { location: "Main Library", activity: 1250, risk: "Low" },
  { location: "Student Center", activity: 980, risk: "Medium" },
  { location: "Science Building", activity: 850, risk: "Low" },
  { location: "Parking Garage A", activity: 720, risk: "High" },
  { location: "Dormitory Complex", activity: 650, risk: "Medium" },
];

const recentAlerts = [
  { id: 1, type: "Security", message: "Unauthorized access attempt detected", time: "2 min ago", severity: "High" },
  { id: 2, type: "Entity", message: "New student profile created", time: "15 min ago", severity: "Low" },
  { id: 3, type: "System", message: "Backup completed successfully", time: "1 hour ago", severity: "Info" },
  { id: 4, type: "Security", message: "Multiple failed login attempts", time: "2 hours ago", severity: "Medium" },
];

const kpiCards = [
  {
    title: "Total Entities",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active entities in system"
  },
  {
    title: "Resolution Rate",
    value: "98.7%",
    change: "+2.1%",
    trend: "up",
    icon: CheckCircle,
    description: "Entity resolution accuracy"
  },
  {
    title: "Active Alerts",
    value: "23",
    change: "-8.3%",
    trend: "down",
    icon: AlertTriangle,
    description: "Current security alerts"
  },
  {
    title: "System Uptime",
    value: "99.9%",
    change: "+0.1%",
    trend: "up",
    icon: Activity,
    description: "System availability"
  }
];

export default function Analytics() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into entity resolution and security metrics
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Real-time Data
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {card.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={card.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {card.change}
                </span>
                from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="entities">Entity Resolution</TabsTrigger>
          <TabsTrigger value="security">Security Metrics</TabsTrigger>
          <TabsTrigger value="locations">Location Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Entity Resolution Trend</CardTitle>
                <CardDescription>
                  Monthly resolution performance over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={entityResolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="resolved" 
                      stroke="#0088FE" 
                      strokeWidth={2}
                      name="Resolved"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pending" 
                      stroke="#FF8042" 
                      strokeWidth={2}
                      name="Pending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entity Types Distribution</CardTitle>
                <CardDescription>
                  Breakdown of entity types in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={entityTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {entityTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent System Activity</CardTitle>
              <CardDescription>
                Latest alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.severity === "High" ? "bg-red-500" :
                        alert.severity === "Medium" ? "bg-yellow-500" :
                        alert.severity === "Low" ? "bg-green-500" : "bg-blue-500"
                      }`} />
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">{alert.type} • {alert.time}</p>
                      </div>
                    </div>
                    <Badge variant={
                      alert.severity === "High" ? "destructive" :
                      alert.severity === "Medium" ? "default" :
                      alert.severity === "Low" ? "secondary" : "outline"
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity Resolution Performance</CardTitle>
              <CardDescription>
                Detailed metrics on entity resolution accuracy and processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={entityResolutionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="resolved" 
                    stackId="1" 
                    stroke="#0088FE" 
                    fill="#0088FE"
                    name="Resolved Entities"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="pending" 
                    stackId="1" 
                    stroke="#FF8042" 
                    fill="#FF8042"
                    name="Pending Entities"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Accuracy</CardTitle>
                <CardDescription>
                  Accuracy percentage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={entityResolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#00C49F" 
                      strokeWidth={3}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Processing Time</span>
                    <span className="font-medium">2.3s</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className="font-medium">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Queue Length</span>
                    <span className="font-medium">47</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Threat Monitoring</CardTitle>
              <CardDescription>
                24-hour security threat and incident tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={securityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="threats" fill="#FF8042" name="Threats Detected" />
                  <Bar dataKey="incidents" fill="#FF4444" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Overall security rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">A+</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Excellent security posture
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Threats</CardTitle>
                <CardDescription>Current threat level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">3</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Medium risk level
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average incident response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2.1m</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Fast response time
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Activity Analysis</CardTitle>
              <CardDescription>
                Entity activity across different campus locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{location.location}</p>
                        <p className="text-sm text-muted-foreground">{location.activity} activities</p>
                      </div>
                    </div>
                    <Badge variant={
                      location.risk === "High" ? "destructive" :
                      location.risk === "Medium" ? "default" : "secondary"
                    }>
                      {location.risk} Risk
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
