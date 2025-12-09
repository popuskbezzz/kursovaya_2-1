import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import TimeTrackingPage from "./pages/TimeTrackingPage";
import { User } from "./types/models";

// Простейшая псевдо-аутентификация: храним пользователя в состоянии и localStorage.
// Это позволяет демонстрировать guarded-роуты без сложной логики авторизации.
const AUTH_STORAGE_KEY = "worktime_user";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (u: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/*"
        element=
          {user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<DashboardPage user={user} />} />
                <Route path="/time" element={<TimeTrackingPage user={user} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )}
      />
    </Routes>
  );
}
