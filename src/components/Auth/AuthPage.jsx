import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import AnimatedText from '../ui/AnimatedText'
import { BookOpen, Users, BarChart3, Shield } from 'lucide-react'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
        <motion.div 
          className="max-w-md"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatedText 
            text="سیستم آزمون‌ساز آنلاین"
            className="text-4xl font-bold mb-6 text-foreground"
            type="words"
            delay={0.3}
            stagger={0.1}
          />
          <motion.p 
            className="text-lg text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            پلتفرم پیشرفته برای ایجاد و مدیریت آزمون‌های آنلاین با قابلیت‌های کامل
          </motion.p>
          
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {[
              {
                icon: BookOpen,
                title: "آزمون‌سازی آسان",
                description: "ایجاد آزمون‌های حرفه‌ای با انواع سوالات مختلف"
              },
              {
                icon: Users,
                title: "مدیریت کاربران",
                description: "مدیریت کامل کاربران و دسترسی‌های مختلف"
              },
              {
                icon: BarChart3,
                title: "گزارش‌گیری دقیق",
                description: "تحلیل نتایج و گزارش‌های جامع از عملکرد کاربران"
              },
              {
                icon: Shield,
                title: "امنیت بالا",
                description: "حفاظت از اطلاعات و امنیت آزمون‌ها"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex items-start space-x-4 space-x-reverse"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + (index * 0.1) }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div 
                  className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <feature.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div 
          className="w-full max-w-md"
          key={isLogin ? 'login' : 'register'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AuthPage
