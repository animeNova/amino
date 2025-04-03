"use client";
import React from 'react'
import { Button } from "@/components/ui/button"
import { FaGoogle , FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import useLoginDialogStore from '@/store/useLoginDialog'
import { ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/auth/clinet';
import { toast } from 'sonner';
import { MdErrorOutline } from "react-icons/md";
import { CiCircleInfo } from "react-icons/ci";


const LoginSchema = z.object({
  email: z.string().email()
})
const LoginDialog = () => {
    const {isOpen,closeLogin} = useLoginDialogStore()
    const form = useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: ""
      },
    })
   const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
      const {error} = await signIn.magicLink({
        email : values.email
      }) 
      if(error){
        return toast(error.message , {
          icon : <MdErrorOutline />
        })
      }
      return toast('An email has been sent to you!' , {
        icon : <CiCircleInfo />
      }) 
    }
  return (

       <Dialog open={isOpen}  onOpenChange={closeLogin} >
      <DialogContent className="bg-transparent border-none shadow-none" hideCloseButton >
      <div className="flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
       
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-[2.5rem] blur-3xl" />
        <div className="relative backdrop-blur-xl  dark:bg-black/40 border border-white/10 rounded-[2rem] p-8 shadow-2xl">
          <span className='fixed top-3 right-5 hover:bg-primary rounded-full p-1 transition-colors '>
            <X size={17} className='cursor-pointer text-white' onClick={closeLogin} />
          </span>
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex justify-center">
        
            <DialogTitle className='text-white'>
            Welcome To  <span className="font-bold text-xl ">Amino</span>
            </DialogTitle>
            </div>

            {/* Social Logins */}
            <div className="space-y-3">
              <Button
                className="w-full bg-white hover:bg-gray-50 !text-black font-medium rounded-xl h-12 transition-all hover:scale-[1.02] "
                variant="ghost"
                onClick={() => signIn.social({
                  provider : 'google'
                })}
              >
                <FaGoogle size={20} />
                Continue with Google
                <ArrowRight className="w-4 h-4 ml-2 opacity-60" />
              </Button>

              <Button
                className="w-full !bg-[#24292e] !text-white font-medium rounded-xl h-12 transition-all hover:scale-[1.02] "
                variant="ghost"
                onClick={() => signIn.social({
                  provider : 'github'
                })}
              >
                <FaGithub size={20} />
                Continue with GitHub
                <ArrowRight className="w-4 h-4 ml-2 opacity-60" />
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-white/60 font-medium px-2">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Login */}
            <div className="space-y-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input className='border-white/20 placeholder:text-white/50' placeholder="Please Enter Your Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
            <Button
                  className="w-full bg-primary/70 hover:bg-primary/60 backdrop:backdrop-blur-sm !text-white font-medium rounded-xl h-12 transition-all hover:scale-[1.02]"
                  variant="ghost"
                  type='submit'
                >
                  Sign in with email
                  <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

                  </form>
                </Form>
                      
              </motion.div>
            </div>
  
          </div>
        </div>
 
      </motion.div>
    </div>

      </DialogContent>
    </Dialog>

  )
}

export default LoginDialog
