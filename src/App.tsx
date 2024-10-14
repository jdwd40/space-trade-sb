import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import Login from './components/Login';
import PlanetPage from './components/Dashboard';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/planets" /> : <Login />} />
          <Route
            path="/planets"
            element={user ? <PlanetPage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={user ? "/planets" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;