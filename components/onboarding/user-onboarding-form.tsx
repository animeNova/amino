"use client"

import { useState, useTransition } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileStep } from "./profile-step"
import { PreferencesStep } from "./preferences-step"
import { CompletionStep } from "./completion-step"
import { toast } from "@/hooks/use-toast"
import { updateUserSchema } from "@/schemas/schema"
import { updateCurrentUser } from "@/app/actions/users/update"
import { useRouter } from "next/navigation"



export type OnboardingFormValues = z.infer<typeof updateUserSchema>

export function UserOnboardingForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if(error){
    toast({title:"error", description:error});
  }
  const totalSteps = 3

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      image: "",
      coverImage: "",
      bio: "",
      location: "",
      website:""
    },
    mode: "onChange",
  })

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const onSubmit = async (data: OnboardingFormValues) => {
        setError(null);
        startTransition(async () => {
        try {
            await updateCurrentUser(data)
            toast({title:"success" , description:"Profile updated successfully"});
            router.push("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update user");
            toast({title:"error" , description:"Failed to update user"});                  }
        });
    nextStep() // Move to completion step
    toast({
      title: "Profile created!",
      description: "Your profile has been successfully set up.",
    })
  }

  // Check if current step is valid
  const isStepValid = () => {
    const { name } = form.getValues()

    // Only username is required in step 1
    if (step === 1) {
      return name.length >= 3 && name.length <= 30
    }

    // Step 2 has no required fields
    return true
  }

  return (
    <div className="container max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${
                    index + 1 === step
                      ? "bg-primary text-primary-foreground"
                      : index + 1 < step
                        ? "bg-primary/80 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
              >
                {index + 1 < step ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`h-1 w-full min-w-[3rem] sm:min-w-[5rem] md:min-w-[8rem] mx-2
                    ${index + 1 < step ? "bg-primary/80" : "bg-muted"}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground px-1">
          <span>Profile</span>
          <span>Preferences</span>
          <span>Complete</span>
        </div>
      </div>

      <Card className="w-full shadow-lg">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {step === 1 && (
                  <>
                    <CardHeader>
                      <CardTitle>Your Profile</CardTitle>
                      <CardDescription>
                        Tell us a bit about yourself. You can always edit this information later.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileStep form={form} />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div></div> {/* Empty div for spacing */}
                      <Button type="button" onClick={nextStep} disabled={!isStepValid()}>
                        Continue <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </>
                )}

                {step === 2 && (
                  <>
                    <CardHeader>
                      <CardTitle>Your Preferences</CardTitle>
                      <CardDescription>
                        Customize your experience. These settings can be changed at any time.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PreferencesStep form={form} />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>Complete Setup</>
                        )}
                      </Button>
                    </CardFooter>
                  </>
                )}

                {step === 3 && (
                  <CompletionStep
                    name={form.getValues("name")}
                    image={form.getValues("image")}
                    coverImage={form.getValues("coverImage")}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}
