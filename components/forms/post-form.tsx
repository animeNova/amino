'use client';
import { toast } from '@/hooks/use-toast';
import { useUpload } from '@/hooks/useUpload';
import { PostFormInput, postSchema } from '@/schemas/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Badge, Plus, Save, Send, Upload, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Editor from '../posts/editor/editor';
import Image from 'next/image';
import { ScrollArea } from '../ui/scroll-area';

interface CreatePostFormProps {
    initialData?: Partial<PostFormInput>, 
    onSubmit: (data: PostFormInput) => void,
    isEditMode?: boolean,
    isLoading : boolean,
}


const PostForm : React.FC<CreatePostFormProps> = ({  
    onSubmit, 
    initialData,
    isEditMode = false,
    isLoading
}) => {
    const [activeTab, setActiveTab] = useState("write")
    const [tagInput, setTagInput] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const imageUpload = useUpload()
    const defaultValues: PostFormInput = {
        id: initialData?.id ?? undefined,
        title : initialData?.title ?? "",
        image : initialData?.image ?? "",
        content : initialData?.content ?? "",
        tags : initialData?.tags ?? [],
    };
    const form = useForm<PostFormInput>({
        resolver: zodResolver(postSchema),
        defaultValues,
    });
  
  
    const handleSubmit = (data: PostFormInput) => {
        if (isEditMode) {
          // For update operations, only include changed fields
          const changedFields = Object.entries(data).reduce((acc, [key, value]) => {
            // @ts-ignore - This is a safe operation since we're checking key existence
            if (value !== defaultValues[key]) {
              // @ts-ignore
              acc[key] = value;
            }
            return acc;
          }, {} as Partial<PostFormInput>);
          
          // If no fields changed, include the ID at minimum for API identification
          if (Object.keys(changedFields).length === 0 && initialData?.id) {
            // @ts-ignore - id might not be in the schema but needed for API
            changedFields.id = initialData.id;
          }
          
    
          
          // Only pass changed fields to the parent onSubmit handler
          onSubmit(data);
        } else {
          // For create, pass all fields
          onSubmit(data);
        }
      };
  
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "banner") => {
      const file = e.target.files?.[0]
      if (!file) return
  
      try {
        if (field === "image") {
          // Show local preview immediately
          const previewUrl = URL.createObjectURL(file)
          setImagePreview(previewUrl)
          
          // Start upload to Pinata
          const result = await imageUpload.uploadAsync(file)
          
          // Set the actual IPFS URL to the form
          form.setValue("image", result.pinataUrl)
          toast({
            title: "Image uploaded",
            description: "Community image has been uploaded successfully.",
          })
        } 
      } catch (error) {
        console.error(`Error uploading ${field}:`, error)
        toast({
          title: "Upload failed",
          description: `Failed to upload ${field}. Please try again.`,
          variant: "destructive",
        })
      }
    }
    function onSaveDraft(currentTitle: any, content: string | undefined) {
        throw new Error('Function not implemented.');
    }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="grid gap-4 py-4">
      <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
              <Input
                  id="title"
                  placeholder="Enter a descriptive title"
                  {...field}
                  
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
       />
          <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Image</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="community-image"
                    onChange={(e) => handleImageUpload(e, "image")}
                    disabled={imageUpload.isUploading}
                  />
                  <label
                    htmlFor="community-image"
                    className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${imageUpload.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {imageUpload.isUploading ? `Uploading ${imageUpload.progress}%` : "Upload Image"}
                  </label>
                  <Input
                    {...field}
                    placeholder="Or enter image URL"
                    onChange={(e) => {
                      field.onChange(e)
                      setImagePreview(e.target.value)
                    }}
                    disabled={imageUpload.isUploading}
                  />
                </div>
                {imageUpload.isUploading && (
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${imageUpload.progress}%` }}
                    ></div>
                  </div>
                )}
                {(imagePreview || field.value) && (
                  <Card className="overflow-hidden w-[12rem] h-[16rem]">
                    <CardContent className="p-3">
                      <div className="overflow-hidden rounded-[10px]">
                        <Image
                          src={imagePreview ?? field.value}
                          alt="Community image preview"
                          className="h-full w-full object-cover"
                          width={1000}
                          height={1000}
                          onError={() => setImagePreview("/placeholder.svg?text=Invalid+Image")}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </FormControl>
            <FormDescription>Upload a square image for your community profile</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (up to 5)</FormLabel>
            <FormControl>
              <div className="grid gap-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {field.value.map((tag, index) => (
                    <Badge key={index} className="gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = [...field.value];
                          newTags.splice(index, 1);
                          field.onChange(newTags);
                        }}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {tag} tag</span>
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput && field.value.length < 5) {
                        e.preventDefault();
                        if (!field.value.includes(tagInput)) {
                          field.onChange([...field.value, tagInput]);
                          setTagInput("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      if (tagInput && field.value.length < 5 && !field.value.includes(tagInput)) {
                        field.onChange([...field.value, tagInput]);
                        setTagInput("");
                      }
                    }}
                    disabled={!tagInput || field.value.length >= 5}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Add up to 5 tags to categorize your post
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
       />
  
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mb-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="flex-1 overflow-auto">
          <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <div className="min-h-[300px]">
                <Editor onChange={field.onChange} initialContent={field.value} />
              </div>
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
       />
         
          </TabsContent>
          <TabsContent value="preview" className="flex-1 overflow-auto border rounded-md p-4">
            {form.watch('content') ? (
              <ScrollArea>
              <div className="prose dark:prose-invert max-w-none max-h-[33rem]" dangerouslySetInnerHTML={{ __html: form.watch('content') }} />
              </ScrollArea>
            ) : (
              <div className="text-muted-foreground text-center py-12">
                No content to preview. Start writing to see a preview.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="gap-2 sm:gap-0 flex justify-end gap-2">
              {/* <Button variant="outline" onClick={handleSaveDraft} disabled={!form.getValues("title")}>
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button> */}
        <Button type="submit">
          <Send className="mr-2 h-4 w-4" />
          Publish Post
        </Button>
      </div>
    </form>
  </Form>
  )
}

export default PostForm


