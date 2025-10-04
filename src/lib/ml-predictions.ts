// Simple ML prediction module for campus entity resolution
export interface PredictionInput {
  entityId: string;
  historicalActivities: Array<{
    timestamp: Date;
    location: string;
    activityType: string;
  }>;
  currentTime: Date;
  entityType: 'student' | 'staff' | 'visitor' | 'asset';
}

export interface PredictionOutput {
  predictedLocation: string;
  predictedActivity: string;
  confidence: number;
  reasoning: string;
  evidence: string[];
}

// Simple pattern-based prediction algorithm
export class CampusMLPredictor {
  private locationPatterns: Map<string, Map<string, number>> = new Map();
  private timePatterns: Map<string, Map<number, number>> = new Map();
  private activityPatterns: Map<string, Map<string, number>> = new Map();

  constructor() {
    this.initializePatterns();
  }

  private initializePatterns() {
    // Initialize common campus location patterns
    const locations = [
      'Main Library', 'Computer Lab A', 'Cafeteria', 'Gymnasium', 'Lecture Hall 101',
      'Office Building', 'Parking Lot A', 'Student Center', 'Research Lab', 'Administration Building'
    ];

    // Student patterns (more likely to be in academic areas)
    const studentLocations = new Map([
      ['Main Library', 0.3],
      ['Computer Lab A', 0.25],
      ['Cafeteria', 0.2],
      ['Lecture Hall 101', 0.15],
      ['Student Center', 0.1]
    ]);
    this.locationPatterns.set('student', studentLocations);

    // Staff patterns (more likely to be in office areas)
    const staffLocations = new Map([
      ['Office Building', 0.4],
      ['Administration Building', 0.3],
      ['Cafeteria', 0.15],
      ['Main Library', 0.1],
      ['Research Lab', 0.05]
    ]);
    this.locationPatterns.set('staff', staffLocations);

    // Asset patterns (more likely to be in specific locations)
    const assetLocations = new Map([
      ['Research Lab', 0.3],
      ['Computer Lab A', 0.25],
      ['Office Building', 0.2],
      ['Main Library', 0.15],
      ['Administration Building', 0.1]
    ]);
    this.locationPatterns.set('asset', assetLocations);

    // Time patterns (hour of day preferences)
    const timePatterns = new Map([
      [9, 0.15],  // 9 AM - peak activity
      [10, 0.2],  // 10 AM - high activity
      [11, 0.18], // 11 AM - high activity
      [12, 0.12], // 12 PM - lunch time
      [13, 0.1],  // 1 PM - post-lunch
      [14, 0.15], // 2 PM - afternoon activity
      [15, 0.1],  // 3 PM - afternoon
      [16, 0.05], // 4 PM - end of day
      [17, 0.03], // 5 PM - evening
      [18, 0.02]  // 6 PM - evening
    ]);
    this.timePatterns.set('default', timePatterns);

    // Activity patterns
    const activityPatterns = new Map([
      ['swipe', 0.4],
      ['wifi', 0.3],
      ['booking', 0.15],
      ['cctv', 0.1],
      ['helpdesk', 0.05]
    ]);
    this.activityPatterns.set('default', activityPatterns);
  }

  predictActivity(input: PredictionInput): PredictionOutput {
    const { entityId, historicalActivities, currentTime, entityType } = input;
    
    // Analyze historical patterns
    const locationFrequency = this.analyzeLocationPatterns(historicalActivities);
    const timeFrequency = this.analyzeTimePatterns(historicalActivities);
    const activityFrequency = this.analyzeActivityPatterns(historicalActivities);

    // Get base patterns for entity type
    const baseLocationPattern = this.locationPatterns.get(entityType) || this.locationPatterns.get('student')!;
    const baseTimePattern = this.timePatterns.get('default')!;
    const baseActivityPattern = this.activityPatterns.get('default')!;

    // Combine historical data with base patterns
    const predictedLocation = this.combinePatterns(locationFrequency, baseLocationPattern);
    const predictedActivity = this.combinePatterns(activityFrequency, baseActivityPattern);
    
    // Calculate confidence based on data quality and pattern strength
    const confidence = this.calculateConfidence(historicalActivities, locationFrequency, timeFrequency);
    
    // Generate reasoning
    const reasoning = this.generateReasoning(
      predictedLocation,
      predictedActivity,
      historicalActivities,
      entityType
    );

    // Generate evidence
    const evidence = this.generateEvidence(
      historicalActivities,
      predictedLocation,
      predictedActivity
    );

    return {
      predictedLocation,
      predictedActivity,
      confidence,
      reasoning,
      evidence
    };
  }

  private analyzeLocationPatterns(activities: Array<{ location: string }>): Map<string, number> {
    const locationCount = new Map<string, number>();
    
    activities.forEach(activity => {
      const count = locationCount.get(activity.location) || 0;
      locationCount.set(activity.location, count + 1);
    });

    // Convert counts to frequencies
    const total = activities.length;
    const frequencies = new Map<string, number>();
    
    locationCount.forEach((count, location) => {
      frequencies.set(location, count / total);
    });

    return frequencies;
  }

