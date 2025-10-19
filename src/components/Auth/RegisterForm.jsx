import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد')
      setLoading(false)
      return
    }

    const result = await register(formData.name, formData.email, formData.password)
    
    if (result.success) {
      setSuccess(result.message)
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto" data-aos="fade-up">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">ثبت نام</CardTitle>
        <CardDescription>
          برای ایجاد حساب کاربری جدید اطلاعات خود را وارد کنید
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <div className="relative">
              <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                value={formData.name}
                onChange={handleChange}
                className="pr-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                value={formData.password}
                onChange={handleChange}
                className="pr-10 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="رمز عبور را مجدداً وارد کنید"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pr-10 pl-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'در حال ثبت نام...' : 'ثبت نام'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            قبلاً ثبت نام کرده‌اید؟{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:underline font-medium"
            >
              وارد شوید
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RegisterForm
