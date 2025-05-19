import React, { useState } from 'react';
import { MapPin, Home, Navigation } from 'lucide-react';
import { useDisasterContext } from '../context/DisasterContext';
import { NodeType } from '../types';

const UserPanel: React.FC = () => {
  const { 
    graph,
    findOptimalPath,
    selectedStart,
    selectedEnd,
    hazards
  } = useDisasterContext();
  
  const [selectedStartId, setSelectedStartId] = useState<string>('');
  const [selectedEndId, setSelectedEndId] = useState<string>('');
  
  const handleFindPath = () => {
    if (selectedStartId && selectedEndId) {
      findOptimalPath(selectedStartId, selectedEndId);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 overflow-y-auto">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Evacuation Route Finder</h2>
        <p className="text-sm text-blue-600">
          Select your location and a safe destination to find the safest evacuation route.
        </p>
      </div>
      
      {/* Active Hazards Warning */}
      {hazards.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-sm font-semibold text-red-800 mb-1">Active Hazards</h3>
          <p className="text-sm text-red-600">
            There are {hazards.length} active hazard{hazards.length !== 1 ? 's' : ''} in the area.
            Routes will be calculated to avoid dangerous zones.
          </p>
        </div>
      )}
      
      {/* Path Finding */}
      <div className="mb-6">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="inline mr-1" />
            Your Location
          </label>
          <select
            value={selectedStartId}
            onChange={(e) => setSelectedStartId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select your location</option>
            {graph.nodes
              .filter(node => node.type === NodeType.NORMAL || node.type === NodeType.BUILDING)
              .map(node => (
                <option 
                  key={`start-${node.id}`} 
                  value={node.id}
                  disabled={hazards.some(h => h.nodeId === node.id)}
                >
                  {node.name || `Node ${node.id}`}
                  {hazards.some(h => h.nodeId === node.id) ? ' (Hazard Zone)' : ''}
                </option>
              ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Home size={16} className="inline mr-1" />
            Safe Destination
          </label>
          <select
            value={selectedEndId}
            onChange={(e) => setSelectedEndId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select destination</option>
            {graph.nodes
              .filter(node => node.type === NodeType.SAFE_ZONE)
              .map(node => (
                <option key={`end-${node.id}`} value={node.id}>
                  {node.name || `Safe Zone ${node.id}`}
                </option>
              ))}
          </select>
        </div>
        
        <button
          onClick={handleFindPath}
          disabled={!selectedStartId || !selectedEndId}
          className={`flex items-center px-3 py-2 rounded-md w-full justify-center ${
            !selectedStartId || !selectedEndId
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          <Navigation size={16} className="mr-1" />
          Find Safe Route
        </button>
      </div>

      {/* Current Selection */}
      {(selectedStart || selectedEnd) && (
        <div className="bg-gray-50 rounded-md p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Route</h3>
          {selectedStart && (
            <p className="text-sm mb-1">
              <span className="font-medium">From:</span> {selectedStart.name || selectedStart.id}
            </p>
          )}
          {selectedEnd && (
            <p className="text-sm">
              <span className="font-medium">To:</span> {selectedEnd.name || selectedEnd.id}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPanel;