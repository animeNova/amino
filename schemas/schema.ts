import { z } from "zod";

export const baseCommunitySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required").max(50, "Name cannot exceed 50 characters"),
    handle: z.string().min(1, "Handle is required").max(50, "Handle cannot exceed 50 characters"),
    description: z.string().max(200, "Description cannot exceed 200 characters"),
    image: z.string().url("Please enter a valid URL for the image"),
    banner: z.string().url("Please enter a valid URL for the banner"),
    language: z.string().min(1, "Language is required").max(50, "Language cannot exceed 50 characters"),
    visibility: z.enum(['public', 'private']).default('public'),
    genre_id: z.string().nonempty("Genre is required")
  });
  
  // Unified schema for both create and update
  export const communitySchema = baseCommunitySchema;
  
  // Define our type
  export type CommunityFormInput = z.infer<typeof communitySchema>;

  

export const createCommentSchema = z.object({
    content : z .string().min(1, { message: "Content is required" }),
    parentId : z.string().optional(),
})

export const updateCommentSchema = z.object({
    content: z.string().min(1).max(50),  
})

export const baseGenreSchema = z.object({
    id : z.string().optional(),
    name: z.string().min(1).max(50), 
    description: z.string().min(1).max(50), 
})
export const genreSchema = baseGenreSchema;
export type GenreFormInput = z.infer<typeof genreSchema>;


export const createPostSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content : z.string().min(1, { message: "Content is required" }),
    image : z.string().url(),
    tags : z.array(z.string()),
})


export const updatePostSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content : z.string().min(1, { message: "Content is required" }),
    image : z.string().url(),
    tags : z.array(z.string()),
})
