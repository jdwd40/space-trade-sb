import React, { useState } from 'react';
import { Globe, Users, Database, Zap, Shield, Flag, Crosshair, Anchor } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Planet } from '../planetsData';

interface PlanetProps {
  planet: Planet;
  userInfo: {
    credits: number;
    resources: {
      metals: number;
      gas: number;
      food: number;
    };
  };
  onUserUpdate: () => void;
}

const PlanetInfo: React.FC<PlanetProps> = ({ planet, userInfo, onUserUpdate }) => {
  const [buyAmount, setBuyAmount] = useState<{ [key: string]: number }>({
    metals: 0,
    gas: 0,
    food: 0
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedResource, setSelectedResource] = useState('');

  const resourcePrices = {
    metals: 10,
    gas: 15,
    food: 5
  };

  const handleBuyChange = (resource: string, amount: number) => {
    setBuyAmount({ ...buyAmount, [resource]: amount });
  };

  const calculateCost = (resource: string, amount: number) => {
    return amount * resourcePrices[resource as keyof typeof resourcePrices];
  };

  const handleBuy = (resource: string) => {
    setSelectedResource(resource);
    setShowConfirm(true);
  };

  const confirmTransaction = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const amount = buyAmount[selectedResource];
    const cost = calculateCost(selectedResource, amount);

    if (userInfo.credits < cost) {
      alert("Not enough credits!");
      return;
    }

    await updateDoc(userRef, {
      credits: userInfo.credits - cost,
      [`resources.${selectedResource}`]: userInfo.resources[selectedResource as keyof typeof userInfo.resources] + amount
    });

    setShowConfirm(false);
    setBuyAmount({ ...buyAmount, [selectedResource]: 0 });
    onUserUpdate();
  };

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
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(planet.resources).map(([resource, amount]) => (
                <div key={resource} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                  <p className="text-gray-300"><span className="font-semibold">{resource}:</span> {amount}</p>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={buyAmount[resource]}
                      onChange={(e) => handleBuyChange(resource, parseInt(e.target.value))}
                      className="w-20 px-2 py-1 text-black rounded"
                    />
                    <button
                      onClick={() => handleBuy(resource)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
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

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Transaction</h3>
            <p className="text-gray-300 mb-4">
              Buy {buyAmount[selectedResource]} {selectedResource} for {calculateCost(selectedResource, buyAmount[selectedResource])} credits?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmTransaction}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanetInfo;