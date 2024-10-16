import React, { useState } from 'react';
import { DollarSign, Fuel, BatteryCharging, Coins, Ship } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Planet } from '../planetsData';

interface UserInfoProps {
  userInfo: {
    credits: number;
    resources: {
      metals: number;
      gas: number;
      food: number;
      fuel: number;
      energy: number;
      water?: number;
      biomatter?: number;
      titanium?: number;
    };
  };
  planet?: Planet; // Optional, since the user might be on the dashboard
  onUserUpdate: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ userInfo, planet, onUserUpdate }) => {
  const [sellAmount, setSellAmount] = useState<number>(0);
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [showSellForm, setShowSellForm] = useState(false);
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  // Use the planet's resource prices if a planet is provided
  const resourcePrices = planet ? planet.resources.prices : {};

  const handleSellClick = () => {
    setShowSellForm(true);
  };

  const handleResourceSelect = (resource: string) => {
    setSelectedResource(resource);
    setSellAmount(0);
    setCalculatedValue(0);
  };

  const handleSellAmountChange = (amount: number) => {
    if (isNaN(amount) || amount < 0) return;
    setSellAmount(amount);
    const price = resourcePrices[selectedResource as keyof typeof resourcePrices];
    setCalculatedValue(price ? amount * price : 0);
  };

  const confirmTransaction = async () => {
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

    setShowSellForm(false);
    setSellAmount(0);
    setSelectedResource('');
    onUserUpdate();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
        <DollarSign className="mr-2" /> Credits: <span className="ml-2 text-4xl text-yellow-400">{userInfo.credits.toLocaleString()}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Display Fuel and Energy always, even if they are 0 */}
        <div className="bg-gray-700 p-2 rounded-lg flex items-center space-x-2">
          <Fuel className="text-yellow-400" />
          <div>
            <p className="text-sm text-gray-300">Fuel</p>
            <p className="text-lg font-semibold text-white">{userInfo.resources.fuel.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-gray-700 p-2 rounded-lg flex items-center space-x-2">
          <BatteryCharging className="text-green-400" />
          <div>
            <p className="text-sm text-gray-300">Energy</p>
            <p className="text-lg font-semibold text-white">{userInfo.resources.energy.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(userInfo.resources).map(([resource, amount]) => {
          if ((resource === 'fuel' || resource === 'energy') || amount === 0) return null;
          return (
            <div key={resource} className="bg-gray-700 p-2 rounded-lg">
              <p className="text-sm text-gray-300 capitalize">{resource}</p>
              <p className="text-lg font-semibold text-white">{amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleSellClick}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sell Resources
      </button>

      {showSellForm && (
        <div className="mt-6 bg-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Sell Resources</h3>
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-2 block">Select Resource:</label>
            <select
              value={selectedResource}
              onChange={(e) => handleResourceSelect(e.target.value)}
              className="w-full p-2 text-black rounded"
            >
              <option value="" disabled>Select a resource</option>
              {Object.entries(userInfo.resources).map(([resource, amount]) => (
                amount > 0 && resourcePrices[resource as keyof typeof resourcePrices] ? (
                  <option key={resource} value={resource}>{resource}</option>
                ) : null
              ))}
            </select>
          </div>
          {selectedResource && (
            <div className="mb-4">
              <label className="text-sm text-gray-300 mb-2 block">Amount to Sell:</label>
              <input
                type="number"
                min="0"
                max={userInfo.resources[selectedResource as keyof typeof userInfo.resources]}
                value={sellAmount}
                onChange={(e) => handleSellAmountChange(parseInt(e.target.value))}
                className="w-full p-2 text-black rounded"
              />
            </div>
          )}
          {selectedResource && sellAmount > 0 && (
            <p className="text-gray-300 mb-4">Total Value: {calculatedValue} credits</p>
          )}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowSellForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={confirmTransaction}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              disabled={!selectedResource || sellAmount <= 0}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold text-white mt-8 mb-4">Ship Info</h3>
      <div className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
        <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center">
          <Ship className="text-white w-10 h-10" />
        </div>
        <div>
          <p className="text-lg font-semibold text-white">Ship Type: Explorer</p>
          <p className="text-sm text-gray-300">Inventory Size: 5/10</p>
          <p className="text-sm text-gray-300">Fuel: {userInfo.resources.fuel.toLocaleString()}</p>
          <p className="text-sm text-gray-300">Energy: {userInfo.resources.energy.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
