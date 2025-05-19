import { ColumnType, Generated, Insertable, Selectable, Updateable } from 'kysely'

export interface BaseEntity {
  createdAt: ColumnType<Date, string, never>;
  updatedAt: ColumnType<Date, string, never>;
  }

interface Database {
  user: UsersTable;
  session: SessionTable;
  account : AccountTable;
  verification : VerificationTable;
  user_activities: UserActivitiesTable;
  user_levels: UserLevelsTable;
  level_definitions: LevelDefinitionsTable;
  community : CommuityTable;
  join_requests : JoinRequestTable;
  members : MembersTable;
  genre : GenreTable;
  posts : PostsTable;
  post_likes : PostLikesTable;
  comments : CommentsTable;
  comments_likes : CommentLikesTable;
  followers: FollowersTable;
  chat_rooms: ChatRoomsTable;
  chat_messages: ChatMessagesTable;
  chat_room_members: ChatRoomMembersTable; // Add chat room members table
}

interface UsersTable extends BaseEntity {
  id: Generated<string>
  email: string;
  name: string;
  emailVerified:boolean;
  image?:string;
  role : 'user' | 'admin' | 'owner';
  bio ?: string;
  location?: string;
  website?: string;
  coverImage?: string;
  is_new : boolean;
}

interface SessionTable extends BaseEntity {
  id: Generated<string>
  userId : string;
  token : string;
  ipAddress : string;
  userAgent : string;
}

interface AccountTable extends BaseEntity {
  id: Generated<string>
  userId : string;
  accountId ?: string;
  providerId ?: string;
  accessToken ?: string;
  refreshToken ?: string;
  accessTokenExpiresAt ?: Date;
  refreshTokenExpiresAt ?: Date;
  scope ?: string;
  idToken ?: string;
  password ?: string;
}

interface VerificationTable extends BaseEntity {
  id: Generated<string>
  identifier : string;
  value : string;
  expiresAt : Date;
}

export interface UserActivitiesTable {
  id: Generated<string>;
  user_id: string;
  activity_type: string;
  points: number;
  created_at: ColumnType<Date, string | undefined, never>;
}

export interface UserLevelsTable {
  id: Generated<string>;
  user_id: string;
  level: number;
  current_points: number;
  points_to_next_level: number;
  updated_at: ColumnType<Date, string | undefined, never>;
  $$transform: {
    type: 'notnull';
  };
}

export interface LevelDefinitionsTable {
  level: number;
  points_required: number;
  title: string | null;
  badge_url: string | null;
  benefits: string | null;
}

