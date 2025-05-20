'use client';
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

const BackToFeedBtn = () => {
  const router = useRouter();
  return (
    <Button variant="ghost" size="sm" className="mr-auto" onClick={() => router.back()}  >
    <ChevronLeft className="mr-2 h-4 w-4" />
    Back to Feed
  </Button>
  )
}

export default BackToFeedBtn
