"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Mail, User, ArrowLeft } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FloatingInput } from "@/components/auth/floating-input"
import { SocialButton } from "@/components/auth/social-button"
import { PasswordStrength } from "@/components/auth/password-strength"
import { VerificationCodeInput } from "@/components/auth/verification-code-input"
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const [step, setStep] = useState<"details" | "verification">("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    verificationCode?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate inputs
    let hasErrors = false
    const newErrors: {
      name?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!name) {
      newErrors.name = "Name is required"
      hasErrors = true
    }

    if (!email) {
      newErrors.email = "Email is required"
      hasErrors = true
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
      hasErrors = true
    }

    if (!password) {
      newErrors.password = "Password is required"
      hasErrors = true
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      hasErrors = true
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      hasErrors = true
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    // Simulate sending verification code
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Move to verification step
      setStep("verification")
      startResendCooldown()
    } catch (error) {
      setErrors({
        email: "Failed to send verification code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate verification code
    if (!verificationCode || verificationCode.length !== 6) {
      setErrors({
        verificationCode: "Please enter a valid verification code",
      })
      return
    }

    // Simulate verifying code
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to dashboard (in a real app)
      window.location.href = "/dashboard"
    } catch (error) {
      setErrors({
        verificationCode: "Invalid verification code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Start cooldown
      startResendCooldown()
    } catch (error) {
      setErrors({
        verificationCode: "Failed to resend code. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startResendCooldown = () => {
    setResendCooldown(60)

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSocialSignUp = (provider: string) => {
    // Implement social sign up logic
    console.log(`Sign up with ${provider}`)
  }

  return (
    <AuthLayout
      title={step === "details" ? "Create Your Account" : "Verify Your Email"}
      subtitle={
        step === "details" ? "Join TestGenius AI to create and manage tests" : `We've sent a 6-digit code to ${email}`
      }
    >
      <AnimatePresence mode="wait">
        {step === "details" ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <form onSubmit={handleDetailsSubmit}>
                <FloatingInput
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  icon={<User className="h-5 w-5" />}
                  autoComplete="name"
                  disabled={isLoading}
                />

                <FloatingInput
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  icon={<Mail className="h-5 w-5" />}
                  autoComplete="email"
                  disabled={isLoading}
                />

                <FloatingInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  autoComplete="new-password"
                  disabled={isLoading}
                />

                {password && <PasswordStrength password={password} />}

                <FloatingInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  autoComplete="new-password"
                  disabled={isLoading}
                />

                <div className="mt-6">
                  <Button type="submit" className="h-12 w-full text-base" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative bg-background px-4 text-sm text-muted-foreground">or sign up with</div>
            </div>

            <div className="grid gap-3">
              <SocialButton
                provider="google"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                }
                onClick={() => handleSocialSignUp("Google")}
                disabled={isLoading}
              >
                Sign up with Google
              </SocialButton>

              <SocialButton
                provider="meta"
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z"
                      fill="#1877F2"
                    />
                  </svg>
                }
                onClick={() => handleSocialSignUp("Meta")}
                disabled={isLoading}
              >
                Sign up with Meta
              </SocialButton>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your email</p>
                </div>

                <div className="py-2">
                  <VerificationCodeInput onChange={setVerificationCode} error={!!errors.verificationCode} />

                  {errors.verificationCode && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-center text-sm text-destructive"
                    >
                      {errors.verificationCode}
                    </motion.p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="h-12 w-full text-base"
                  disabled={isLoading || verificationCode.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full text-base"
                  onClick={() => setStep("details")}
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign Up
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

