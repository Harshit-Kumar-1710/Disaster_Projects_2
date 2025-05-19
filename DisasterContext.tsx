import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Graph, Node, Edge, Hazard, DisasterType, NodeType } from '../types';
import { initializeGraph } from '../utils/graphGenerator';
import { dijkstra } from '../utils/algorithms';

interface DisasterContextProps {
  graph: Graph;
  hazards: Hazard[];
  safeZones: string[];
  optimalPath: string[];
  isSimulationRunning: boolean;
  disasterType: DisasterType;
  simulationSpeed: number;
  simulationTime: number;
  selectedStart: Node | null;
  selectedEnd: Node | null;
  selectedNode: Node | null;
  isAdmin: boolean;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  setDisasterType: (type: DisasterType) => void;
  setSimulationSpeed: (speed: number) => void;
  addHazard: (nodeId: string, type: DisasterType) => void;
  findOptimalPath: (startId: string, endId: string) => void;
  selectNode: (nodeId: string) => void;
}

const DisasterContext = createContext<DisasterContextProps | undefined>(undefined);

export const useDisasterContext = () => {
  const context = useContext(DisasterContext);
  if (!context) {
    throw new Error('useDisasterContext must be used within a DisasterProvider');
  }
  return context;
};

export const DisasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [hazards, setHazards] = useState<Hazard[]>([]);
  const [safeZones, setSafeZones] = useState<string[]>([]);
  const [optimalPath, setOptimalPath] = useState<string[]>([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [disasterType, setDisasterType] = useState<DisasterType>(DisasterType.FIRE);
  const [simulationSpeed, setSimulationSpeed] = useState(5);
  const [simulationTime, setSimulationTime] = useState(0);
  const [selectedStart, setSelectedStart] = useState<Node | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Node | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAdmin] = useState(() => localStorage.getItem('userRole') === 'admin');

  // Initialize graph
  useEffect(() => {
    const initialGraph = initializeGraph();
    setGraph(initialGraph);
    
    const zones = initialGraph.nodes
      .filter(node => node.type === NodeType.SAFE_ZONE)
      .map(node => node.id);
    setSafeZones(zones);
  }, []);

  // Handle simulation tick
  useEffect(() => {
    if (!isSimulationRunning) return;
    
    const interval = setInterval(() => {
      // Update simulation time
      setSimulationTime(prev => prev + 1);
      
      // Spread hazards
      setHazards(prevHazards => {
        const updatedHazards = [...prevHazards];
        
        // Spread existing hazards
        prevHazards.forEach(hazard => {
          const sourceNode = graph.nodes.find(node => node.id === hazard.nodeId);
          if (!sourceNode) return;
          
          // Find connected nodes
          const connectedEdges = graph.edges.filter(
            edge => edge.source === hazard.nodeId || edge.target === hazard.nodeId
          );
          
          connectedEdges.forEach(edge => {
            const targetId = edge.source === hazard.nodeId ? edge.target : edge.source;
            
            // Check if this node is already affected
            const alreadyAffected = updatedHazards.some(h => h.nodeId === targetId);
            
            // Random chance to spread based on disaster type and speed
            const spreadChance = hazard.intensity * (simulationSpeed / 10) * 0.03;
            
            if (!alreadyAffected && Math.random() < spreadChance) {
              updatedHazards.push({
                id: `hazard-${Date.now()}-${targetId}`,
                nodeId: targetId,
                type: hazard.type,
                intensity: hazard.intensity * 0.8, // Reduce intensity as it spreads
                createdAt: simulationTime
              });
            }
          });
        });
        
        return updatedHazards;
      });
      
      // Recalculate path if hazards affect current path
      if (optimalPath.length > 0 && hazards.some(h => optimalPath.includes(h.nodeId))) {
        if (selectedStart && selectedEnd) {
          findOptimalPath(selectedStart.id, selectedEnd.id);
        }
      }
      
    }, 1000 / (simulationSpeed / 2));
    
    return () => clearInterval(interval);
  }, [isSimulationRunning, graph, hazards, simulationSpeed, optimalPath, selectedStart, selectedEnd]);

  const startSimulation = useCallback(() => {
    setIsSimulationRunning(true);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsSimulationRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulationRunning(false);
    setHazards([]);
    setOptimalPath([]);
    setSimulationTime(0);
    setSelectedStart(null);
    setSelectedEnd(null);
    setSelectedNode(null);
  }, []);

  const addHazard = useCallback((nodeId: string, type: DisasterType) => {
    const newHazard: Hazard = {
      id: `hazard-${Date.now()}`,
      nodeId,
      type,
      intensity: 1.0,
      createdAt: simulationTime
    };
    
    setHazards(prev => [...prev, newHazard]);
    
    // Recalculate path if the hazard affects it
    if (optimalPath.includes(nodeId) && selectedStart && selectedEnd) {
      findOptimalPath(selectedStart.id, selectedEnd.id);
    }
  }, [simulationTime, optimalPath, selectedStart, selectedEnd]);

  const findOptimalPath = useCallback((startId: string, endId: string) => {
    const startNode = graph.nodes.find(node => node.id === startId);
    const endNode = graph.nodes.find(node => node.id === endId);
    
    if (!startNode || !endNode) return;
    
    setSelectedStart(startNode);
    setSelectedEnd(endNode);
    
    // Create a copy of the graph with hazards affecting weights
    const graphWithHazards = {
      nodes: [...graph.nodes],
      edges: graph.edges.map(edge => {
        const sourceHazard = hazards.find(h => h.nodeId === edge.source);
        const targetHazard = hazards.find(h => h.nodeId === edge.target);
        
        let weight = edge.weight;
        
        // Increase weight if there are hazards
        if (sourceHazard || targetHazard) {
          weight *= 100; // Make hazardous paths much less desirable
        }
        
        return { ...edge, weight };
      })
    };
    
    // Calculate the optimal path using Dijkstra's algorithm
    const { path } = dijkstra(graphWithHazards, startId, endId);
    setOptimalPath(path);
  }, [graph, hazards]);

  const selectNode = useCallback((nodeId: string) => {
    const node = graph.nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    if (isAdmin) {
      setSelectedNode(node);
    } else {
      if (!selectedStart || (selectedStart && selectedEnd)) {
        // If no selection or both already selected, start fresh with start node
        setSelectedStart(node);
        setSelectedEnd(null);
        setOptimalPath([]);
      } else if (selectedStart && !selectedEnd) {
        // If only start is selected, select end and calculate path
        setSelectedEnd(node);
        findOptimalPath(selectedStart.id, node.id);
      }
    }
  }, [graph, selectedStart, selectedEnd, findOptimalPath, isAdmin]);

  const value = {
    graph,
    hazards,
    safeZones,
    optimalPath,
    isSimulationRunning,
    disasterType,
    simulationSpeed,
    simulationTime,
    selectedStart,
    selectedEnd,
    selectedNode,
    isAdmin,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setDisasterType,
    setSimulationSpeed,
    addHazard,
    findOptimalPath,
    selectNode
  };

  return (
    <DisasterContext.Provider value={value}>
      {children}
    </DisasterContext.Provider>
  );
};