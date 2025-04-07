'use client'

import { signOutAction } from '@/app/actions'
import { hasEnvVars } from '@/utils/supabase/check-env-vars'
import Link from 'next/link'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User, LogOut, Settings, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

// Server component wrapper - gets user data
export default function AuthButtonWrapper({ user }: { user: any | null }) {
  if (!hasEnvVars) {
    return (
      <div className='flex gap-4 items-center'>
        <div className='flex gap-2'>
          <Button asChild size='sm' variant={'outline'} disabled className='opacity-75 cursor-none pointer-events-none'>
            <Link href='/sign-in'>Sign in</Link>
          </Button>
          <Button asChild size='sm' variant={'default'} disabled className='opacity-75 cursor-none pointer-events-none'>
            <Link href='/sign-up'>Sign up</Link>
          </Button>
        </div>
      </div>
    )
  }

  return user ? (
    <UserMenu user={user} />
  ) : (
    <div className='flex gap-2'>
      <Button asChild size='sm' variant={'outline'}>
        <Link href='/sign-in'>Sign in</Link>
      </Button>
      <Button asChild size='sm' variant={'default'}>
        <Link href='/sign-up'>Sign up</Link>
      </Button>
    </div>
  )
}

// Client component for the dropdown menu
function UserMenu({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)

  // Get the display name from user metadata
  const displayName = user.user_metadata?.displayName || user.email?.split('@')[0] || 'User'

  // Get initials for the avatar
  const getInitials = (name: string) => {
    if (name.includes('@')) {
      // If it's an email, use first letter
      return name.charAt(0).toUpperCase()
    }
    // Try to get initials from display name (first and last name)
    const names = name.split(' ')
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }
    // If just one name, use first letter
    return name.charAt(0).toUpperCase()
  }

  const initials = getInitials(displayName)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full' size='icon'>
          <Avatar className='h-8 w-8'>
            <AvatarFallback className='bg-primary/10 text-primary'>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            <p className='font-medium'>{displayName}</p>
            <p className='text-xs text-muted-foreground w-[200px] truncate'>{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className='px-2 py-1.5'>
          <div className='flex items-center'>
            <ShieldCheck className='mr-2 h-4 w-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>Role:</span>
            <span className='text-sm ml-2 font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-md'>
              {user.user_metadata?.role || 'No role'}
            </span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <form action={signOutAction} className='w-full'>
          <Button
            type='submit'
            variant='ghost'
            className='cursor-pointer flex w-full items-center justify-start px-2 py-1.5 text-sm'
          >
            <LogOut className='mr-2 h-4 w-4' />
            <span>Sign out</span>
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
