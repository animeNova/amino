"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Router } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { MemberRole, updateMemberRole } from "@/app/actions/members/update"
import { useRouter } from "next/navigation"

const roles = [
  {
    value: "admin",
    label: "admin",
  },
  {
    value: "moderator",
    label: "moderator",
  },
  {
    value: "member",
    label: "member",
  },
]

interface MemberRoleDropdownProps {
  memberId: string;
  currentRole: string;
  communityId : string;
}

export function MemberRoleDropdown({ memberId, currentRole , communityId }: MemberRoleDropdownProps) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState(currentRole)
  const [isChanging, setIsChanging] = useState(false)
  const router = useRouter()
  const handleRoleChange = async (newRole: string) => {
    if (newRole === role) {
      setOpen(false)
      return
    }

    setIsChanging(true)

    try {
      // Simulate API call to update Member role
      await new Promise((resolve) => setTimeout(resolve, 500))
      const updatedMember = await updateMemberRole({
        communityId,
        memberId,
        newRole: newRole as MemberRole,
      })
      if(updatedMember){
        setRole(newRole)
        toast({
          title: "Role updated",
          description: `Member role has been updated to ${newRole}.`,
        })
    
      }
      else {
        toast({
          title: "Error",
          description: "Failed to update Member role. Please try again.",
          variant: "destructive",
        })
      }
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Member role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChanging(false)
      setOpen(false)
    }
  }

  const getRoleBadgeClass = (roleValue: string) => {
    switch (roleValue) {
      case "admin":
        return "bg-purple-900 text-purple-300 hover:bg-purple-700"
      case "moderator":
        return "bg-yellow-900 text-yellow-300 hover:bg-yellow-700"
      default:
        return "bg-gray-800 text-gray-300"
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[140px] justify-between", getRoleBadgeClass(role))}
          disabled={isChanging}
        >
          {role}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-background">
        <Command>
          <CommandInput placeholder="Search role..." />
          <CommandList>
            <CommandEmpty>No role found.</CommandEmpty>
            <CommandGroup>
              {roles.map((roleOption) => (
                <CommandItem
                  key={roleOption.value}
                  value={roleOption.value}
                  onSelect={() => handleRoleChange(roleOption.value)}
                >
                  <Check className={cn("mr-2 h-4 w-4", role === roleOption.value ? "opacity-100" : "opacity-0")} />
                  <div className="flex flex-col">
                    <span>{roleOption.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
