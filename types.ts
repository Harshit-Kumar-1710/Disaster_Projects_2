// Node types
export enum NodeType {
  NORMAL = 'NORMAL',
  BUILDING = 'BUILDING',
  SAFE_ZONE = 'SAFE_ZONE'
}

// Disaster types
export enum DisasterType {
  FIRE = 'FIRE',
  FLOOD = 'FLOOD',
  EARTHQUAKE = 'EARTHQUAKE'
}

// Node definition
export interface Node {
  id: string;
  type: NodeType;
  name?: string;
  x: number; // Normalized coordinate (0-1)
  y: number; // Normalized coordinate (0-1)
}

// Edge definition
export interface Edge {
  source: string; // Node ID
  target: string; // Node ID
  weight: number; // Distance/time cost
}

// Graph definition
export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

// Hazard definition
export interface Hazard {
  id: string;
  nodeId: string; // The node affected by this hazard
  type: DisasterType;
  intensity: number; // 0-1 scale
  createdAt: number; // Simulation time when created
}