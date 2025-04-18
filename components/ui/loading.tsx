"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface CreativeLoadingScreenProps {
  /**
   * The message to display while loading
   * @default "Loading"
   */
  message?: string

  /**
   * The color theme of the loading screen
   * @default "blue"
   */
  theme?: "blue" | "purple" | "green" | "amber"

  /**
   * Whether to show the loading percentage
   * @default true
   */
  showPercentage?: boolean

  /**
   * The duration of the simulated loading in milliseconds
   * @default 3000
   */
  simulationDuration?: number
}

export default function CreativeLoadingScreen({
  message = "Loading",
  theme = "blue",
  showPercentage = false,
  simulationDuration = 3000,
}: CreativeLoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  // Theme colors mapping
  const themeColors = {
    blue: {
      primary: "bg-sky-500",
      secondary: "bg-sky-400",
      text: "text-sky-500",
      ring: "border-sky-500",
    },
    purple: {
      primary: "bg-violet-500",
      secondary: "bg-violet-400",
      text: "text-violet-500",
      ring: "border-violet-500",
    },
    green: {
      primary: "bg-emerald-500",
      secondary: "bg-emerald-400",
      text: "text-emerald-500",
      ring: "border-emerald-500",
    },
    amber: {
      primary: "bg-amber-500",
      secondary: "bg-amber-400",
      text: "text-amber-500",
      ring: "border-amber-500",
    },
  }

  const colors = themeColors[theme]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        // Slow down progress as it approaches 100%
        const increment = Math.max(0.5, 5 * (1 - prevProgress / 100))
        const newProgress = Math.min(prevProgress + increment, 99)
        return newProgress
      })
    }, simulationDuration / 100)

    return () => clearInterval(interval)
  }, [simulationDuration])

  // Animation variants for the circles
  const circleVariants = {
    animate: (i: number) => ({
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.2,
      },
    }),
  }

  // Animation for the progress bar
  const progressVariants = {
    initial: { width: 0 },
    animate: {
      width: `${progress}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="relative flex flex-col items-center justify-center">
        {/* Animated circles */}
        <div className="relative h-40 w-40">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={circleVariants}
              animate="animate"
              className={`absolute inset-0 rounded-full border-4 border-dashed ${colors.ring} opacity-60`}
              style={{
                transformOrigin: "center",
                rotate: `${i * 30}deg`,
              }}
            />
          ))}

          {/* Inner content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-24 w-24 rounded-full bg-background shadow-lg flex items-center justify-center">
              {/* Animated dots */}
              <div className="flex space-x-1.5">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                    className={`h-3 w-3 rounded-full ${colors.primary}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <h2 className="mt-8 text-xl font-medium">{message}</h2>

        {/* Progress bar */}
        {showPercentage && (
          <div className="mt-6 w-64 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${colors.primary}`}
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Loading assets</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
