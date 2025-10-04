// Campus Entity Resolution Security Monitoring System - Mock Data
export interface CampusEntity {
  id: string;
  name: string;
  type: 'student' | 'staff' | 'visitor' | 'asset';
  department?: string;
  studentId?: string;
  employeeId?: string;
  email?: string;
  phone?: string;
  lastSeen: Date;
  status: 'active' | 'missing' | 'anomalous' | 'inactive';
  confidence: number; // 0-1 for entity resolution confidence
  linkedIdentifiers: string[];
  biometricHash?: string;
  deviceFingerprint?: string;
}

export interface ActivityRecord {
  id: string;
  entityId: string;
  timestamp: Date;
  location: string;
  activityType: 'swipe' | 'wifi' | 'booking' | 'cctv' | 'helpdesk' | 'predicted';
  source: string;
  details: string;
  confidence: number;
  isPredicted?: boolean;
  predictionReason?: string;
}

export interface SecurityAlert {
  id: string;
  entityId: string;
  type: 'missing' | 'anomalous' | 'unauthorized' | 'suspicious';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  location?: string;
  predictedActivity?: string;
}

// Generate synthetic campus entities
export const generateCampusEntities = (): CampusEntity[] => {
  const entities: CampusEntity[] = [];
  
  // Students
  for (let i = 1; i <= 50; i++) {
    entities.push({
      id: `student-${i}`,
      name: `Student ${i}`,
      type: 'student',
      department: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Sciences'][Math.floor(Math.random() * 5)],
      studentId: `STU${String(i).padStart(4, '0')}`,
      email: `student${i}@campus.edu`,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      status: Math.random() > 0.1 ? 'active' : 'missing',
      confidence: 0.85 + Math.random() * 0.15,
      linkedIdentifiers: [`STU${String(i).padStart(4, '0')}`, `student${i}@campus.edu`],
      biometricHash: `bio_${Math.random().toString(36).substr(2, 9)}`,
      deviceFingerprint: `device_${Math.random().toString(36).substr(2, 9)}`,
    });
  }

  // Staff
  for (let i = 1; i <= 25; i++) {
    entities.push({
      id: `staff-${i}`,
      name: `Staff Member ${i}`,
      type: 'staff',
      department: ['IT', 'Security', 'Facilities', 'Administration', 'Maintenance'][Math.floor(Math.random() * 5)],
      employeeId: `EMP${String(i).padStart(4, '0')}`,
      email: `staff${i}@campus.edu`,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      lastSeen: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
      status: Math.random() > 0.05 ? 'active' : 'missing',
      confidence: 0.9 + Math.random() * 0.1,
      linkedIdentifiers: [`EMP${String(i).padStart(4, '0')}`, `staff${i}@campus.edu`],
      biometricHash: `bio_${Math.random().toString(36).substr(2, 9)}`,
      deviceFingerprint: `device_${Math.random().toString(36).substr(2, '9')}`,
    });
  }

  // Assets
  for (let i = 1; i <= 30; i++) {
    entities.push({
      id: `asset-${i}`,
      name: `Asset ${i}`,
      type: 'asset',
      department: ['IT', 'Facilities', 'Library', 'Lab', 'Office'][Math.floor(Math.random() * 5)],
      lastSeen: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
      status: Math.random() > 0.15 ? 'active' : 'missing',
      confidence: 0.8 + Math.random() * 0.2,
      linkedIdentifiers: [`ASSET${String(i).padStart(4, '0')}`],
      deviceFingerprint: `device_${Math.random().toString(36).substr(2, 9)}`,
    });
  }

  return entities;
};

