import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RoomSelectionPage from './pages/RoomSelectionPage';
import DashboardPage from './pages/DashboardPage';

// Komponen Pemeriksa Status Sesi Saat Aplikasi Dimuat/Refresh
const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const activeWorkspace = localStorage.getItem('activeWorkspace');

    if (token && user) {
      if (activeWorkspace) {
        // Jika sudah punya proyek aktif, langsung kunci ke Dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Jika belum memilih/membuat ruang proyek, bawa ke Room Selection
        navigate('/room', { replace: true });
      }
    } else {
      // Jika belum terotentikasi, arahkan ke Login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center text-slate-400 font-sans text-xs font-medium">
      Menghubungkan ke Workspace...
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Gerbang Utama Deteksi Sesi */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Jalur Otentikasi */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      
      {/* Jalur Ruang Kerja */}
      <Route path="/room" element={<RoomSelectionPage />} />
      
      {/* Jalur Utama Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <DashboardPage 
            onLogout={() => {
              // Bersihkan seluruh brankas browser saat keluar proyek
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('activeWorkspace');
              window.location.href = '/login';
            }} 
          />
        } 
      />

      {/* Fallback jika rute tidak ditemukan */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;