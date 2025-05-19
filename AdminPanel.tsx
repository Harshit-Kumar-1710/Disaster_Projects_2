import React from 'react';
import { 
  Play, Pause, RotateCcw, AlertCircle, 
  Droplet, Flame
} from 'lucide-react';
import { useDisasterContext } from '../context/DisasterContext';
import { DisasterType } from '../types';

const AdminPanel: React.FC = () => {
  const { 
    isSimulationRunning,
    disasterType,
    simulationSpeed,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setDisasterType,
    setSimulationSpeed,
    addHazard,
    selectedNode
  } = useDisasterContext();
  
  const handleStartSimulation = () => {
    startSimulation();
  };
  
  const handlePauseSimulation = () => {
    pauseSimulation();
  };
  
  const handleResetSimulation = () => {
    resetSimulation();
  };
  
  const handleAddHazard = () => {
    if (selectedNode) {
      addHazard(selectedNode.id, disasterType);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white p-4 overflow-y-auto">
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Admin Panel</h2>
        <p className="text-sm text-red-600">
          Click on any location on the map and select hazard type to mark danger zones.
        </p>
      </div>
      
      {/* Simulation Controls */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Simulation Control</h3>
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
          onClick={handleAddHazard}
          disabled={!selectedNode}
          className={`flex items-center px-3 py-2 rounded-md w-full justify-center ${
            !selectedNode
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {selectedNode ? (
            `Add ${disasterType} Hazard at ${selectedNode.name || selectedNode.id}`
          ) : (
            'Select a location on the map'
          )}
        </button>
      </div>
      
      {/* Selected Location */}
      {selectedNode && (
        <div className="bg-gray-50 rounded-md p-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Location</h3>
          <p className="text-sm">
            {selectedNode.name || `Node ${selectedNode.id}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;