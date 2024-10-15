import React, { useState, useEffect } from 'react';
import { Globe, Users, Database, Zap, Shield, Flag, Crosshair, Anchor } from 'lucide-react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
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
  onPlanetUpdate?: (planetId: string) => void;
}

const PlanetInfo: React.FC<PlanetProps> = ({ planet, userInfo, onUserUpdate, onPlanetUpdate }) => {
  const [buyAmount, setBuyAmount] = useState<{ [key: string]: number }>({
    metals: 0,
    gas: 0,
    food: 0
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedResource, setSelectedResource] = useState('');
  const [updatedPlanet, setUpdatedPlanet] = useState(planet);

  const resourcePrices = {
    metals: 10,
    gas: 15,
    food: 5,
    water: 8,
    energy: 20,
    biomatter: 12,
    fuel: 25,
    titanium: 30
  };

  useEffect(() => {
    // Update local planet state whenever the prop changes
    setUpdatedPlanet(planet);
  }, [planet]);

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
    const planetRef = doc(db, 'planets', planet.id);
    const amount = buyAmount[selectedResource];
    const cost = calculateCost(selectedResource, amount);

    if (userInfo.credits < cost) {
      alert("Not enough credits!");
      return;
    }

    if (updatedPlanet.resources[selectedResource as keyof typeof updatedPlanet.resources] < amount) {
      alert("Not enough resources on the planet!");
      return;
    }

    try {
      // Fetch the latest user data before updating to prevent any race condition
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        throw new Error('User data not found');
      }

      const latestUserInfo = userSnap.data();
      if (latestUserInfo.credits < cost) {
        alert("Not enough credits (after re-validation)!");
        return;
      }

      // Update user's credits and resources
      await updateDoc(userRef, {
        credits: latestUserInfo.credits - cost,
        [`resources.${selectedResource}`]: latestUserInfo.resources[selectedResource] + amount
      });

      // Fetch the latest planet data before updating to prevent any race condition
      const planetSnap = await getDoc(planetRef);
      if (!planetSnap.exists()) {
        throw new Error('Planet data not found');
      }

      const latestPlanetData = planetSnap.data();
      if (latestPlanetData.resources[selectedResource] < amount) {
        alert("Not enough resources on the planet (after re-validation)!");
        return;
      }

      // Update the planet's resources
      await updateDoc(planetRef, {
        [`resources.${selectedResource}`]: latestPlanetData.resources[selectedResource] - amount
      });

      // Fetch the updated planet data and update local state
      const updatedPlanetSnap = await getDoc(planetRef);
      if (updatedPlanetSnap.exists()) {
        setUpdatedPlanet(updatedPlanetSnap.data() as Planet);
      }

      setShowConfirm(false);
      setBuyAmount({ ...buyAmount, [selectedResource]: 0 });
      onUserUpdate();
      onPlanetUpdate && onPlanetUpdate(planet.id);
    } catch (error) {
      console.error('Error during transaction:', error);
      if (error.message !== 'User data not found' && error.message !== 'Planet data not found') {
        alert('An error occurred during the transaction');
      }
    }
  };

  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-64">
        <img src={updatedPlanet.image} alt={updatedPlanet.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-4xl font-bold text-white">{updatedPlanet.name}</h2>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
              <Globe className="mr-2" /> Planet Information
            </h3>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Type:</span> {updatedPlanet.type}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Size:</span> {updatedPlanet.size}</p>
            <p className="text-gray-300 mb-2"><span className="font-semibold">Population:</span> {updatedPlanet.population.toLocaleString()}</p>
            <p className="text-gray-300 mb-4">{updatedPlanet.description}</p>
            
            <h3 className="text-xl font-semibold text-indigo-400 mb-2 flex items-center">
              <Database className="mr-2" /> Resources
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(updatedPlanet.resources).map(([resource, amount]) => (
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
          
          {/* Additional Planet Information Sections */}
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
    </div>
  );
};

export default PlanetInfo;