  private analyzeTimePatterns(activities: Array<{ timestamp: Date }>): Map<number, number> {
    const timeCount = new Map<number, number>();
    
    activities.forEach(activity => {
      const hour = activity.timestamp.getHours();
      const count = timeCount.get(hour) || 0;
      timeCount.set(hour, count + 1);
    });

    // Convert counts to frequencies
    const total = activities.length;
    const frequencies = new Map<number, number>();
    
    timeCount.forEach((count, hour) => {
      frequencies.set(hour, count / total);
    });

    return frequencies;
  }

  private analyzeActivityPatterns(activities: Array<{ activityType: string }>): Map<string, number> {
    const activityCount = new Map<string, number>();
    
    activities.forEach(activity => {
      const count = activityCount.get(activity.activityType) || 0;
      activityCount.set(activity.activityType, count + 1);
    });

    // Convert counts to frequencies
    const total = activities.length;
    const frequencies = new Map<string, number>();
    
    activityCount.forEach((count, activityType) => {
      frequencies.set(activityType, count / total);
    });

    return frequencies;
  }

  private combinePatterns(
    historical: Map<string, number>,
    base: Map<string, number>
  ): string {
    const combined = new Map<string, number>();
    
    // Combine historical data (70% weight) with base patterns (30% weight)
    base.forEach((baseFreq, key) => {
      const historicalFreq = historical.get(key) || 0;
      const combinedFreq = (historicalFreq * 0.7) + (baseFreq * 0.3);
      combined.set(key, combinedFreq);
    });

    // Add historical locations not in base patterns
    historical.forEach((freq, key) => {
      if (!base.has(key)) {
        combined.set(key, freq * 0.5); // Lower weight for non-base patterns
      }
    });

    // Find the location with highest combined frequency
    let maxFreq = 0;
    let bestLocation = '';
    
    combined.forEach((freq, location) => {
      if (freq > maxFreq) {
        maxFreq = freq;
        bestLocation = location;
      }
    });

    return bestLocation || 'Main Library'; // Default fallback
  }

  private calculateConfidence(
    activities: Array<any>,
    locationFreq: Map<string, number>,
    timeFreq: Map<number, number>
  ): number {
    // Base confidence on data quality
    let confidence = 0.5; // Base confidence

    // More historical data = higher confidence
    if (activities.length > 10) confidence += 0.2;
    else if (activities.length > 5) confidence += 0.1;

    // Strong location patterns = higher confidence
    const maxLocationFreq = Math.max(...Array.from(locationFreq.values()));
    if (maxLocationFreq > 0.5) confidence += 0.2;
    else if (maxLocationFreq > 0.3) confidence += 0.1;

    // Strong time patterns = higher confidence
    const maxTimeFreq = Math.max(...Array.from(timeFreq.values()));
    if (maxTimeFreq > 0.4) confidence += 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private generateReasoning(
    location: string,
    activity: string,
    historical: Array<any>,
    entityType: string
  ): string {
    const reasons = [];
    
    // Location reasoning
    const locationCount = historical.filter(a => a.location === location).length;
    if (locationCount > 0) {
      reasons.push(`Historical data shows ${locationCount} previous visits to ${location}`);
    } else {
      reasons.push(`Pattern analysis suggests ${location} based on ${entityType} behavior`);
    }

    // Time reasoning
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17) {
      reasons.push(`Current time (${currentHour}:00) aligns with typical ${entityType} activity patterns`);
    }

    // Activity reasoning
    const activityCount = historical.filter(a => a.activityType === activity).length;
    if (activityCount > 0) {
      reasons.push(`Previous ${activity} activities support this prediction`);
    }

    return reasons.join('. ') + '.';
  }

  private generateEvidence(
    historical: Array<any>,
    location: string,
    activity: string
  ): string[] {
    const evidence = [];
    
    // Location evidence
    const locationActivities = historical.filter(a => a.location === location);
    if (locationActivities.length > 0) {
      evidence.push(`${locationActivities.length} historical activities at ${location}`);
    }

    // Time evidence
    const recentActivities = historical.filter(a => {
      const hoursDiff = (Date.now() - a.timestamp.getTime()) / (1000 * 60 * 60);
      return hoursDiff < 24;
    });
    if (recentActivities.length > 0) {
      evidence.push(`${recentActivities.length} activities in the last 24 hours`);
    }

    // Pattern evidence
    const uniqueLocations = new Set(historical.map(a => a.location)).size;
    if (uniqueLocations > 1) {
      evidence.push(`Activity across ${uniqueLocations} different locations`);
    }

    return evidence;
  }
}

// Export singleton instance
export const mlPredictor = new CampusMLPredictor();

// Helper function to generate predictions for missing entities
export const generateMissingEntityPrediction = (entityId: string, entityType: string): PredictionOutput => {
  // This would typically fetch historical data from a database
  // For demo purposes, we'll generate a mock prediction
  const mockHistorical = [
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), location: 'Main Library', activityType: 'swipe' },
    { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), location: 'Cafeteria', activityType: 'wifi' },
    { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), location: 'Computer Lab A', activityType: 'booking' }
  ];

  return mlPredictor.predictActivity({
    entityId,
    historicalActivities: mockHistorical,
    currentTime: new Date(),
    entityType: entityType as 'student' | 'staff' | 'visitor' | 'asset'
  });
};
