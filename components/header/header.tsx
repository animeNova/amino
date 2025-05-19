import Link from 'next/link'
import React from 'react'
import AuthUi from '@/components/authUi'
import MobileNav from './mobile-nav'
const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-foreground/10 ">
    <div className="flex h-14 items-center justify-between mx-6">
      <div className="flex items-center">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <span className="font-bold text-xl">Amino</span>
        </Link>
      </div>
    
      <AuthUi/>
    </div>
  </header>
  )
}

export default Header
