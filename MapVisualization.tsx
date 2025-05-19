import React, { useEffect, useRef, useState } from 'react';
import { useDisasterContext } from '../context/DisasterContext';
import { Node, Edge } from '../types';
import { drawGraph, drawPath, drawHazards } from '../utils/graphDrawing';

const MapVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { 
    graph, 
    hazards, 
    safeZones, 
    optimalPath, 
    selectedStart, 
    selectedEnd,
    selectNode
  } = useDisasterContext();
  
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the graph
    drawGraph(ctx, graph, safeZones, canvas.width, canvas.height);
    
    // Draw hazards
    drawHazards(ctx, hazards, canvas.width, canvas.height);
    
    // Draw optimal path if available
    if (optimalPath.length > 0) {
      drawPath(ctx, optimalPath, graph, canvas.width, canvas.height);
    }
    
  }, [graph, hazards, safeZones, optimalPath, canvasSize]);

  // Handle node selection on click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Scale to canvas coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // Find if a node was clicked
    const clickedNode = graph.nodes.find(node => {
      const nodeX = node.x * canvas.width;
      const nodeY = node.y * canvas.height;
      const distance = Math.sqrt(Math.pow(nodeX - canvasX, 2) + Math.pow(nodeY - canvasY, 2));
      return distance < 15; // Node radius + some tolerance
    });
    
    if (clickedNode) {
      selectNode(clickedNode.id);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-50">
      <canvas 
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={handleCanvasClick}
        className="absolute inset-0"
      />
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-md shadow-md z-10">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-700 mr-2"></div>
            <span>Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Safe Zone</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Hazard</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 mr-2"></div>
            <span>Evacuation Route</span>
          </div>
        </div>
      </div>
      
      {/* Selection indicator */}
      {(selectedStart || selectedEnd) && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md z-10 max-w-xs">
          {selectedStart && (
            <p className="text-sm mb-1">
              <span className="font-semibold">Start:</span> {selectedStart.name}
            </p>
          )}
          {selectedEnd && (
            <p className="text-sm">
              <span className="font-semibold">Destination:</span> {selectedEnd.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MapVisualization;