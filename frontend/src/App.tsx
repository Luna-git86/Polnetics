import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RoomSelectionPage from './pages/RoomSelectionPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('room')} onGoToSignup={() => setCurrentPage('signup')} />;
  }
  
  if (currentPage === 'signup') {
    return <SignUpPage onSignup={() => setCurrentPage('room')} onGoToLogin={() => setCurrentPage('login')} />;
  }
  
  if (currentPage === 'room') {
    return <RoomSelectionPage onSelectRoom={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'dashboard') {
    return <DashboardPage onLogout={() => setCurrentPage('login')} />;
  }

  return null;
}

export default App;