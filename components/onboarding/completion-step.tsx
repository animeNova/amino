"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import confetti from "canvas-confetti"
import { Check, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CompletionStepProps {
  name: string
  image?: string
  coverImage?: string
}

export function CompletionStep({ name,image, coverImage }: CompletionStepProps) {
  const router = useRouter()
  const [confettiTriggered, setConfettiTriggered] = useState(false)

  useEffect(() => {
    if (!confettiTriggered) {
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // since particles fall down, start a bit higher than random
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          }),
        )
        confetti(
          Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          }),
        )
      }, 250)

      setConfettiTriggered(true)
    }
  }, [confettiTriggered])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Welcome to Amino, {name}!</CardTitle>
        <CardDescription>
          Your profile has been successfully created. You're all set to start exploring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Preview */}
        <div className="rounded-lg overflow-hidden border border-border">
          {/* Cover Image */}
          <div className="relative w-full h-32 bg-muted/30">
            {coverImage && (
              <img src={coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Profile Info */}
          <div className="p-4 relative">
            <div className="absolute -top-12 left-4 ring-4 ring-background rounded-full">
              <Avatar className="w-20 h-20 border-2 border-muted">
                <AvatarImage src={image || ""} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">{getInitials(name)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold">{name}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">What's next?</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Explore communities that match your interests</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Create your first post and share your thoughts</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Connect with other members and join discussions</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span>Customize your notification settings in your profile</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => router.push("/explore")}>
          Start Exploring <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </>
  )
}
