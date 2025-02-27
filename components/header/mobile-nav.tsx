'use client';
import React from 'react'
import { NavLinks } from './links'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const MobileNav = () => {
  const path = usePathname()
  return (
    <div className='md:hidden'>
  
    <section className='block border border-t max-h-[70px]  fixed bottom-0 px-3 backdrop-blur-lg py-2 backf bg-background/30 w-full '>
      <div className='flex items-center justify-between bg mx-3'>
        {
            NavLinks.map((link) => {
                const isActive = path.endsWith(link.href);
                return (
                    <button key={link.href} className='flex flex-col justify-center text-sm items-center gap-1'>
                    <span className={cn('p-2 rounded-full',isActive && 'dark:bg-white bg-black dark:text-black text-white ')}>    
                        <link.icon className='!w-5 !h-5' />         
                    </span>
                        {link.name}
                    </button>
                )
            })
        }
      </div>
    </section>
    </div>
  )
}

export default MobileNav
