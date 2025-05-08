"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
// Import the base schema instead of the discriminated union
import { GenreFormInput,genreSchema} from "@/schemas/schema"
import { useEffect } from "react"


interface GenreFormProps {
  initialData?: Partial<GenreFormInput>, 
  onSubmit: (data: GenreFormInput) => void,
  isEditMode?: boolean,
  isLoading : boolean,
  isSuccess?: boolean
}

export function GenreForm({ 
  onSubmit, 
  initialData,
  isEditMode = false,
  isLoading,
  isSuccess
}: Readonly<GenreFormProps>) {
  const { toast } = useToast()

  
  // Initialize the form with the correct schema based on type
  const defaultValues: GenreFormInput = {
    id: initialData?.id ?? undefined,
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
  };

  const form = useForm<GenreFormInput>({
    resolver: zodResolver(genreSchema),
    defaultValues,
  });
  // Handle form submission
  const handleSubmit = (data: GenreFormInput) => {
    if (isEditMode) {
      // For update operations, only include changed fields
      const changedFields = Object.entries(data).reduce((acc, [key, value]) => {
        // @ts-ignore - This is a safe operation since we're checking key existence
        if (value !== defaultValues[key]) {
          // @ts-ignore
          acc[key] = value;
        }
        return acc;
      }, {} as Partial<GenreFormInput>);
      
      // If no fields changed, include the ID at minimum for API identification
      if (Object.keys(changedFields).length === 0 && initialData?.id) {
        // @ts-ignore - id might not be in the schema but needed for API
        changedFields.id = initialData.id;
      }
      
      console.log("Fields changed:", changedFields);
      
      // Only pass changed fields to the parent onSubmit handler
      onSubmit(data);

      toast({
        title: "Success",
        description: "Genre updated successfully.",
      });
    } else {
      // For create, pass all fields
      onSubmit(data);
      toast({
        title: "Success",
        description: "Genre created successfully.",
      });
    }
  };
  
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: isEditMode 
          ? "Genre updated successfully." 
          : "Genre created successfully.",
      });
      form.reset();
    }
  }, [isSuccess, isEditMode, toast]);
 

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter genre name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>The name of your genre (max 50 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe genre..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of your genre (max 200 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading 
              ? (!isEditMode ? "Creating..." : "Updating...") 
              : (!isEditMode ? "Create Community" : "Update Community")}
          </Button>
        </div>
          </div>
        </form>
 

    </Form>   
  

  )
}
