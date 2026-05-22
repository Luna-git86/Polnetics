import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Memanggil "kamar-kamar" yang sudah dibuat Zidan
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute 1: Jika user baru buka web, langsung arahkan ke halaman Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rute 2: Halaman Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rute 3: Halaman Daftar */}
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Rute 4: Halaman Utama Dashboard AI */}
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;