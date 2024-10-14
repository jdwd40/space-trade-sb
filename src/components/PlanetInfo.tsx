import React from 'react';
import { Globe, Users, Database, Zap, Shield, Flag, Crosshair, Anchor } from 'lucide-react';

interface PlanetProps {
  planet: {
    name: string;
    type: string;
    population: number;
    size: string;
    description: string;
    resources: {
      metals: number;
      gas: number;
      food: number;
    };
    productionCapacity: number;
    factories: {
      [key: string]: {
        level: number;
        capacity: number;
      };
    };
    armySize: number;
    armyEquipmentLevel: number;
    orbitalDefense: boolean;
    controlledBy: string;
    influenceLevel: number;
    factions: {
      [key: string]: number;
    };
    hqPresent: boolean;
    strategicValue: number;
    tradeRoutes: string[];
    coordinates: {
      x: number;
      y: number;
    };
    image: string;
  };
}

const PlanetInfo: React.FC<PlanetProps> = ({ planet }) => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-64">
        <img src={planet.image} alt={planet.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white">{planet.name}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
              <Globe className="mr-2" /> Planet Information
            </h3>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Type:</span> {planet.type}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Size:</span> {planet.size}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Population:</span> {planet.population.toLocaleString()}</p>
            <p className="text-gray-300 mb-4">{planet.description}</p>
            
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
              <Database className="mr-2" /> Resources
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-700 p-2 rounded">
                <p className="text-gray-300"><span className="font-semibold">Metals:</span> {planet.resources.metals}</p>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <p className="text-gray-300"><span className="font-semibold">Gas:</span> {planet.resources.gas}</p>
              </div>
              <div className="bg-gray-700 p-2 rounded">
                <p className="text-gray-300"><span className="font-semibold">Food:</span> {planet.resources.food}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
              <Zap className="mr-2" /> Production
            </h3>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Capacity:</span> {planet.productionCapacity}</p>
            {Object.entries(planet.factories).map(([name, factory]) => (
              <div key={name} className="mb-2">
                <p className="text-gray-300">
                  <span className="font-semibold">{name}:</span> Level {factory.level} (Capacity: {factory.capacity})
                </p>
              </div>
            ))}
            
            <h3 className="text-xl font-semibold text-indigo-400 mt-4 mb-2 flex items-center">
              <Shield className="mr-2" /> Military
            </h3>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Army Size:</span> {planet.armySize.toLocaleString()}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Equipment Level:</span> {planet.armyEquipmentLevel}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Orbital Defense:</span> {planet.orbitalDefense ? 'Yes' : 'No'}</p>
            
            <h3 className="text-xl font-semibold text-indigo-400 mt-4 mb-2 flex items-center">
              <Flag className="mr-2" /> Politics
            </h3>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Controlled By:</span> {planet.controlledBy}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Influence Level:</span> {planet.influenceLevel}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">HQ Present:</span> {planet.hqPresent ? 'Yes' : 'No'}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Strategic Value:</span> {planet.strategicValue}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
            <Users className="mr-2" /> Factions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(planet.factions).map(([name, influence]) => (
              <div key={name} className="bg-gray-700 p-2 rounded">
                <p className="text-gray-300"><span className="font-semibold">{name}:</span> {influence}%</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
            <Anchor className="mr-2" /> Trade Routes
          </h3>
          <p className="text-gray-300">{planet.tradeRoutes.join(', ')}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
            <Crosshair className="mr-2" /> Coordinates
          </h3>
          <p className="text-gray-300">X: {planet.coordinates.x}, Y: {planet.coordinates.y}</p>
        </div>
      </div>
    </div>
  );
};

export default PlanetInfo;