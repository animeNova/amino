import { UserOnboardingForm } from '@/components/onboarding/user-onboarding-form'
import React from 'react'

const page = () => {
  return (
    <main className="min-h-screen bg-muted/30 py-10 px-4">
    <div className="container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to Amino</h1>
      <UserOnboardingForm />
    </div>
  </main>
  )
}

export default page
