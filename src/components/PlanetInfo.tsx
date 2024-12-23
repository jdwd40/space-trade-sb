import React, { useState, useEffect } from 'react';
import { Globe, Users, Database, Zap, Shield, Flag, Crosshair, Anchor, Coins } from 'lucide-react';
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
      water?: number;
      energy?: number;
      biomatter?: number;
      fuel?: number;
      titanium?: number;
    };
  };
  onUserUpdate: () => void;
  onPlanetUpdate?: (planetId: string) => void;
}

const PlanetInfo: React.FC<PlanetProps> = ({ planet, userInfo, onUserUpdate, onPlanetUpdate }) => {
  const [buyAmount, setBuyAmount] = useState<{ [key: string]: number }>({
    metals: 0,
    gas: 0,
    food: 0,
    water: 0,
    energy: 0,
    biomatter: 0,
    fuel: 0,
    titanium: 0,
  });

  const [sellAmount, setSellAmount] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState('');
  const [calculatedValue, setCalculatedValue] = useState<number>(0);
  const [showBuyConfirm, setShowBuyConfirm] = useState(false);
  const [showSellConfirm, setShowSellConfirm] = useState(false);
  const [updatedPlanet, setUpdatedPlanet] = useState(planet);

  const resourcePrices = {
    metals: 10,
    gas: 15,
    food: 5,
    water: 8,
    energy: 20,
    biomatter: 12,
    fuel: 25,
    titanium: 30,
  };

  useEffect(() => {
    // Update local planet state whenever the prop changes
    setUpdatedPlanet(planet);
  }, [planet]);

  const handleBuyChange = (resource: string, amount: number) => {
    if (isNaN(amount) || amount < 0) {
      return;
    }
    setBuyAmount({ ...buyAmount, [resource]: amount });
  };

  const calculateCost = (resource: string, amount: number) => {
    const price = resourcePrices[resource as keyof typeof resourcePrices];
    return price ? amount * price : 0;
  };

  const handleBuy = (resource: string) => {
    setSelectedResource(resource);
    setShowBuyConfirm(true);
  };

  const handleSellClick = (resource: string, amount: number) => {
    if (amount <= 0) return;
    setSelectedResource(resource);
    setSellAmount(amount);
    const price = resourcePrices[resource as keyof typeof resourcePrices];
    setCalculatedValue(price ? amount * price : 0);
    setShowSellConfirm(true);
  };

  const confirmBuyTransaction = async () => {
    const user = auth.currentUser;
    if (!user || !selectedResource) {
      alert('User is not authenticated. Please log in to proceed with the transaction.');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const planetRef = doc(db, 'planets', planet.id);
    const amount = buyAmount[selectedResource];
    const cost = calculateCost(selectedResource, amount);

    if (userInfo.credits < cost) {
      alert("Not enough credits!");
      return;
    }

    if (updatedPlanet.resources[selectedResource as keyof typeof updatedPlanet.resources] < amount) {
      alert(
        `Not enough resources on the planet! You can try reducing the amount to ${updatedPlanet.resources[selectedResource as keyof typeof updatedPlanet.resources]} or less.`
      );
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

      // Initialize user resources if not present
      if (!latestUserInfo.resources[selectedResource]) {
        latestUserInfo.resources[selectedResource] = 0;
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
        alert(
          `Not enough resources on the planet (after re-validation)! You can try reducing the amount to ${latestPlanetData.resources[selectedResource]} or less.`
        );
        return;
      }

      // Update the planet's resources
      await updateDoc(planetRef, {
        [`resources.${selectedResource}`]: latestPlanetData.resources[selectedResource] - amount
      });

      // Update the local state for the planet's resources immediately after the transaction
      setUpdatedPlanet((prevPlanet) => {
        return {
          ...prevPlanet,
          resources: {
            ...prevPlanet.resources,
            [selectedResource]: prevPlanet.resources[selectedResource as keyof typeof prevPlanet.resources] - amount,
          },
        };
      });

      setShowBuyConfirm(false);
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

  const confirmSellTransaction = async () => {
    const user = auth.currentUser;
    if (!user || !selectedResource) return;

    const userRef = doc(db, 'users', user.uid);
    const amount = sellAmount;
    const value = calculatedValue;

    if (userInfo.resources[selectedResource as keyof typeof userInfo.resources] < amount) {
      alert("Not enough resources!");
      return;
    }

    try {
      await updateDoc(userRef, {
        credits: userInfo.credits + value,
        [`resources.${selectedResource}`]: userInfo.resources[selectedResource as keyof typeof userInfo.resources] - amount,
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("An error occurred while processing the transaction.");
      return;
    }

    setShowSellConfirm(false);
    setSellAmount(0);
    setSelectedResource('');
    onUserUpdate();
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
                typeof amount === 'number' && (
                  <div key={resource} className="bg-gray-700 p-2 rounded flex justify-between items-center">
                    <p className="text-gray-300"><span className="font-semibold">{resource}:</span> {amount} (Price: {resourcePrices[resource as keyof typeof resourcePrices] ?? 'N/A'} credits)</p>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={buyAmount[resource] ?? 0}
                        onChange={(e) => handleBuyChange(resource, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 text-black rounded"
                      />
                      <button
                        onClick={() => handleBuy(resource)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleSellClick(resource, buyAmount[resource])}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      >
                        <Coins className="text-yellow-500 mr-1" /> Sell
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {showBuyConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Buy Transaction</h3>
              <p className="text-gray-300 mb-4">
                Buy {buyAmount[selectedResource]} {selectedResource} @ {resourcePrices[selectedResource as keyof typeof resourcePrices]} credits for a total of {calculateCost(selectedResource, buyAmount[selectedResource])} credits.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowBuyConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBuyTransaction}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {showSellConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Confirm Sell Transaction</h3>
              <p className="text-gray-300 mb-4">
                Sell {sellAmount} {selectedResource} @ {resourcePrices[selectedResource as keyof typeof resourcePrices]} credits for a total of {calculatedValue} credits.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowSellConfirm(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSellTransaction}
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
