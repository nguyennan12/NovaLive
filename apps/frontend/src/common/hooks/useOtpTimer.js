import { useState, useEffect } from 'react'

export const useOtpTimer = (initialCooldown, isOpen) => {
  const [resendCooldown, setResendCooldown] = useState(initialCooldown)

  useEffect(() => {
    if (!isOpen) {
      setResendCooldown(initialCooldown)
      return
    }
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown, isOpen, initialCooldown])

  return { resendCooldown, setResendCooldown, canResend: resendCooldown <= 0 }
}