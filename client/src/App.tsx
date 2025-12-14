import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { api } from './lib/api';
import { MetricChart } from './components/MetricChart';
import { AgentChat } from './components/AgentChat';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { DashboardLayout } from './components/DashboardLayout';

// Protected Route Component
function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

// Dashboard Page Component
function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (api.api.metrics && token) {
      api.api.metrics.get({
        headers: { authorization: `Bearer ${token}` }
      }).then(({ data }) => {
        if (Array.isArray(data)) setMetrics(data);
      });
    }
  }, []);

  const salesData = metrics.filter(m => m.label === 'Sales');
  const visitorData = metrics.filter(m => m.label === 'Visitors');

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MetricChart title="Total Revenue" data={salesData} color="#8884d8" />
          <MetricChart title="Unique Visitors" data={visitorData} color="#82ca9d" />
        </div>
        {/* Agent Insight */}
        <div className="grid grid-cols-1 gap-8">
          <AgentChat />
        </div>
      </div>
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;