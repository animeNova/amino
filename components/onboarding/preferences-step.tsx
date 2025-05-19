"use client"

import type { UseFormReturn } from "react-hook-form"

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { OnboardingFormValues } from "./user-onboarding-form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface PreferencesStepProps {
  form: UseFormReturn<OnboardingFormValues>
}


export function PreferencesStep({ form }: PreferencesStepProps) {

  return (
    <div className="space-y-6">
      {/* Bio */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea placeholder="Tell us a little about yourself" className="resize-none" rows={3} {...field} />
            </FormControl>
            <FormDescription>A brief description about yourself (optional).</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* User Website */}
      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Your Website</FormLabel>
            <FormControl>
                <Input placeholder="enter your website" {...field} />
            </FormControl>
            <FormDescription>Enter Your Website To Share Your Other Platform (optional)</FormDescription>
          </FormItem>
        )}
      />

      </div>
  )
}
