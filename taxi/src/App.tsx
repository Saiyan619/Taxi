import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import './App.css';
import { Toaster } from './components/ui/toast';
import EmailVerifyPage from './features/auth/pages/EmailVerifyPage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ReqResetPassword from './features/auth/pages/ReqResetPassword';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import Home from './features/home/pages/Home';
import { AppLayout } from './components/AppLayout';
import { TooltipProvider } from './components/ui/tooltip';
import ProtectedRoute from './ProtectedRoute';
import { intializeAuth } from './features/auth/api/initializeAuth';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  
  useEffect(() => {
    intializeAuth()
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <BrowserRouter>


        <Routes>
          {/* Public routes */}
        {/* Auth routes — no sidebar */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<EmailVerifyPage />} />
          <Route path="/forgot-password" element={<ReqResetPassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />


        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* App routes — wrapped in the sidebar layout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>


        </Routes>
      </BrowserRouter>
      <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;