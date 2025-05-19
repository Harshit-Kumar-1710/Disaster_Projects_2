import React, { useEffect, useState } from 'react';
import { 
  AlertCircle, ChevronDown, ChevronUp, Navigation, 
  Hourglass, Clock, MapPin, LifeBuoy, Flame, Droplet
} from 'lucide-react';
import { useDisasterContext } from '../context/DisasterContext';
import { formatTime } from '../utils/helpers';
import { DisasterType } from '../types';

const InfoPanel: React.FC = () => {
  const { 
    isSimulationRunning, 
    disasterType, 
    hazards, 
    optimalPath,
    simulationTime,
    selectedStart,
    selectedEnd,
    graph
  } = useDisasterContext();
  
  const [showEvacuationDetails, setShowEvacuationDetails] = useState(true);
  const [showDisasterInfo, setShowDisasterInfo] = useState(true);
  const [showHazardList, setShowHazardList] = useState(true);
  
  const toggleEvacuationDetails = () => {
    setShowEvacuationDetails(!showEvacuationDetails);
  };
  
  const toggleDisasterInfo = () => {
    setShowDisasterInfo(!showDisasterInfo);
  };

  const toggleHazardList = () => {
    setShowHazardList(!showHazardList);
  };
  
  const getStatusColor = () => {
    if (hazards.length > 5) return 'text-red-500';
    if (hazards.length > 2) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  const getStatusMessage = () => {
    if (hazards.length > 5) return 'Critical';
    if (hazards.length > 2) return 'Warning';
    return 'Normal';
  };

  const getHazardIcon = (type: DisasterType) => {
    switch (type) {
      case DisasterType.FIRE:
        return <Flame className="text-red-500" size={16} />;
      case DisasterType.FLOOD:
        return <Droplet className="text-blue-500" size={16} />;
      case DisasterType.EARTHQUAKE:
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <AlertCircle className="text-gray-500" size={16} />;
    }
  };
  
  const getDisasterTypeInfo = () => {
    switch (disasterType) {
      case 'FIRE':
        return {
          title: 'Fire Emergency',
          description: 'Avoid areas with fire and smoke. Move away from the building. Cover your nose and mouth with a wet cloth if possible.',
          icon: <AlertCircle className="text-red-500" />
        };
      case 'FLOOD':
        return {
          title: 'Flood Emergency',
          description: 'Move to higher ground. Avoid walking through moving water. Six inches of moving water can knock you down.',
          icon: <AlertCircle className="text-blue-500" />
        };
      case 'EARTHQUAKE':
        return {
          title: 'Earthquake Emergency',
          description: 'Drop, cover, and hold on. Stay away from windows and exterior walls. After shaking stops, move outside to open areas.',
          icon: <AlertCircle className="text-yellow-500" />
        };
      default:
        return {
          title: 'Emergency Situation',
          description: 'Follow evacuation instructions. Stay calm and help others if possible.',
          icon: <AlertCircle className="text-gray-500" />
        };
    }
  };
  
  const disasterInfo = getDisasterTypeInfo();

  return (
    <div className="h-full flex flex-col bg-white p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Information</h2>
      
      {/* Status Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-gray-700">Status</h3>
            <p className={`text-lg font-semibold ${getStatusColor()}`}>
              {getStatusMessage()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Simulation Time</p>
            <p className="text-sm font-medium">
              <Clock size={14} className="inline mr-1" />
              {formatTime(simulationTime)}
            </p>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <p>
            <span className="font-medium">Active Hazards:</span> {hazards.length}
          </p>
          <p>
            <span className="font-medium">Simulation:</span> {isSimulationRunning ? 'Running' : 'Paused'}
          </p>
        </div>
      </div>

      {/* Active Hazards List */}
      <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
        <div 
          className="flex justify-between items-center p-3 bg-red-50 cursor-pointer"
          onClick={toggleHazardList}
        >
          <h3 className="text-sm font-semibold text-red-700 flex items-center">
            <AlertCircle size={16} className="mr-1" />
            Active Hazards
          </h3>
          {showHazardList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showHazardList && (
          <div className="p-3">
            {hazards.length > 0 ? (
              <div className="space-y-2">
                {hazards.map(hazard => {
                  const node = graph.nodes.find(n => n.id === hazard.nodeId);
                  return (
                    <div 
                      key={hazard.id} 
                      className="flex items-center p-2 bg-gray-50 rounded-md"
                    >
                      {getHazardIcon(hazard.type)}
                      <span className="ml-2 text-sm">
                        {node?.name || `Location ${hazard.nodeId}`}
                      </span>
                      <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        hazard.type === DisasterType.FIRE 
                          ? 'bg-red-100 text-red-700'
                          : hazard.type === DisasterType.FLOOD
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {hazard.type}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No active hazards in the area.
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Evacuation Details */}
      <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
        <div 
          className="flex justify-between items-center p-3 bg-blue-50 cursor-pointer"
          onClick={toggleEvacuationDetails}
        >
          <h3 className="text-sm font-semibold text-blue-700 flex items-center">
            <Navigation size={16} className="mr-1" />
            Evacuation Details
          </h3>
          {showEvacuationDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showEvacuationDetails && (
          <div className="p-3">
            {optimalPath.length > 0 ? (
              <>
                <div className="mb-3">
                  <p className="text-sm font-medium">Route Found</p>
                  <p className="text-xs text-gray-600">
                    <MapPin size={12} className="inline mr-1" />
                    From: {selectedStart?.name || 'Starting Point'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <LifeBuoy size={12} className="inline mr-1" />
                    To: {selectedEnd?.name || 'Safe Zone'}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium">Estimated Time</p>
                  <p className="text-xs flex items-center">
                    <Hourglass size={12} className="mr-1" />
                    {Math.round(optimalPath.length * 2)} minutes on foot
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Instructions</p>
                  <ol className="text-xs list-decimal pl-4 mt-1 space-y-1">
                    {optimalPath.map((nodeId, index) => {
                      if (index === 0) return null;
                      const currentNode = selectedStart && index === 1 ? selectedStart : null;
                      return (
                        <li key={`instruction-${nodeId}-${index}`}>
                          {index === 1
                            ? `Leave ${currentNode?.name || 'current location'} and head to checkpoint ${index}.`
                            : index === optimalPath.length - 1
                              ? `Proceed to safe zone: ${selectedEnd?.name || 'Evacuation Point'}.`
                              : `Continue to checkpoint ${index}.`}
                        </li>
                      );
                    }).filter(Boolean)}
                  </ol>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No evacuation route has been calculated yet. Use the control panel to find a safe route.
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Disaster Information */}
      <div className="mb-4 border border-gray-200 rounded-md overflow-hidden">
        <div 
          className="flex justify-between items-center p-3 bg-red-50 cursor-pointer"
          onClick={toggleDisasterInfo}
        >
          <h3 className="text-sm font-semibold text-red-700 flex items-center">
            {disasterInfo.icon}
            <span className="ml-1">{disasterInfo.title}</span>
          </h3>
          {showDisasterInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {showDisasterInfo && (
          <div className="p-3">
            <p className="text-sm mb-2">{disasterInfo.description}</p>
            
            <h4 className="text-xs font-semibold uppercase text-gray-500 mt-3 mb-1">Safety Tips</h4>
            <ul className="text-xs list-disc pl-4 space-y-1">
              <li>Stay calm and follow official instructions</li>
              <li>Help others if it's safe to do so</li>
              <li>Move away from hazardous areas</li>
              <li>Avoid using elevators during emergencies</li>
              <li>Keep emergency contacts accessible</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;