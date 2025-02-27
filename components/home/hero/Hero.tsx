'use client'
import React from 'react'
import { Button } from '../../ui/button'
import { motion } from "framer-motion"
import { TypingAnimation } from '@/components/magicui/typing-animation'
import { Particles } from '@/components/magicui/particles'
import Aurora from '@/components/ui/Aurora'

const Hero = () => {
  return (
    <section 
    className=" space-y-6 py-8 md:py-12 lg:py-32 relative overflow-hidden w-full h-full">
    <div className="absolute inset-0 overflow-hidden w-full h-full">
      <div className="absolute w-full h-full ">
          <Aurora
           colorStops={["#f3f", "#f7f", "#FF3232"]}
           blend={0.5}
           amplitude={1.0}
           speed={0.5}
          />
      </div>
    </div>
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
    layout className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center relative z-10 backdrop-blur-sm  rounded-lg p-8">
      <h1 className='font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl'>
        Connect with people <br /> who{" "} <br />
        <TypingAnimation className='font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#f3f] to-[#FF3232] bg-clip-text text-transparent'>
        share your passion
        </TypingAnimation>
        
      </h1>
      <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        Join vibrant communities, share your interests, and make meaningful connections. Your tribe is waiting for
        you.
      </p>
      <div className="space-y-3 md:space-x-4">
        <Button className='font-bold h-11 ' variant={'outline'}>
          Explore Communities
        </Button>
      </div>
    </motion.div>
  </section>
  )
}

export default Hero
