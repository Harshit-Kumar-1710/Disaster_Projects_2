import { Graph, Node, Edge, Hazard, DisasterType } from '../types';

// Draw the entire graph with nodes and edges
export function drawGraph(
  ctx: CanvasRenderingContext2D, 
  graph: Graph, 
  safeZones: string[],
  canvasWidth: number, 
  canvasHeight: number
) {
  // Draw edges first
  for (const edge of graph.edges) {
    const sourceNode = graph.nodes.find(n => n.id === edge.source);
    const targetNode = graph.nodes.find(n => n.id === edge.target);
    
    if (sourceNode && targetNode) {
      const sourceX = sourceNode.x * canvasWidth;
      const sourceY = sourceNode.y * canvasHeight;
      const targetX = targetNode.x * canvasWidth;
      const targetY = targetNode.y * canvasHeight;
      
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
  
  // Draw nodes
  for (const node of graph.nodes) {
    const x = node.x * canvasWidth;
    const y = node.y * canvasHeight;
    const isSafeZone = safeZones.includes(node.id);
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = isSafeZone ? '#10B981' : '#334155';
    ctx.fill();
    
    // Draw node border
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw node label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.id.slice(0, 2), x, y);
    
    // Draw node name if available
    if (node.name) {
      ctx.fillStyle = '#1E293B';
      ctx.font = '12px Arial';
      ctx.fillText(node.name, x, y + 24);
    }
  }
}

// Draw hazards on the map
export function drawHazards(
  ctx: CanvasRenderingContext2D, 
  hazards: Hazard[], 
  canvasWidth: number, 
  canvasHeight: number
) {
  for (const hazard of hazards) {
    const node = document.querySelector(`[data-node-id="${hazard.nodeId}"]`);
    let x = 0;
    let y = 0;
    
    // If we can't find the node in DOM, calculate position from graph
    if (!node) {
      const nodeData = document.getElementById(hazard.nodeId);
      if (nodeData) {
        const rect = nodeData.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    } else {
      x = parseFloat(node.getAttribute('data-x') || '0') * canvasWidth;
      y = parseFloat(node.getAttribute('data-y') || '0') * canvasHeight;
    }
    
    // Draw hazard effect based on type
    switch (hazard.type) {
      case DisasterType.FIRE:
        drawFireHazard(ctx, x, y, hazard.intensity);
        break;
      case DisasterType.FLOOD:
        drawFloodHazard(ctx, x, y, hazard.intensity);
        break;
      case DisasterType.EARTHQUAKE:
        drawEarthquakeHazard(ctx, x, y, hazard.intensity);
        break;
    }
  }
}

// Draw a fire hazard visualization
function drawFireHazard(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  intensity: number
) {
  const radius = 30 * intensity;
  
  // Create radial gradient for fire effect
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // red-500
  gradient.addColorStop(0.7, 'rgba(252, 165, 165, 0.6)'); // red-300
  gradient.addColorStop(1, 'rgba(254, 226, 226, 0)'); // red-100
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// Draw a flood hazard visualization
function drawFloodHazard(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  intensity: number
) {
  const radius = 30 * intensity;
  
  // Create radial gradient for water effect
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)'); // blue-500
  gradient.addColorStop(0.7, 'rgba(147, 197, 253, 0.6)'); // blue-300
  gradient.addColorStop(1, 'rgba(219, 234, 254, 0)'); // blue-100
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// Draw an earthquake hazard visualization
function drawEarthquakeHazard(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  intensity: number
) {
  const radius = 30 * intensity;
  
  // Create radial gradient for earthquake effect
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(234, 179, 8, 0.8)'); // yellow-500
  gradient.addColorStop(0.7, 'rgba(253, 224, 71, 0.6)'); // yellow-300
  gradient.addColorStop(1, 'rgba(254, 249, 195, 0)'); // yellow-100
  
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Add ripple effect
  for (let i = 1; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(x, y, radius * (0.5 + i * 0.2), 0, 2 * Math.PI);
    ctx.strokeStyle = `rgba(234, 179, 8, ${0.3 - i * 0.1})`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Draw a path highlighting the optimal route
export function drawPath(
  ctx: CanvasRenderingContext2D, 
  path: string[], 
  graph: Graph,
  canvasWidth: number, 
  canvasHeight: number
) {
  if (path.length < 2) return;
  
  ctx.beginPath();
  
  // Find the first node in the path
  const firstNode = graph.nodes.find(n => n.id === path[0]);
  
  if (firstNode) {
    const startX = firstNode.x * canvasWidth;
    const startY = firstNode.y * canvasHeight;
    ctx.moveTo(startX, startY);
    
    // Draw the path
    for (let i = 1; i < path.length; i++) {
      const currentNode = graph.nodes.find(n => n.id === path[i]);
      
      if (currentNode) {
        const x = currentNode.x * canvasWidth;
        const y = currentNode.y * canvasHeight;
        ctx.lineTo(x, y);
      }
    }
    
    // Style for the path
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Draw direction arrows
    for (let i = 0; i < path.length - 1; i++) {
      const currentNode = graph.nodes.find(n => n.id === path[i]);
      const nextNode = graph.nodes.find(n => n.id === path[i + 1]);
      
      if (currentNode && nextNode) {
        const startX = currentNode.x * canvasWidth;
        const startY = currentNode.y * canvasHeight;
        const endX = nextNode.x * canvasWidth;
        const endY = nextNode.y * canvasHeight;
        
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        drawArrow(ctx, midX, midY, Math.atan2(endY - startY, endX - startX));
      }
    }
  }
}

// Helper function to draw an arrow
function drawArrow(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  angle: number
) {
  const arrowSize = 10;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-arrowSize, -arrowSize / 2);
  ctx.lineTo(-arrowSize, arrowSize / 2);
  ctx.closePath();
  
  ctx.fillStyle = '#3B82F6';
  ctx.fill();
  
  ctx.restore();
}