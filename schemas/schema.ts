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

export const basePostSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(1, { message: "Title is required" }),
    content : z.string().min(14, { message: "Content is required" }),
    image : z.string().url("Please enter a valid URL for the image"),
    tags : z.array(z.string()).min(1, { message: "At least one tag is required" }),
});
  
  // Unified schema for both create and update
  export const postSchema = basePostSchema;
  
  // Define our type
  export type PostFormInput = z.infer<typeof postSchema>;
  



export const updatePostSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content : z.string().min(1, { message: "Content is required" }),
    image : z.string().url(),
    tags : z.array(z.string()),
})


export const updateJoinRequestSchema = z.object({
    status: z.enum(['accepted', 'rejected'] , {
        message : 'Status must be either accepted or rejected'
    }),
})

// Define the form schema
export const updateUserSchema = z.object({
    // Profile step
    name: z.string().min(3, "Username must be at least 3 characters").max(30, "Username cannot exceed 30 characters"),
    image: z.string().optional(),
    coverImage: z.string().optional(),
    bio: z.string().max(160, "Bio cannot exceed 160 characters").optional(),
    location: z.string().max(100, "Location cannot exceed 100 characters").optional(),
    website: z.string().url().optional(),
})



/**
 * Chat Room Schemas
 */
export const baseChatRoomSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Room name is required").max(50, "Room name cannot exceed 50 characters"),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
  image: z.string().url("Please enter a valid URL for the room image").optional().nullable(),
  type: z.enum(['public', 'private', 'direct'], {
    message: "Room type must be either public, private, or direct"
  }).default('public'),
  community_id: z.string().nonempty("Community is required")
});

// Unified schema for both create and update
export const chatRoomSchema = baseChatRoomSchema;

// Define our type
export type ChatRoomFormInput = z.infer<typeof chatRoomSchema>;

/**
 * Chat Message Schemas
 */
export const baseChatMessageSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, "Message content is required").max(2000, "Message cannot exceed 2000 characters"),
  attachments: z.any().optional().nullable(),
  type: z.string().default('text'),
  room_id: z.string().nonempty("Chat room is required"),
  reply_to: z.string().optional().nullable()
});

// Unified schema for both create and update
export const chatMessageSchema = baseChatMessageSchema;

// Define our type
export type ChatMessageFormInput = z.infer<typeof chatMessageSchema>;

// Schema for updating a message (only content can be updated)
export const updateChatMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(2000, "Message cannot exceed 2000 characters"),
});
