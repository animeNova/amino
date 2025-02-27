import { ColumnType, Generated } from 'kysely'

export interface BaseEntity {
  createdAt: ColumnType<Date, string, never>;
  updatedAt: ColumnType<Date, string, never>;
  }

interface Database {
  user: UsersTable;
  session: SessionTable;
  account : AccountTable;
  verification : VerificationTable;
}

interface UsersTable extends BaseEntity {
  id: Generated<string>
  email: string;
  name: string;
  emailVerified:boolean;
  image?:string;
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

export type { Database }