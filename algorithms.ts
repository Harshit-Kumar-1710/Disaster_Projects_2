import { Graph, Node, Edge } from '../types';

interface DijkstraResult {
  distances: Record<string, number>;
  predecessors: Record<string, string | null>;
  path: string[];
}

// Implementation of Dijkstra's algorithm for finding shortest paths
export function dijkstra(graph: Graph, startId: string, endId: string): DijkstraResult {
  const nodes = graph.nodes.map(node => node.id);
  const edges = graph.edges;
  
  // Initialize distances and predecessors
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  
  // Initialize all nodes with infinity distance except start node
  for (const node of nodes) {
    distances[node] = node === startId ? 0 : Infinity;
    predecessors[node] = null;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let currentNode: string | null = null;
    let smallestDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        currentNode = node;
      }
    }
    
    // If no reachable unvisited nodes or we reached the end, break
    if (currentNode === null || currentNode === endId || smallestDistance === Infinity) {
      break;
    }
    
    // Remove current node from unvisited set
    unvisited.delete(currentNode);
    
    // For each neighbor of current node
    const neighbors = getNeighbors(edges, currentNode);
    
    for (const { neighbor, weight } of neighbors) {
      if (!unvisited.has(neighbor)) continue;
      
      // Calculate tentative distance
      const tentativeDistance = distances[currentNode] + weight;
      
      // If tentative distance is less than current distance, update
      if (tentativeDistance < distances[neighbor]) {
        distances[neighbor] = tentativeDistance;
        predecessors[neighbor] = currentNode;
      }
    }
  }
  
  // Reconstruct the path
  const path: string[] = [];
  let current: string | null = endId;
  
  while (current !== null) {
    path.unshift(current);
    current = predecessors[current];
  }
  
  return { distances, predecessors, path };
}

// Helper function to get neighbors and weights
function getNeighbors(edges: Edge[], nodeId: string) {
  const neighbors: { neighbor: string; weight: number }[] = [];
  
  for (const edge of edges) {
    if (edge.source === nodeId) {
      neighbors.push({ neighbor: edge.target, weight: edge.weight });
    } else if (edge.target === nodeId) {
      neighbors.push({ neighbor: edge.source, weight: edge.weight });
    }
  }
  
  return neighbors;
}