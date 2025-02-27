"use client";
import { useSession } from '@/lib/auth/clinet';
import React from 'react'
import UserButton from './UserButton';
import AuthButtons from './AuthButton';

const index = () => {
    const {data,isPending} = useSession()

    if(isPending){
        return "Loading"
    }
  return (
    <div>
      <div>
        {
          data?.user ? (
            <UserButton id={data.user.id} name={data.user.name} image={data.user.image} /> 
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
