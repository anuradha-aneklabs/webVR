export interface Facility {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  iconName: 'utensils' | 'waves' | 'bed' | 'trees' | 'activity' | 'flower2';
  description: string;
  hours: string;
  features: string[];
}

export interface ParkLocation {
  id: string;
  name: string;
  shortName?: string;
  x: number; // percentage (0 - 100) on map
  y: number; // percentage (0 - 100) on map
  color: 'red' | 'green' | 'blue';
  description: string;
  facilityId?: string;
  qrCodeId?: string;
  image?: string;
  isJunction?: boolean;
}

export type TurnType = 
  | 'depart'
  | 'straight'
  | 'slight_right'
  | 'turn_right'
  | 'sharp_right'
  | 'slight_left'
  | 'turn_left'
  | 'sharp_left'
  | 'uturn'
  | 'arrive';

export interface NavigationStep {
  stepIndex: number;
  instruction: string;
  turnType: TurnType;
  distanceMeters: number;
  distanceText: string;
  fromNodeId: string;
  toNodeId: string;
  fromNodeName: string;
  toNodeName: string;
  pathPoints: [number, number][];
  visualImage: string;
  landmarkHint: string;
}

export interface RouteData {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  totalDistanceMeters: number;
  distance: string;
  duration: string;
  steps: string[];
  navigationSteps: NavigationStep[];
  points: [number, number][];
  nodeIds: string[];
}
