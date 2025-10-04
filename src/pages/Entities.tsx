import { useState, useMemo } from "react";
import { Search, Filter, Clock, MapPin, Activity, User, Building, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { campusEntities, activityRecords, getActivitiesByEntityId, getEntityStats } from "@/lib/campus-data";
import { CampusEntity, ActivityRecord } from "@/lib/campus-data";

export default function Entities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedEntity, setSelectedEntity] = useState<CampusEntity | null>(null);

  const filteredEntities = useMemo(() => {
    return campusEntities.filter(entity => {
      const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entity.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entity.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entity.employeeId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || entity.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType]);

  const entityStats = getEntityStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'missing': return 'bg-red-500';
      case 'anomalous': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student': return <User className="h-4 w-4" />;
      case 'staff': return <Building className="h-4 w-4" />;
      case 'asset': return <Activity className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Entity Resolution</h1>
        <p className="text-muted-foreground">Track and resolve campus entities across diverse data sources</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{entityStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Resolution Rate: {entityStats.resolutionRate}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{entityStats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently tracked
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{entityStats.missing}</div>
            <p className="text-xs text-muted-foreground">
              Over 12h inactive
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anomalous</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{entityStats.anomalous}</div>
            <p className="text-xs text-muted-foreground">
              Unusual patterns
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Entity List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Entity Resolution Engine</CardTitle>
              <CardDescription>
                Resolved entities from swipe logs, Wi-Fi records, bookings, and CCTV
              </CardDescription>
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="asset">Assets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedEntity(entity)}
                  >
                    <div className="flex items-center gap-3">
                      {getTypeIcon(entity.type)}
                      <div>
                        <div className="font-medium">{entity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entity.studentId || entity.employeeId} • {entity.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={entity.status === 'active' ? 'default' : 'destructive'}>
                        {entity.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatTimeAgo(entity.lastSeen)}</div>
                        <div className="text-xs text-muted-foreground">
                          {(entity.confidence * 100).toFixed(0)}% confidence
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Entity Details */}
        <div className="lg:col-span-1">
          {selectedEntity ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedEntity.type)}
                  {selectedEntity.name}
                </CardTitle>
                <CardDescription>
                  {selectedEntity.type.charAt(0).toUpperCase() + selectedEntity.type.slice(1)} • {selectedEntity.department}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Resolution Confidence</div>
                  <Progress value={selectedEntity.confidence * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {(selectedEntity.confidence * 100).toFixed(1)}% confidence
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Status</div>
                  <Badge variant={selectedEntity.status === 'active' ? 'default' : 'destructive'}>
                    {selectedEntity.status}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Last Seen</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTimeAgo(selectedEntity.lastSeen)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-2">Linked Identifiers</div>
                  <div className="space-y-1">
                    {selectedEntity.linkedIdentifiers.map((id, index) => (
                      <div key={index} className="text-xs bg-muted px-2 py-1 rounded">
                        {id}
                      </div>
                    ))}
                  </div>
                </div>
                
                {selectedEntity.email && (
                  <div>
                    <div className="text-sm font-medium mb-1">Contact</div>
                    <div className="text-sm text-muted-foreground">{selectedEntity.email}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2" />
                  <p>Select an entity to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      {selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Activity Timeline - {selectedEntity.name}
            </CardTitle>
            <CardDescription>
              Chronological view of all activities and predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="mt-4">
                <div className="space-y-4">
                  {getActivitiesByEntityId(selectedEntity.id).slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.isPredicted ? 'anomalous' : 'active')}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{activity.activityType.toUpperCase()}</span>
                          {activity.isPredicted && (
                            <Badge variant="outline" className="text-xs">
                              Predicted
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {activity.details}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {activity.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                          <span>
                            {(activity.confidence * 100).toFixed(0)}% confidence
                          </span>
                        </div>
                        {activity.predictionReason && (
                          <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                            <strong>Prediction Reason:</strong> {activity.predictionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="predictions" className="mt-4">
                <div className="space-y-4">
                  {getActivitiesByEntityId(selectedEntity.id)
                    .filter(activity => activity.isPredicted)
                    .map((activity) => (
                    <div key={activity.id} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Predicted Activity</span>
                        <Badge variant="outline" className="text-blue-700">
                          ML Prediction
                        </Badge>
                      </div>
                      <div className="text-sm text-blue-800 mb-2">
                        {activity.details}
                      </div>
                      <div className="text-xs text-blue-600">
                        <strong>Confidence:</strong> {(activity.confidence * 100).toFixed(1)}% | 
                        <strong> Reason:</strong> {activity.predictionReason}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Activity Patterns</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Regular Activities</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Predicted Activities</span>
                          <span>22%</span>
                        </div>
                        <Progress value={22} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Location Frequency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Main Library</span>
                          <span>45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Computer Lab A</span>
                          <span>30%</span>
                        </div>
                        <Progress value={30} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Cafeteria</span>
                          <span>25%</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
