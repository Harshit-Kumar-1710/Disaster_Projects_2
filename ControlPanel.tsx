import React, { useState } from 'react';
import { 
  Play, Pause, RotateCcw, PlusCircle, AlertCircle, 
  Droplet, Flame, MapPin, Home, Navigation
} from 'lucide-react';
import { useDisasterContext } from '../context/DisasterContext';
import { DisasterType, NodeType } from '../types';

const ControlPanel: React.FC = () => {
  const { 
    graph,
    isSimulationRunning,
    disasterType,
    simulationSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setDisasterType,
    setSimulationSpeed,
    addHazard,
    findOptimalPath
  } = useDisasterContext();
  
  const [selectedStartId, setSelectedStartId] = useState<string>('');
  const [selectedEndId, setSelectedEndId] = useState<string>('');
  
  const handleStartSimulation = () => {
    startSimulation();
  };
  
  const handlePauseSimulation = () => {
    pauseSimulation();
  };
  
  const handleResetSimulation = () => {
    resetSimulation();
  };
  
  const handleFindPath = () => {
    if (selectedStartId && selectedEndId) {
      findOptimalPath(selectedStartId, selectedEndId);
    }
  };
  
  const handleAddHazard = (type: DisasterType) => {
    // Add a random hazard of the selected type
    const randomNodeIndex = Math.floor(Math.random() * graph.nodes.length);
    const randomNode = graph.nodes[randomNodeIndex];
    addHazard(randomNode.id, type);
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Control Panel</h2>
      
      {/* Simulation Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Simulation</h3>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleStartSimulation}
            disabled={isSimulationRunning}
            className={`flex items-center px-3 py-2 rounded-md ${
              isSimulationRunning 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Play size={16} className="mr-1" />
            Start
          </button>
          <button
            onClick={handlePauseSimulation}
            disabled={!isSimulationRunning}
            className={`flex items-center px-3 py-2 rounded-md ${
              !isSimulationRunning 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            <Pause size={16} className="mr-1" />
            Pause
          </button>
          <button
            onClick={handleResetSimulation}
            className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <RotateCcw size={16} className="mr-1" />
            Reset
          </button>
        </div>
        
        {/* Simulation Speed */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Simulation Speed
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
      
      {/* Disaster Type */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Disaster Type</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setDisasterType(DisasterType.FIRE)}
            className={`flex flex-col items-center justify-center p-2 rounded-md ${
              disasterType === DisasterType.FIRE 
                ? 'bg-red-100 border-2 border-red-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Flame 
              size={24} 
              className={disasterType === DisasterType.FIRE ? 'text-red-500' : 'text-gray-700'} 
            />
            <span className="text-xs mt-1">Fire</span>
          </button>
          <button
            onClick={() => setDisasterType(DisasterType.FLOOD)}
            className={`flex flex-col items-center justify-center p-2 rounded-md ${
              disasterType === DisasterType.FLOOD 
                ? 'bg-blue-100 border-2 border-blue-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Droplet 
              size={24} 
              className={disasterType === DisasterType.FLOOD ? 'text-blue-500' : 'text-gray-700'} 
            />
            <span className="text-xs mt-1">Flood</span>
          </button>
          <button
            onClick={() => setDisasterType(DisasterType.EARTHQUAKE)}
            className={`flex flex-col items-center justify-center p-2 rounded-md ${
              disasterType === DisasterType.EARTHQUAKE 
                ? 'bg-yellow-100 border-2 border-yellow-500' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <AlertCircle 
              size={24} 
              className={disasterType === DisasterType.EARTHQUAKE ? 'text-yellow-500' : 'text-gray-700'} 
            />
            <span className="text-xs mt-1">Earthquake</span>
          </button>
        </div>
      </div>
      
      {/* Add Hazard */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Add Hazard</h3>
        <button
          onClick={() => handleAddHazard(disasterType)}
          className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full justify-center"
        >
          <PlusCircle size={16} className="mr-1" />
          Add Random Hazard
        </button>
      </div>
      
      {/* Path Finding */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Evacuation Route</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="inline mr-1" />
            Starting Point
          </label>
          <select
            value={selectedStartId}
            onChange={(e) => setSelectedStartId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select starting point</option>
            {graph.nodes
              .filter(node => node.type === NodeType.NORMAL || node.type === NodeType.BUILDING)
              .map(node => (
                <option key={`start-${node.id}`} value={node.id}>
                  {node.name || `Node ${node.id}`}
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
          Find Evacuation Route
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;