"use client";
import React from 'react'
import { Button } from '../ui/button'
import useLoginDialogStore from '@/store/useLoginDialog'
 
const AuthButtons = () => {
  const {openLogin} = useLoginDialogStore()

  return (
    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
    <Button className='rounded-[10px]' onClick={openLogin}>Join Now</Button>
  </div>
  )
}

export default AuthButtons
