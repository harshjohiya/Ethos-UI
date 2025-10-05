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

  // Auto-select the single entity match when exactly one
  if (!selectedEntity && filteredEntities.length === 1) {
    setSelectedEntity(filteredEntities[0]);
  }

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

      {/* Search and Filter */}
      {!selectedEntity && (
        <Card>
          <CardHeader>
            <CardTitle>Entity Search</CardTitle>
            <CardDescription>
              Search for entities across campus systems
            </CardDescription>
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name, ID, email, or card number..."
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
      )}

      {/* Entity Details and Timeline Side by Side */}
      {selectedEntity && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Entity Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(selectedEntity.type)}
                  Entity Details
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => setSelectedEntity(null)}>
                  Back to results
                </Button>
              </div>
              <CardDescription>
                Comprehensive entity information and identifiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Basic Information</h4>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{selectedEntity.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="outline">{selectedEntity.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Department:</span>
                      <span className="text-sm">{selectedEntity.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={selectedEntity.status === 'active' ? 'default' : 'destructive'}>
                        {selectedEntity.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Identifiers */}
                <div>
                  <h4 className="font-medium mb-3">Identifiers</h4>
                  <div className="space-y-3">
                    {selectedEntity.studentId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Student ID:</span>
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{selectedEntity.studentId}</span>
                      </div>
                    )}
                    {selectedEntity.employeeId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Employee ID:</span>
                        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{selectedEntity.employeeId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Card ID:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {selectedEntity.studentId ? `CARD-${selectedEntity.studentId}` : `CARD-${selectedEntity.employeeId}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Device Hash:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {`DEV-${selectedEntity.id.slice(0, 8).toUpperCase()}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">WiFi MAC:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {`MAC-${selectedEntity.id.slice(-8).toUpperCase()}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                {selectedEntity.email && (
                  <div>
                    <h4 className="font-medium mb-3">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{selectedEntity.email}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resolution Stats */}
                <div>
                  <h4 className="font-medium mb-3">Resolution Statistics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Confidence Score:</span>
                        <span className="font-medium">{(selectedEntity.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={selectedEntity.confidence * 100} className="h-2" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Seen:</span>
                      <span className="text-sm">{formatTimeAgo(selectedEntity.lastSeen)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data Sources:</span>
                      <span className="text-sm">{selectedEntity.linkedIdentifiers.length}</span>
                    </div>
                  </div>
                </div>

                {/* Linked Identifiers */}
                <div>
                  <h4 className="font-medium mb-3">Linked Data Sources</h4>
                  <div className="space-y-2">
                    {selectedEntity.linkedIdentifiers.map((id, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded flex-1">
                          {id}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>
                Recent activities and predictions for {selectedEntity.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="timeline" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                  <TabsTrigger value="predictions">Predictions</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="mt-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getActivitiesByEntityId(selectedEntity.id).slice(0, 15).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.isPredicted ? 'anomalous' : 'active')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{activity.activityType.toUpperCase()}</span>
                            {activity.isPredicted && (
                              <Badge variant="outline" className="text-xs">
                                Predicted
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
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
                              {(activity.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          {activity.predictionReason && (
                            <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                              <strong>Prediction:</strong> {activity.predictionReason}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="predictions" className="mt-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {getActivitiesByEntityId(selectedEntity.id)
                      .filter(activity => activity.isPredicted)
                      .map((activity) => (
                      <div key={activity.id} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-900">ML Prediction</span>
                          <Badge variant="outline" className="text-blue-700">
                            {(activity.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="text-sm text-blue-800 mb-2">
                          {activity.details}
                        </div>
                        <div className="text-xs text-blue-600">
                          <strong>Reason:</strong> {activity.predictionReason}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-4">
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Activity Patterns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
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
                        <div className="space-y-3">
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
        </div>
      )}
    </div>
  );
}