export interface CommuityTable {
  id: Generated<string>;
  name : string;
  handle : string;
  description : string;
  language : string;
  visibility : 'public' | 'private';
  image : string;
  banner : string;
  created_by : string;
  genre_id : string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export interface JoinRequestTable {
  id: Generated<string>;
  user_id: string;
  community_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_at: ColumnType<Date, string | undefined, never>;
  responded_at: ColumnType<Date, string | undefined, never>;
  responded_by ?: string;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export interface MembersTable {
  id: Generated<string>;
  user_Id: string;
  communityId:string;
  role : 'member' | 'moderator' | 'admin';
  approved_by ?: string;
  joined_at: ColumnType<Date, string | undefined, never>;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export interface GenreTable {
  id: Generated<string>;
  name: string;
  description: string;
  created_by: string;
  created_at: ColumnType<Date, string | undefined, never>;
}
export interface PostsTable {
  id: Generated<string>;
  title : string;
  content : string;
  image : string;
  tags : string[];
  user_id : string;
  community_id : string;
  status : 'pending' | 'accepted' | 'rejected';
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}
export interface CommentsTable {
  id: Generated<string>;
  post_id: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  depth: number;
  reply_count: number;
  position: number | null;
  path: string[];
  is_edited: boolean;
  is_deleted: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export interface PostLikesTable {
  user_id: string;
  post_id: string;
}

export interface CommentLikesTable {
  user_id: string;
  comment_id: string;
  created_at: ColumnType<Date, string | undefined, never>;

}

// Add the new FollowersTable interface
export interface FollowersTable {
  id: Generated<string>;
  follower_id: string;
  following_id: string;
  created_at: ColumnType<Date, string | undefined, never>;
}




// Add the new ChatRoomsTable interface
export interface ChatRoomsTable {
  id: Generated<string>;
  name: string;
  description: string | null;
  image: string | null;
  type: 'public' | 'private' | 'direct';
  community_id: string;
  created_by: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

// Add the new ChatMessagesTable interface
export interface ChatMessagesTable {
  id: Generated<string>;
  content: string;
  attachments: any | null;
  type: string;
  room_id: string;
  user_id: string;
  reply_to: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, never>;
}

export type User = Selectable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type UserActivity = Selectable<UserActivitiesTable>;
export type NewUserActivity = Insertable<UserActivitiesTable>;

export type UserLevel = Selectable<UserLevelsTable>;
export type NewUserLevel = Insertable<UserLevelsTable>;
export type UserLevelUpdate = Updateable<UserLevelsTable>;

export type LevelDefinition = Selectable<LevelDefinitionsTable>;
export type NewLevelDefinition = Insertable<LevelDefinitionsTable>;

export type Community = Selectable<CommuityTable>;
export type NewCommunity = Insertable<CommuityTable>;
export type CommunityUpdate = Updateable<CommuityTable>;

export type JoinRequest = Selectable<JoinRequestTable>;
export type NewJoinRequest = Insertable<JoinRequestTable>;
export type JoinRequestUpdate = Updateable<JoinRequestTable>;

export type Members = Selectable<MembersTable>;
export type NewMember = Insertable<MembersTable>;
export type MemberUpdate = Updateable<MembersTable>;

export type Genre = Selectable<GenreTable>;
export type NewGenre = Insertable<GenreTable>;
export type GenreUpdate = Updateable<GenreTable>;

export type Posts = Selectable<PostsTable>;
export type NewPost = Insertable<PostsTable>;
export type PostUpdate = Updateable<PostsTable>;

export type PostLikes = Selectable<PostLikesTable>;
export type NewPostLike = Insertable<PostLikesTable>;
export type PostLikeUpdate = Updateable<PostLikesTable>;

export type PostComments = Selectable<CommentsTable>;
export type NewPostComment = Insertable<CommentsTable>;
export type PostCommentUpdate = Updateable<CommentsTable>;

export type CommentLikes = Selectable<CommentLikesTable>;
export type NewCommentLike = Insertable<CommentLikesTable>;
export type CommentLikeUpdate = Updateable<CommentLikesTable>;

// Add types for Followers
export type Follower = Selectable<FollowersTable>;
export type NewFollower = Insertable<FollowersTable>;
export type FollowerUpdate = Updateable<FollowersTable>;


// Add types for ChatRooms
export type ChatRoom = Selectable<ChatRoomsTable>;
export type NewChatRoom = Insertable<ChatRoomsTable>;
export type ChatRoomUpdate = Updateable<ChatRoomsTable>;

// Add types for ChatMessages
export type ChatMessage = Selectable<ChatMessagesTable>;
export type NewChatMessage = Insertable<ChatMessagesTable>;
export type ChatMessageUpdate = Updateable<ChatMessagesTable>;

// Add the new ChatRoomMembersTable interface
export interface ChatRoomMembersTable {
  id: Generated<string>;
  room_id: string;
  user_id: string;
  role: string;
  is_muted: boolean;
  joined_at: ColumnType<Date, string | undefined, never>;
  last_read_at: ColumnType<Date, string | undefined, never>;
}

export type ChatRoomMember = Selectable<ChatRoomMembersTable>;
export type NewChatRoomMember = Insertable<ChatRoomMembersTable>;
export type ChatRoomMemberUpdate = Updateable<ChatRoomMembersTable>;

export type { Database }

