"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, Home, Lock, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400"
        >
          <ShieldAlert className="h-12 w-12" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Unauthorized Access</h1>
          <p className="mb-6 text-muted-foreground">You don&apos;t have permission to access this page or resource.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-8 flex flex-col items-center justify-center gap-2 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
        >
          <Lock className="mb-2 h-6 w-6 text-amber-500" />
          <p className="text-sm">This might be because:</p>
          <ul className="mt-2 text-left text-sm text-muted-foreground">
            <li className="flex items-start gap-2 py-1">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>You need to sign in or create an account</span>
            </li>
            <li className="flex items-start gap-2 py-1">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>Your account doesn&apos;t have the required permissions</span>
            </li>
            <li className="flex items-start gap-2 py-1">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>The content has restricted access</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Button variant="outline" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button asChild>
            <Link href="/" className="gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </motion.div>
      </div>

    </div>
  )
}
