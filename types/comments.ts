export interface CommentWithUser {
  id: string;
  content: string;
  user_id: string;
  userName: string;
  userImage: string | undefined;
  created_at: Date;
  updated_at: Date;
  is_edited: boolean;
  is_deleted: boolean;
  reply_count: number;
  depth: number;
  parent_id: string | null;
  path: string[];
}

export interface NestedComment extends CommentWithUser {
  replies: NestedComment[];
}

export interface GetCommentsOptions {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}

export interface GetCommentsResult {
  comments: NestedComment[];
  totalCount: number;
}