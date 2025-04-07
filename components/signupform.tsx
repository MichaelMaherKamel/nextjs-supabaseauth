'use client'

import { signUpAction } from '@/app/actions'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { SmtpMessage } from '@/app/(auth-pages)/smtp-message'
import { useState } from 'react'
import { CheckIcon } from 'lucide-react'

// Define types for role
type UserRole = 'mentor' | 'individual' | 'organization'

// Interface for role options
interface RoleOption {
  id: UserRole
  label: string
  description: string
}

// Props interface for RoleSelection component
interface RoleSelectionProps {
  selectedRole: UserRole
  onRoleChange: (role: UserRole) => void
}

// Client component for role selection
function RoleSelection({ selectedRole, onRoleChange }: RoleSelectionProps) {
  const roles: RoleOption[] = [
    { id: 'mentor', label: 'Mentor', description: 'Someone offering mentorship/coaching' },
    { id: 'individual', label: 'Individual User', description: 'A person seeking 1:1 mentorship or attending events' },
    {
      id: 'organization',
      label: 'Organization User',
      description: 'A representative of a company/school enrolling as a team',
    },
  ]

  return (
    <div className='space-y-3 mb-4'>
      <Label>Account Type</Label>
      <input type='hidden' name='userRole' value={selectedRole} />
      <div className='space-y-2'>
        {roles.map((role) => (
          <div
            key={role.id}
            className={`border p-3 rounded-md cursor-pointer transition-all
              ${selectedRole === role.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50'}`}
            onClick={() => onRoleChange(role.id)}
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>{role.label}</h3>
                <p className='text-xs text-foreground/70'>{role.description}</p>
              </div>
              {selectedRole === role.id && (
                <div className='h-5 w-5 rounded-full bg-primary flex items-center justify-center'>
                  <CheckIcon className='h-3 w-3 text-white' />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Props interface for SignupForm component
interface SignupFormProps {
  searchParams: Message | Record<string, unknown>
}

// Client wrapper for the signup form
export default function SignupForm({ searchParams }: SignupFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('individual')

  if ('message' in searchParams) {
    return (
      <div className='w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4'>
        <FormMessage message={searchParams as Message} />
      </div>
    )
  }

  return (
    <>
      <form className='flex flex-col min-w-64 max-w-80 mx-auto'>
        <h1 className='text-2xl font-medium'>Sign up</h1>
        <p className='text-sm text text-foreground'>
          Already have an account?{' '}
          <Link className='text-primary font-medium underline' href='/sign-in'>
            Sign in
          </Link>
        </p>
        <div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
          <Label htmlFor='displayName'>Display Name</Label>
          <Input name='displayName' placeholder='Your name' required />

          <Label htmlFor='email'>Email</Label>
          <Input name='email' placeholder='you@example.com' required />

          <Label htmlFor='password'>Password</Label>
          <Input type='password' name='password' placeholder='Your password' minLength={6} required />

          <RoleSelection selectedRole={selectedRole} onRoleChange={setSelectedRole} />

          <SubmitButton formAction={signUpAction} pendingText='Signing up...'>
            Sign up
          </SubmitButton>

          <FormMessage message={searchParams as Message} />
        </div>
      </form>
      <SmtpMessage />
    </>
  )
}
