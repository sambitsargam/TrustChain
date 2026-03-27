import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Leaderboard from './pages/Leaderboard';
import ProfileView from './pages/ProfileView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile/:address" element={<ProfileView />} />
      </Routes>
    </Router>
  );
}

export default App;
