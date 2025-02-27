import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../theme/theme'
import AuthUi from '@/components/authUi'
const Header = () => {
  return (
    <header className="static top-0 z-50 w-full border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-14 items-center justify-between mx-6">
      <div className="ml-6 flex">
        <Link className="mr-6 flex items-center space-x-2" href="/">
          <span className="font-bold text-xl">Amino</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#discover">
            Discover
          </Link>
          <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="#communities">
            Communities
          </Link>
        </nav>
      </div>
      <div className="flex items-center justify-center space-x-2 ">
        <AuthUi/>
        <ModeToggle />
      </div>
    </div>
  </header>
  )
}

export default Header
