import React, { useState } from 'react';
import { DollarSign, Database } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface UserInfoProps {
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

const UserInfo: React.FC<UserInfoProps> = ({ userInfo, onUserUpdate }) => {
  const [sellAmount, setSellAmount] = useState<{ [key: string]: number }>({
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

  const handleSellChange = (resource: string, amount: number) => {
    setSellAmount({ ...sellAmount, [resource]: amount });
  };

  const calculateValue = (resource: string, amount: number) => {
    return amount * resourcePrices[resource as keyof typeof resourcePrices];
  };

  const handleSell = (resource: string) => {
    setSelectedResource(resource);
    setShowConfirm(true);
  };

  const confirmTransaction = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const amount = sellAmount[selectedResource];
    const value = calculateValue(selectedResource, amount);

    if (userInfo.resources[selectedResource as keyof typeof userInfo.resources] < amount) {
      alert("Not enough resources!");
      return;
    }

    await updateDoc(userRef, {
      credits: userInfo.credits + value,
      [`resources.${selectedResource}`]: userInfo.resources[selectedResource as keyof typeof userInfo.resources] - amount
    });

    setShowConfirm(false);
    setSellAmount({ ...sellAmount, [selectedResource]: 0 });
    onUserUpdate();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <DollarSign className="mr-2" /> Your Assets
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Credits</p>
          <p className="text-lg font-semibold text-white">{userInfo.credits.toLocaleString()}</p>
        </div>
        {Object.entries(userInfo.resources).map(([resource, amount]) => (
          <div key={resource} className="bg-gray-700 p-3 rounded-lg">
            <p className="text-sm text-gray-400">{resource}</p>
            <p className="text-lg font-semibold text-white">{amount.toLocaleString()}</p>
            <div className="mt-2 flex space-x-2">
              <input
                type="number"
                min="0"
                max={amount}
                value={sellAmount[resource]}
                onChange={(e) => handleSellChange(resource, parseInt(e.target.value))}
                className="w-20 px-2 py-1 text-black rounded"
              />
              <button
                onClick={() => handleSell(resource)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Transaction</h3>
            <p className="text-gray-300 mb-4">
              Sell {sellAmount[selectedResource]} {selectedResource} for {calculateValue(selectedResource, sellAmount[selectedResource])} credits?
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

export default UserInfo;