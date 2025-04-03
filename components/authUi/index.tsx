import { useSession } from '@/lib/auth/clinet';
import React from 'react'
import UserButton from './UserButton';
import AuthButtons from './AuthButton';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const index =async () => {
    const session = await auth.api.getSession({
      headers: await headers()
  })
  return (
    <div>
      <div>
        {
          session?.user ? (
            <UserButton id={session.user.id} name={session.user.name} image={session.user.image} role={session.user.role} /> 
          ) : 
          (
              <AuthButtons />
          )
        }
      </div>
 
    </div>
  )
}

export default index
