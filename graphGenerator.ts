import { Graph, Node, Edge, NodeType } from '../types';

// Generate an initial graph for simulation
export function initializeGraph(): Graph {
  // Create nodes
  const nodes: Node[] = [
    // Buildings
    { id: 'A1', type: NodeType.BUILDING, name: 'Admin Building', x: 0.2, y: 0.2 },
    { id: 'A2', type: NodeType.BUILDING, name: 'Science Hall', x: 0.4, y: 0.25 },
    { id: 'A3', type: NodeType.BUILDING, name: 'Library', x: 0.3, y: 0.4 },
    { id: 'A4', type: NodeType.BUILDING, name: 'Student Center', x: 0.6, y: 0.3 },
    { id: 'A5', type: NodeType.BUILDING, name: 'Engineering Building', x: 0.7, y: 0.5 },
    
    // Junction points
    { id: 'J1', type: NodeType.NORMAL, name: 'Main Crossroad', x: 0.4, y: 0.5 },
    { id: 'J2', type: NodeType.NORMAL, name: 'North Junction', x: 0.2, y: 0.3 },
    { id: 'J3', type: NodeType.NORMAL, name: 'East Junction', x: 0.6, y: 0.4 },
    { id: 'J4', type: NodeType.NORMAL, name: 'South Junction', x: 0.5, y: 0.7 },
    { id: 'J5', type: NodeType.NORMAL, name: 'West Junction', x: 0.3, y: 0.6 },
    
    // Safe zones
    { id: 'S1', type: NodeType.SAFE_ZONE, name: 'Emergency Assembly Point 1', x: 0.1, y: 0.1 },
    { id: 'S2', type: NodeType.SAFE_ZONE, name: 'Emergency Assembly Point 2', x: 0.8, y: 0.2 },
    { id: 'S3', type: NodeType.SAFE_ZONE, name: 'Emergency Assembly Point 3', x: 0.9, y: 0.9 },
    { id: 'S4', type: NodeType.SAFE_ZONE, name: 'Emergency Assembly Point 4', x: 0.1, y: 0.8 },
  ];
  
  // Create edges
  const edges: Edge[] = [
    // Building to junction connections
    { source: 'A1', target: 'J2', weight: 3 },
    { source: 'A2', target: 'J1', weight: 4 },
    { source: 'A3', target: 'J1', weight: 2 },
    { source: 'A3', target: 'J2', weight: 3 },
    { source: 'A4', target: 'J3', weight: 2 },
    { source: 'A5', target: 'J3', weight: 3 },
    { source: 'A5', target: 'J4', weight: 4 },
    
    // Junction to junction connections
    { source: 'J1', target: 'J2', weight: 5 },
    { source: 'J1', target: 'J3', weight: 4 },
    { source: 'J1', target: 'J4', weight: 6 },
    { source: 'J1', target: 'J5', weight: 3 },
    { source: 'J2', target: 'J5', weight: 7 },
    { source: 'J3', target: 'J4', weight: 5 },
    { source: 'J4', target: 'J5', weight: 8 },
    
    // Safe zone connections
    { source: 'S1', target: 'J2', weight: 5 },
    { source: 'S1', target: 'A1', weight: 4 },
    { source: 'S2', target: 'J3', weight: 7 },
    { source: 'S2', target: 'A4', weight: 5 },
    { source: 'S3', target: 'J4', weight: 10 },
    { source: 'S4', target: 'J5', weight: 6 },
  ];
  
  return { nodes, edges };
}