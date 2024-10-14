import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LogOut, User, Globe } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PlanetInfo from './PlanetInfo';
import { Link } from 'react-router-dom';
import { planetsData, Planet } from '../planetsData.ts';

const PlanetPage = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPlanets = async () => {
    const querySnapshot = await getDocs(collection(db, 'planets'));
    const planetData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Planet));
    setPlanets(planetData);
  };

  useEffect(() => {
    fetchPlanets();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const addOrUpdatePlanet = async (planet: Planet) => {
    try {
      const planetRef = doc(db, 'planets', planet.name.toLowerCase().replace(/\s+/g, '-'));
      const planetDoc = await getDoc(planetRef);

      if (planetDoc.exists()) {
        await setDoc(planetRef, planet, { merge: true }); // Update if exists
        return 'updated';
      } else {
        await setDoc(planetRef, planet); // Add if doesn't exist
        return 'added';
      }
    } catch (error) {
      console.error('Error adding/updating planet: ', error);
      throw error;
    }
  };

  const addNewPlanets = async () => {
    let addedCount = 0;
    let updatedCount = 0;

    try {
      for (const planet of planetsData) {
        const result = await addOrUpdatePlanet(planet);
        if (result === 'added') {
          addedCount++;
        } else if (result === 'updated') {
          updatedCount++;
        }
      }
      setMessage(`Successfully added ${addedCount} planets and updated ${updatedCount} planets.`);
      fetchPlanets();
    } catch (error) {
      setMessage('Error adding/updating planets. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-white">Space Trading Game</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <User className="h-5 w-5 mr-1 text-gray-400" />
                  {user.email}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <button
            onClick={addNewPlanets}
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Globe className="h-5 w-5 mr-2" />
            Add/Update Planets
          </button>
          {message && (
            <div className="mb-4 p-4 rounded-md bg-blue-600 text-white">
              {message}
            </div>
          )}
          {selectedPlanet ? (
            <div>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Planet List
              </button>
              <PlanetInfo planet={selectedPlanet} />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Planet List</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {planets.map((planet) => (
                  <div
                    key={planet.name}
                    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                    onClick={() => setSelectedPlanet(planet)}
                  >
                    <img src={planet.image} alt={planet.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{planet.name}</h3>
                      <p className="text-sm text-gray-300 mb-2">Type: {planet.type}</p>
                      <p className="text-sm text-gray-300">Population: {planet.population.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlanetPage;
