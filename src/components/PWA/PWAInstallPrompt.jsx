import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { X, Download, Smartphone } from 'lucide-react'

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully')
    } else {
      console.log('PWA installation declined')
    }
    
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if dismissed recently (within 24 hours)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60)
      
      if (hoursSinceDismissed < 24) {
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50" data-aos="slide-up">
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">نصب اپلیکیشن</CardTitle>
                <CardDescription className="text-sm">
                  برای دسترسی آسان‌تر، اپلیکیشن را نصب کنید
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              دسترسی آفلاین • اعلان‌ها • سرعت بیشتر
            </div>
            <Button onClick={handleInstallClick} size="sm">
              <Download className="w-4 h-4 ml-2" />
              نصب
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallPrompt
