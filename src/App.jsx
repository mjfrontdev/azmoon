import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ExamProvider } from './contexts/ExamContext'
import AuthPage from './components/Auth/AuthPage'
import AdminDashboard from './components/Admin/AdminDashboard'
import UserDashboard from './components/User/UserDashboard'
import ExamTaking from './components/Exam/ExamTaking'
import PWAInstallPrompt from './components/PWA/PWAInstallPrompt'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

// Main App Routes
const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/exam/:examId" 
        element={<ExamTaking />} 
      />
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'admin' ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/auth" replace />
          )
        } 
      />
    </Routes>
  )
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  }, [])

  return (
    <AuthProvider>
      <ExamProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <AppRoutes />
            <PWAInstallPrompt />
          </div>
        </Router>
      </ExamProvider>
    </AuthProvider>
  )
}

export default App
