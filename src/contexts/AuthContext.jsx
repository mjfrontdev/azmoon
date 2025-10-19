import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('azmoon_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      console.log('Login attempt:', { email, password })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock users data
      const mockUsers = [
        { id: 1, email: 'admin@azmoon.com', password: 'admin123', role: 'admin', name: 'مدیر سیستم' },
        { id: 2, email: 'user@azmoon.com', password: 'user123', role: 'user', name: 'کاربر تست' }
      ]
      
      console.log('Available users:', mockUsers)
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      console.log('Found user:', foundUser)
      
      if (foundUser) {
        const userData = { ...foundUser }
        delete userData.password // Don't store password
        console.log('Setting user data:', userData)
        setUser(userData)
        localStorage.setItem('azmoon_user', JSON.stringify(userData))
        return { success: true, user: userData }
      } else {
        console.log('User not found')
        return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'خطا در ورود به سیستم' }
    }
  }

  const register = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('azmoon_users') || '[]')
      const userExists = existingUsers.find(u => u.email === email)
      
      if (userExists) {
        return { success: false, error: 'کاربری با این ایمیل قبلاً ثبت نام کرده است' }
      }
      
      const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'user',
        registeredAt: new Date().toISOString()
      }
      
      existingUsers.push(newUser)
      localStorage.setItem('azmoon_users', JSON.stringify(existingUsers))
      
      // Auto login after successful registration
      const userData = { ...newUser }
      delete userData.password
      setUser(userData)
      localStorage.setItem('azmoon_user', JSON.stringify(userData))
      
      return { success: true, message: 'ثبت نام با موفقیت انجام شد', user: userData }
    } catch (error) {
      return { success: false, error: 'خطا در ثبت نام' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('azmoon_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
