import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import LoginOrRegisterPage from './pages/LoginOrRegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/homepage" />} />
      <Route path="/loginOrRegister" element={<LoginOrRegisterPage />} />
      <Route path="/homepage" element={<HomePage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/homepage" replace />} />
    </Routes>
  );
}

export default App;