// Generate synthetic activity records
export const generateActivityRecords = (entities: CampusEntity[]): ActivityRecord[] => {
  const activities: ActivityRecord[] = [];
  const locations = [
    'Main Library', 'Computer Lab A', 'Cafeteria', 'Gymnasium', 'Lecture Hall 101',
    'Office Building', 'Parking Lot A', 'Student Center', 'Research Lab', 'Administration Building'
  ];
  const activityTypes: ActivityRecord['activityType'][] = ['swipe', 'wifi', 'booking', 'cctv', 'helpdesk'];

  entities.forEach(entity => {
    // Generate 5-15 activities per entity
    const activityCount = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < activityCount; i++) {
      const isPredicted = Math.random() < 0.2; // 20% predicted activities
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      activities.push({
        id: `activity-${entity.id}-${i}`,
        entityId: entity.id,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        location: locations[Math.floor(Math.random() * locations.length)],
        activityType,
        source: `${activityType.toUpperCase()}_SYSTEM`,
        details: isPredicted 
          ? `Predicted ${activityType} activity based on historical patterns`
          : `${activityType} activity recorded at ${locations[Math.floor(Math.random() * locations.length)]}`,
        confidence: isPredicted ? 0.6 + Math.random() * 0.3 : 0.9 + Math.random() * 0.1,
        isPredicted,
        predictionReason: isPredicted ? 'Historical pattern analysis and location correlation' : undefined,
      });
    }
  });

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Generate security alerts
export const generateSecurityAlerts = (entities: CampusEntity[]): SecurityAlert[] => {
  const alerts: SecurityAlert[] = [];
  
  // Missing entity alerts
  entities.filter(e => e.status === 'missing').forEach(entity => {
    alerts.push({
      id: `alert-missing-${entity.id}`,
      entityId: entity.id,
      type: 'missing',
      severity: entity.type === 'student' ? 'high' : 'medium',
      title: `${entity.type.charAt(0).toUpperCase() + entity.type.slice(1)} Missing`,
      description: `${entity.name} has not been detected for over 12 hours`,
      timestamp: new Date(Date.now() - Math.random() * 6 * 60 * 60 * 1000),
      status: Math.random() > 0.3 ? 'active' : 'acknowledged',
      location: 'Unknown',
    });
  });

  // Anomalous activity alerts
  for (let i = 0; i < 5; i++) {
    const entity = entities[Math.floor(Math.random() * entities.length)];
    alerts.push({
      id: `alert-anomalous-${i}`,
      entityId: entity.id,
      type: 'anomalous',
      severity: 'medium',
      title: 'Unusual Activity Pattern',
      description: `${entity.name} showing unusual access patterns`,
      timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
      status: 'active',
      location: 'Multiple locations',
    });
  }

  // Unauthorized access alerts
  for (let i = 0; i < 3; i++) {
    alerts.push({
      id: `alert-unauthorized-${i}`,
      entityId: 'unknown',
      type: 'unauthorized',
      severity: 'critical',
      title: 'Unauthorized Access Attempt',
      description: 'Unknown entity attempting to access restricted area',
      timestamp: new Date(Date.now() - Math.random() * 30 * 60 * 1000),
      status: 'active',
      location: 'Restricted Area',
    });
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Initialize data
export const campusEntities = generateCampusEntities();
export const activityRecords = generateActivityRecords(campusEntities);
export const securityAlerts = generateSecurityAlerts(campusEntities);

// Helper functions
export const getEntityById = (id: string): CampusEntity | undefined => {
  return campusEntities.find(entity => entity.id === id);
};

export const getActivitiesByEntityId = (entityId: string): ActivityRecord[] => {
  return activityRecords.filter(activity => activity.entityId === entityId);
};

export const getAlertsByEntityId = (entityId: string): SecurityAlert[] => {
  return securityAlerts.filter(alert => alert.entityId === entityId);
};

export const getActiveAlerts = (): SecurityAlert[] => {
  return securityAlerts.filter(alert => alert.status === 'active');
};

export const getEntityStats = () => {
  const total = campusEntities.length;
  const active = campusEntities.filter(e => e.status === 'active').length;
  const missing = campusEntities.filter(e => e.status === 'missing').length;
  const anomalous = campusEntities.filter(e => e.status === 'anomalous').length;
  
  return {
    total,
    active,
    missing,
    anomalous,
    resolutionRate: ((total - missing) / total * 100).toFixed(1),
  };
};
