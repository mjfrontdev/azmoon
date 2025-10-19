import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import AnimatedText from '../ui/AnimatedText'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (!result.success) {
      setError(result.error)
      setLoading(false)
    } else {
      // Navigate based on user role
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <AnimatedText 
            text="ورود به سیستم"
            className="text-2xl font-bold"
            type="words"
            delay={0.2}
            stagger={0.1}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <CardDescription>
              برای ورود به پنل کاربری خود ایمیل و رمز عبور را وارد کنید
            </CardDescription>
          </motion.div>
        </CardHeader>
      <CardContent>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {error && (
            <motion.div 
              className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.2 }}
          >
            <Label htmlFor="email">ایمیل</Label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className="pr-10"
                required
              />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور خود را وارد کنید"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 pl-10"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.6 }}
          >
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال ورود...' : 'ورود'}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <p className="text-sm text-muted-foreground">
            حساب کاربری ندارید؟{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:underline font-medium"
            >
              ثبت نام کنید
            </button>
          </p>
        </motion.div>

        <motion.div 
          className="mt-4 p-3 bg-muted/50 rounded-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.0 }}
        >
          <p className="text-xs text-muted-foreground mb-2">حساب‌های تست:</p>
          <div className="text-xs space-y-1">
            <p><strong>ادمین:</strong> admin@azmoon.com / admin123</p>
            <p><strong>کاربر:</strong> user@azmoon.com / user123</p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
    </motion.div>
  )
}

export default LoginForm
